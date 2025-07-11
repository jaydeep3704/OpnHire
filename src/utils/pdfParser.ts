"use server"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
export async function extractTextFromPdf(resumeURL: string) {

  if (!resumeURL) {
    return {
      success: false,
      message: "Resume url is not valid",
      data: null
    }
  }



  try {
    const response = await fetch(resumeURL)
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const loader = new PDFLoader(new Blob([arrayBuffer]));
    const docs = await loader.load()

    //combine pages
    return docs.map((doc) => doc.pageContent).join('\n')

  } catch (error) {
    console.log(error)
  }


}