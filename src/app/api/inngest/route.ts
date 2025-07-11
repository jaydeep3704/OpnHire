import { serve } from "inngest/next";
import { inngest } from "@/utils/inngest/client";
import { handleJobExpiration, sendPeriodicJobListings, getAiResumeSummary } from "./functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [handleJobExpiration,sendPeriodicJobListings,getAiResumeSummary],
});
