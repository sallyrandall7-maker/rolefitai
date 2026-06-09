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
    applyRecommendation: {
      type: "object",
      additionalProperties: false,
      properties: {
        decision: {
          type: "string",
          enum: ["Yes", "Not yet", "No"],
          description: "Whether the candidate should apply based on current fit."
        },
        reason: {
          type: "string",
          description: "Short explanation of the apply recommendation."
        }
      },
      required: ["decision", "reason"]
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
    biggestRisks: {
      type: "array",
      items: { type: "string" },
      description: "The biggest diagnostic risks for this application, without rewrite examples."
    }
  },
  required: [
    "overallMatchScore",
    "atsKeywordMatch",
    "applicationReadiness",
    "applyRecommendation",
    "recruiterScan",
    "missingOrWeakKeywords",
    "topMatchingAreas",
    "biggestRisks"
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
          knownContextSupport: {
            type: "string",
            enum: ["Supported by known context", "Not supplied", "Not supported"]
          },
          contextUsed: { type: "string" },
          whyItMatters: { type: "string" }
        },
        required: [
          "keyword",
          "importance",
          "resumeStatus",
          "knownContextSupport",
          "contextUsed",
          "whyItMatters"
        ]
      }
    },
    weakestBullets: {
      type: "array",
      description: "Resume bullet changes that should be rewritten or newly added for the target role.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          action: {
            type: "string",
            enum: ["Rewrite", "Add"]
          },
          originalBullet: { type: "string" },
          issue: { type: "string" },
          targetKeywords: {
            type: "array",
            items: { type: "string" }
          },
          rewrittenBullet: { type: "string" },
          whyThisHelps: { type: "string" },
          evidenceUsed: { type: "string" },
          boundaryCheck: { type: "string" },
          truthfulnessNote: { type: "string" }
        },
        required: [
          "action",
          "originalBullet",
          "issue",
          "targetKeywords",
          "rewrittenBullet",
          "whyThisHelps",
          "evidenceUsed",
          "boundaryCheck",
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

export const profileOptimiserSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recruiterTargetSummary: {
      type: "string",
      description: "One sentence summarising what the recruiter is looking for in this job ad."
    },
    currentTopSectionRead: {
      type: "string",
      description: "How the resume's top profile/key capabilities currently reads against the recruiter target."
    },
    improvedProfile: {
      type: "string",
      description: "A truthful paste-ready profile/about me paragraph that integrates why me, problem solved, and motivation."
    },
    whyMe: {
      type: "string",
      description: "Why the candidate fits this role based on their supplied background."
    },
    problemToSolve: {
      type: "string",
      description: "The problem the candidate can help solve for this employer based on the job ad."
    },
    motivation: {
      type: "string",
      description: "A truthful motivation line, using the user's supplied motivation when provided."
    },
    whyThisProfileWorks: {
      type: "array",
      items: { type: "string" },
      description: "Reasons the improved profile better matches the job ad and first-page recruiter scan."
    },
    keyCapabilities: {
      type: "array",
      description: "Recommended key capabilities for the top of the resume.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          capability: { type: "string" },
          action: {
            type: "string",
            enum: ["Keep", "Add", "Reword", "Remove"]
          },
          suggestedWording: { type: "string" },
          evidenceSource: {
            type: "string",
            enum: [
              "Current Key Capabilities",
              "Profile/About Me",
              "Career Summary",
              "Role Detail",
              "Known Context",
              "Job Description Gap"
            ]
          },
          evidenceUsed: { type: "string" },
          boundaryCheck: { type: "string" },
          reason: { type: "string" }
        },
        required: [
          "capability",
          "action",
          "suggestedWording",
          "evidenceSource",
          "evidenceUsed",
          "boundaryCheck",
          "reason"
        ]
      }
    },
    topSectionGaps: {
      type: "array",
      items: { type: "string" },
      description: "Important job-ad signals that should show faster in the profile or key capabilities."
    },
    truthfulnessNote: {
      type: "string",
      description: "Reminder about what is supported and what the user should verify."
    }
  },
  required: [
    "recruiterTargetSummary",
    "currentTopSectionRead",
    "improvedProfile",
    "whyMe",
    "problemToSolve",
    "motivation",
    "whyThisProfileWorks",
    "keyCapabilities",
    "topSectionGaps",
    "truthfulnessNote"
  ]
};

export const contactNoteSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortNote: {
      type: "string",
      description: "A 150-250 word human LinkedIn message to a hiring manager after applying."
    },
    whyMeLine: {
      type: "string",
      description: "The strongest aligned experience used in the note."
    },
    whyThemLine: {
      type: "string",
      description: "The role need, operating style, or company context the note responds to."
    },
    toneCheck: {
      type: "string",
      description: "Short confirmation that the message is warm, not pushy, and suitable for LinkedIn."
    }
  },
  required: ["shortNote", "whyMeLine", "whyThemLine", "toneCheck"]
};

export const analysisSchema = roleMatchSchema;
