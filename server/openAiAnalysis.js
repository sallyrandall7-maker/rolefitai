import {
  bulletOptimiserInstructions,
  buildAnalysisInput,
  contactNoteInstructions,
  interviewPrepInstructions,
  profileOptimiserInstructions,
  roleMatchInstructions
} from "./analysisPrompt.js";
import {
  bulletOptimiserSchema,
  contactNoteSchema,
  interviewPrepSchema,
  profileOptimiserSchema,
  roleMatchSchema
} from "./analysisSchema.js";

const DEFAULT_MODEL = "gpt-5-mini";
const analysisConfigs = {
  roleMatch: {
    instructions: roleMatchInstructions,
    schema: roleMatchSchema,
    schemaName: "rolefit_analysis",
    maxOutputTokens: 2200
  },
  bulletOptimiser: {
    instructions: bulletOptimiserInstructions,
    schema: bulletOptimiserSchema,
    schemaName: "rolefit_bullet_optimiser",
    maxOutputTokens: 2600
  },
  profileOptimiser: {
    instructions: profileOptimiserInstructions,
    schema: profileOptimiserSchema,
    schemaName: "rolefit_profile_optimiser",
    maxOutputTokens: 2600
  },
  contactNote: {
    instructions: contactNoteInstructions,
    schema: contactNoteSchema,
    schemaName: "rolefit_contact_note",
    maxOutputTokens: 1800
  },
  interviewPrep: {
    instructions: interviewPrepInstructions,
    schema: interviewPrepSchema,
    schemaName: "rolefit_interview_prep",
    maxOutputTokens: 3600
  }
};

export async function requestOpenAiAnalysis({
  apiKey,
  resume,
  jobDescription,
  motivationNote = "",
  priorityRequirements = "",
  knownContext = "",
  companyName = "",
  interviewerName = "",
  analysisType = "roleMatch"
}) {
  const config = analysisConfigs[analysisType] || analysisConfigs.roleMatch;

  const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
      instructions: config.instructions,
      input: buildAnalysisInput({
        resume,
        jobDescription,
        motivationNote,
        priorityRequirements,
        knownContext,
        companyName,
        interviewerName
      }),
      max_output_tokens: config.maxOutputTokens,
      reasoning: {
        effort: "minimal"
      },
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: config.schemaName,
          strict: true,
          schema: config.schema
        }
      }
    })
  });

  const responseText = await openAiResponse.text();

  if (!openAiResponse.ok) {
    throw new Error(responseText);
  }

  const responseJson = JSON.parse(responseText);

  if (responseJson.status === "incomplete") {
    throw new Error(
      `OpenAI returned an incomplete response: ${responseJson.incomplete_details?.reason || "unknown reason"}`
    );
  }

  const outputText = getOutputText(responseJson);

  if (!outputText) {
    throw new Error("OpenAI response did not include output text.");
  }

  return JSON.parse(outputText);
}

function getOutputText(responseJson) {
  for (const item of responseJson.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text") {
        return content.text;
      }
    }
  }

  return "";
}
