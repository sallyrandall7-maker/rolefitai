import { requestOpenAiAnalysis } from "../server/openAiAnalysis.js";
import { consumeAccessCode } from "../server/inviteAccess.js";

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
    const priorityRequirements = String(request.body?.priorityRequirements || "").trim();
    const knownContext = String(request.body?.knownContext || "").trim();
    const companyName = String(request.body?.companyName || "").trim();
    const interviewerName = String(request.body?.interviewerName || "").trim();
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

    const accessCheck = await consumeAccessCode(request.body?.accessCode);

    if (!accessCheck.ok) {
      response.status(accessCheck.statusCode).json({
        error: accessCheck.error,
        accessStatus: accessCheck.accessStatus
      });
      return;
    }

    const analysis = await requestOpenAiAnalysis({
      apiKey,
      resume,
      jobDescription,
      motivationNote,
      priorityRequirements,
      knownContext,
      companyName,
      interviewerName,
      analysisType
    });

    response.status(200).json({
      ...analysis,
      accessStatus: accessCheck.accessStatus
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      error: "Something went wrong while analysing the resume."
    });
  }
}
