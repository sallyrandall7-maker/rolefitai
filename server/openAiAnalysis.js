import { analysisInstructions, buildAnalysisInput } from "./analysisPrompt.js";
import { analysisSchema } from "./analysisSchema.js";

const DEFAULT_MODEL = "gpt-5-mini";

export async function requestOpenAiAnalysis({ apiKey, resume, jobDescription }) {
  const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
      instructions: analysisInstructions,
      input: buildAnalysisInput({ resume, jobDescription }),
      max_output_tokens: 2200,
      reasoning: {
        effort: "minimal"
      },
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "rolefit_analysis",
          strict: true,
          schema: analysisSchema
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
