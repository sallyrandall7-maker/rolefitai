import { requestOpenAiAnalysis } from "../server/openAiAnalysis.js";

const MAX_TEXT_LENGTH = 20000;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      response.status(500).json({
        error: "OPENAI_API_KEY is missing from the deployment settings."
      });
      return;
    }

    const resume = String(request.body?.resume || "").trim();
    const jobDescription = String(request.body?.jobDescription || "").trim();
    const motivationNote = String(request.body?.motivationNote || "").trim();
    const analysisType = String(request.body?.analysisType || "roleMatch");

    if (!resume || !jobDescription) {
      response.status(400).json({
        error: "Please add both a resume and a job description."
      });
      return;
    }

    if (resume.length > MAX_TEXT_LENGTH || jobDescription.length > MAX_TEXT_LENGTH) {
      response.status(400).json({
        error: "Please keep each text box under 20,000 characters for this version."
      });
      return;
    }

    const analysis = await requestOpenAiAnalysis({
      apiKey,
      resume,
      jobDescription,
      motivationNote,
      analysisType
    });

    response.status(200).json(analysis);
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error: "Something went wrong while analysing the resume."
    });
  }
}
