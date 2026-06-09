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
    applicationReadiness: {
      type: "string",
      enum: ["Risk", "Needs work", "Strong", "Ready to submit"],
      description: "Plain-language readiness label for this application."
    },
    recruiterScan: {
      type: "object",
      additionalProperties: false,
      properties: {
        recruiterTargetSummary: {
          type: "string",
          description: "One sentence summarising what the recruiter is looking for in this job ad."
        },
        whatRecruiterIsLookingFor: {
          type: "array",
          items: { type: "string" },
          description: "Specific signals the recruiter is likely looking for based on the job ad."
        },
        whatRecruiterSees: {
          type: "array",
          items: { type: "string" },
          description: "Specific signals the recruiter quickly sees in the resume."
        },
        firstPageAlignment: {
          type: "array",
          items: { type: "string" },
          description: "Signals from the job ad that are visible in the resume's top profile, key capabilities, career summary, or first-page content."
        },
        firstPageGaps: {
          type: "array",
          items: { type: "string" },
          description: "Important job-ad signals that are not quickly visible in the resume's first-page content."
        },
        attentionGate: {
          type: "string",
          enum: ["Passes", "Partial", "Misses"],
          description: "Whether the first page captures recruiter attention for this job ad."
        },
        supportingEvidence: {
          type: "array",
          items: { type: "string" },
          description: "Fast-scan evidence from later resume content, second page, or previous roles that visibly supports or weakens the shortlist decision."
        },
        decision: {
          type: "string",
          enum: ["Reject", "Maybe", "Shortlist", "Strong Shortlist", "Must Screen"]
        },
        reason: {
          type: "string",
          description: "Short reason for the recruiter decision."
        }
      },
      required: [
        "recruiterTargetSummary",
        "whatRecruiterIsLookingFor",
        "whatRecruiterSees",
        "firstPageAlignment",
        "firstPageGaps",
        "attentionGate",
        "supportingEvidence",
        "decision",
        "reason"
      ]
    },
    missingOrWeakKeywords: {
      type: "array",
      items: { type: "string" },
      description: "Important job keywords that are missing or weak in the resume."
    },
    topMatchingAreas: {
      type: "array",
      items: { type: "string" },
      description: "Strongest resume-to-job matches."
    },
    resumeSuggestions: {
      type: "array",
      items: { type: "string" },
      description: "Practical improvements the candidate can make to the resume."
    },
    nextBestAction: {
      type: "string",
      description: "The clearest next action in the Apply Today workflow."
    }
  },
  required: [
    "overallMatchScore",
    "atsKeywordMatch",
    "applicationReadiness",
    "recruiterScan",
    "missingOrWeakKeywords",
    "topMatchingAreas",
    "resumeSuggestions",
    "nextBestAction"
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
          rewrittenBullet: { type: "string" },
          whyThisHelps: { type: "string" },
          truthfulnessNote: { type: "string" }
        },
        required: [
          "originalBullet",
          "issue",
          "targetKeywords",
          "rewrittenBullet",
          "whyThisHelps",
          "truthfulnessNote"
        ]
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
