export const analysisSchema = {
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
