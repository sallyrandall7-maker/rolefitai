export const roleMatchSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overallMatchScore: {
      type: "integer",
      description: "Overall match score from 0 to 100."
    },
    atsKeywordMatch: {
      type: "integer",
      description: "ATS keyword match score from 0 to 100."
    },
    recruiterSearchSimulation: {
      type: "string",
      description: "How discoverable the resume would be to a recruiter search."
    },
    missingOrWeakKeywords: {
      type: "array",
      items: { type: "string" },
      description: "Important job keywords that are missing or weak in the resume."
    },
    resumeSuggestions: {
      type: "array",
      items: { type: "string" },
      description: "Practical improvements the candidate can make to the resume."
    },
    interviewRiskAreas: {
      type: "array",
      items: { type: "string" },
      description: "Areas the candidate may be questioned about in interviews."
    },
    likelyInterviewQuestions: {
      type: "array",
      items: { type: "string" },
      description: "Likely interview questions based on the role and resume gaps."
    }
  },
  required: [
    "overallMatchScore",
    "atsKeywordMatch",
    "recruiterSearchSimulation",
    "missingOrWeakKeywords",
    "resumeSuggestions",
    "interviewRiskAreas",
    "likelyInterviewQuestions"
  ]
};

export const bulletOptimiserSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jobKeywords: {
      type: "array",
      description: "Important ATS keywords and phrases from the job description.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          keyword: { type: "string" },
          importance: {
            type: "string",
            enum: ["High", "Medium", "Low"]
          },
          resumeStatus: {
            type: "string",
            enum: ["Found", "Weak", "Missing"]
          },
          whyItMatters: { type: "string" }
        },
        required: ["keyword", "importance", "resumeStatus", "whyItMatters"]
      }
    },
    weakestBullets: {
      type: "array",
      description: "Resume bullets that should be improved for the target role.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalBullet: { type: "string" },
          issue: { type: "string" },
          targetKeywords: {
            type: "array",
            items: { type: "string" }
          },
          rewrittenBullet: { type: "string" }
        },
        required: ["originalBullet", "issue", "targetKeywords", "rewrittenBullet"]
      }
    },
    topFixes: {
      type: "array",
      description: "Short practical fixes to improve ATS keyword alignment.",
      items: { type: "string" }
    }
  },
  required: ["jobKeywords", "weakestBullets", "topFixes"]
};

export const analysisSchema = roleMatchSchema;
