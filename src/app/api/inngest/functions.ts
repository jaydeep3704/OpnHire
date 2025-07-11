import { prisma } from "@/utils/db";
import { inngest } from "../../../utils/inngest/client";
import { Resend } from "resend";
import { extractTextFromPdf } from "@/utils/pdfParser";
import { revalidatePath } from "next/cache";


const resend = new Resend(process.env.RESEND_API_KEY)

interface JobWithCompany {
    id: string;
    jobTitle: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
    Company: {
        name: string;
    };
};


export const handleJobExpiration = inngest.createFunction(
    {
        id: "expire-job", cancelOn: [
            {
                event: "job/cancel.expiration",
                if: "event.data.jobId==async.data.jobId"
            }
        ]
    },
    { event: 'job/created' },
    async ({ event, step }) => {
        const { jobId, expirationDays } = event.data
        await step.sleep("wait-for-expiration", `${expirationDays}d`)
        await step.run("update-job-status", async () => {
            await prisma.jobPost.update({
                where: {
                    id: jobId
                },
                data: {
                    status: "EXPIRED"
                }
            })
        })
        return { jobId, message: "Job marked as expired" }
    }
)

export const sendPeriodicJobListings = inngest.createFunction(
    { id: "send-job-listings" },
    { event: "jobseeker/created" },
    async ({ event, step }) => {
        const { userId, email } = event.data
        const totalDays = 30
        const intervalDays = 2
        let currentDay = 0;
        while (currentDay < totalDays) {
            await step.sleep("wait-interval", `${intervalDays}d`)
            currentDay += intervalDays;

            const recentJobs = await step.run("fetch-recent-jobs", async (): Promise<JobWithCompany[]> => {
                return await prisma.jobPost.findMany({
                    where: {
                        status: "ACTIVE"
                    },
                    select: {
                        id: true,
                        jobTitle: true,
                        location: true,
                        salaryFrom: true,
                        salaryTo: true,
                        Company: {
                            select: {
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 10,
                })
            })

            if (recentJobs.length > 0) {
                await step.run('send-email', async () => {
                    const jobListingsHTML = recentJobs.map((job) => `
                            <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
                            <h3 style="margin: 0;">${job.jobTitle}</h3>
                            <p style="margin: 5px 0;">${job.Company.name} • ${job.location}</p>
                            <p style="margin: 5px 0;">$${job.salaryFrom.toLocaleString()} – $${job.salaryTo.toLocaleString()}</p>
                            </div>
                        `).join("");

                    await resend.emails.send({
                        from: 'OpnHire <onboarding@resend.dev>',
                        to: [email],
                        subject: 'Latest Job opportunities for you',
                        html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                    <h2>Latest Job Opportunities</h2>
                                    ${jobListingsHTML}
                                    <div style="margin-top: 30px; text-align: center;">
                                        <a href="${process.env.NEXT_PUBLIC_URL}"
                                        style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                            View More Jobs
                                        </a>
                                    </div>
                                </div>
                            `
                    })
                })

            }
        }
        return { userId, message: "Completed 30 day job Listing notifications" }
    }
)



export const getAiResumeSummary = inngest.createFunction(
    {
        id: "create-ai-resume",
        name: "Create AI summary of uploaded resume"
    },

    { event: "resume/uploaded" },
    async ({ event, step }) => {
        const { resumeUrl, userId } = event.data

        if (!resumeUrl) return

        const pdfText = await extractTextFromPdf(resumeUrl)
        const prompt = `Act as a professional resume summarizer. Analyze the following resume extracted from a PDF:

${pdfText.toString()}

Summarize the resume strictly in markdown format, highlighting only the most important information under the following sections:

## Description about Candidate
- Short two-line description.

## Key Skills
- List of key skills.

## Education
- Degree, institution, and year.

## Projects
- One-line description for each project.

## Achievements
- Bullet points of achievements (if available).

Do not add extra commentary, explanation, or introductory text. Return only valid markdown content as output.

If the provided text does not resemble a resume, respond exactly with:
"This text does not appear to be a resume."
`;


        const result = await step.ai.infer("create-ai-summary", {
            model: step.ai.models.gemini({
                model: 'gemini-2.0-flash',
                apiKey: process.env.GEMINI_API_KEY
            }),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [{
                            text: prompt,
                        }],
                    }
                ]
            }
        })
        if (result) {
            await step.run('save-ai-summary', async () => {
                const summaryText = result?.candidates?.[0]?.content?.parts[0]["text"] ?? '';
                await prisma.jobSeeker.update({
                    where: {
                        userId: userId
                    },
                    data: {
                        resumeAiSummary: summaryText.toString()
                    }
                })

            })
        }
        return { success: true, result, message: "AI Summary for resume generated" }

    }
)

