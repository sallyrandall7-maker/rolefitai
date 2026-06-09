import http from "node:http";
import fs from "node:fs";
import { requestOpenAiAnalysis } from "./openAiAnalysis.js";

const PORT = 8787;
const MAX_TEXT_LENGTH = 20000;

function loadEnv() {
  if (!fs.existsSync(".env")) {
    return;
  }

  const lines = fs.readFileSync(".env", "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmedLine.indexOf("=");

    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, equalsIndex);
    const value = trimmedLine
      .slice(equalsIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    process.env[key] = value;
  }
}

loadEnv();

const server = http.createServer(async (request, response) => {
  setCorsHeaders(response);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/api/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && request.url === "/api/analyse") {
    await handleAnalyse(request, response);
    return;
  }

  sendJson(response, 404, { error: "Route not found." });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`RoleFit AI server running at http://127.0.0.1:${PORT}`);
});

async function handleAnalyse(request, response) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      sendJson(response, 500, {
        error: "OPENAI_API_KEY is missing from the .env file."
      });
      return;
    }

    const body = await readJsonBody(request);
    const resume = String(body.resume || "").trim();
    const jobDescription = String(body.jobDescription || "").trim();
    const motivationNote = String(body.motivationNote || "").trim();
    const analysisType = String(body.analysisType || "roleMatch");

    if (!resume || !jobDescription) {
      sendJson(response, 400, {
        error: "Please add both a resume and a job description."
      });
      return;
    }

    if (resume.length > MAX_TEXT_LENGTH || jobDescription.length > MAX_TEXT_LENGTH) {
      sendJson(response, 400, {
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

    sendJson(response, 200, analysis);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, {
      error: "Something went wrong while analysing the resume.",
      details: error.message
    });
  }
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 100000) {
        request.destroy();
        reject(new Error("Request body is too large."));
      }
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    request.on("error", reject);
  });
}

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}
