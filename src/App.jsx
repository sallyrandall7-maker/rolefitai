import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  ListChecks,
  Search,
  Sparkles,
  Upload
} from "lucide-react";
import headerImage from "./assets/career-coach-sunset-header.png";
import { sampleJobDescription, sampleResume } from "./sampleData.js";

const API_URL = import.meta.env.PROD
  ? "/api/analyse"
  : "http://127.0.0.1:8787/api/analyse";

const workflowSteps = ["Fit Check", "Improve Resume", "Re-Review", "Submit"];
const loadingSteps = [
  "Reading the resume",
  "Scanning the job description",
  "Checking ATS match",
  "Reviewing recruiter appeal",
  "Preparing recommended fixes"
];
const optimiserLoadingSteps = [
  "Extracting job ad keywords",
  "Checking resume keyword coverage",
  "Finding weaker bullet points",
  "Rewriting bullets truthfully",
  "Preparing top fixes"
];

function App() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fitAnalysis, setFitAnalysis] = useState(null);
  const [bulletAnalysis, setBulletAnalysis] = useState(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isOptimising, setIsOptimising] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const currentStep = bulletAnalysis || isOptimising ? "Improve Resume" : "Fit Check";
  const activeLoadingSteps = isOptimising ? optimiserLoadingSteps : loadingSteps;

  useEffect(() => {
    if (!isAnalysing && !isOptimising) {
      setLoadingStepIndex(0);
      return undefined;
    }

    const stepTimer = window.setInterval(() => {
      setLoadingStepIndex((currentIndex) =>
        Math.min(currentIndex + 1, activeLoadingSteps.length - 1)
      );
    }, 1400);

    return () => window.clearInterval(stepTimer);
  }, [activeLoadingSteps.length, isAnalysing, isOptimising]);

  async function handleDocxUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setError("");
    setUploadMessage("");

    if (!file.name.toLowerCase().endsWith(".docx")) {
      setError("Please upload a .docx resume. Paste text is still available as a fallback.");
      return;
    }

    try {
      const extractedText = await extractDocxText(file);
      setResume(extractedText);
      setUploadMessage("Resume text extracted. Please review it before starting the Fit Check.");
    } catch (uploadError) {
      setError(uploadError.message);
    }
  }

  async function handleFitCheck() {
    setError("");
    setFitAnalysis(null);
    setBulletAnalysis(null);
    setLoadingStepIndex(0);
    setIsAnalysing(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resume,
          jobDescription,
          analysisType: "roleMatch"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The Fit Check request failed.");
      }

      setFitAnalysis(data);
    } catch (requestError) {
      setFitAnalysis(null);
      setError(requestError.message);
    } finally {
      setIsAnalysing(false);
    }
  }

  async function handleBulletOptimiser() {
    setError("");
    setBulletAnalysis(null);
    setLoadingStepIndex(0);
    setIsOptimising(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          resume,
          jobDescription,
          analysisType: "bulletOptimiser"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The bullet optimiser request failed.");
      }

      setBulletAnalysis(data);
    } catch (requestError) {
      setBulletAnalysis(null);
      setError(requestError.message);
    } finally {
      setIsOptimising(false);
    }
  }

  return (
    <main className="app-shell">
      <section
        className="intro hero"
        style={{ backgroundImage: `url(${headerImage})` }}
      >
        <div className="hero-content">
          <p className="eyebrow">Apply Today</p>
          <h1>Sally's AI Career Coach</h1>
          <p>
            Check whether this resume is ready for this role, see what is missing,
            and decide what to improve before applying.
          </p>
        </div>
      </section>

      <ProgressSteps steps={workflowSteps} currentStep={currentStep} />

      <section className="workspace" aria-label="Resume and job description form">
        <label className="field">
          <span className="field-heading">
            Resume
            <span className="field-actions">
              <UploadButton onUpload={handleDocxUpload} />
              <button
                className="sample-button"
                onClick={() => setResume(sampleResume)}
                type="button"
              >
                Load sample
              </button>
            </span>
          </span>
          <textarea
            value={resume}
            onChange={(event) => setResume(event.target.value)}
            placeholder="Paste your resume here, or upload a .docx file..."
          />
          {uploadMessage ? <p className="helper-message">{uploadMessage}</p> : null}
        </label>

        <label className="field">
          <span className="field-heading">
            Job Description
            <button
              className="sample-button"
              onClick={() => setJobDescription(sampleJobDescription)}
              type="button"
            >
              Load sample
            </button>
          </span>
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the job description here..."
          />
        </label>
      </section>

      <section className="action-panel" aria-label="Recommended next action">
        <div>
          <p className="panel-label">Recommended next action</p>
          <h2>Start with a Fit Check</h2>
          <p>
            First we will check application readiness, ATS match, recruiter
            appeal, gaps, and the most useful fixes.
          </p>
        </div>
        <button className="analyse-button" onClick={handleFitCheck} disabled={isAnalysing}>
          <Sparkles size={18} aria-hidden="true" />
          {isAnalysing ? "Checking..." : "Start Fit Check"}
        </button>
      </section>

      {error ? <p className="error-message">{error}</p> : null}

      <section className="results" aria-label="Apply Today results">
        {isOptimising ? (
          <LoadingResults
            currentStepIndex={loadingStepIndex}
            loadingSteps={optimiserLoadingSteps}
            title="Optimising resume bullets"
          />
        ) : fitAnalysis ? (
          <FitCheckResults
            analysis={fitAnalysis}
            bulletAnalysis={bulletAnalysis}
            isOptimising={isOptimising}
            onOptimiseBullets={handleBulletOptimiser}
          />
        ) : (
          <EmptyResults isAnalysing={isAnalysing} loadingStepIndex={loadingStepIndex} />
        )}
      </section>
    </main>
  );
}

function ProgressSteps({ steps, currentStep }) {
  return (
    <nav className="progress-steps" aria-label="Apply Today progress">
      {steps.map((step) => (
        <span className={step === currentStep ? "active" : ""} key={step}>
          {step}
        </span>
      ))}
    </nav>
  );
}

function UploadButton({ onUpload }) {
  return (
    <label className="upload-button">
      <Upload size={16} aria-hidden="true" />
      <span>Upload .docx</span>
      <input accept=".docx" onChange={onUpload} type="file" />
    </label>
  );
}

function EmptyResults({ isAnalysing, loadingStepIndex }) {
  if (isAnalysing) {
    return (
      <LoadingResults
        currentStepIndex={loadingStepIndex}
        loadingSteps={loadingSteps}
      />
    );
  }

  return (
    <div className="empty-state">
      <FileSearch size={34} aria-hidden="true" />
      <h2>Your Fit Check report will appear here</h2>
      <p>
        Add your resume and the job description, then start the Fit Check to see
        what to do next.
      </p>
    </div>
  );
}

function LoadingResults({ currentStepIndex, loadingSteps, title = "Running Fit Check" }) {
  return (
    <div className="loading-state" aria-live="polite">
      <div className="loading-header">
        <div className="spinner" aria-hidden="true" />
        <div>
          <h2>{title}</h2>
          <p>{loadingSteps[currentStepIndex]}</p>
        </div>
      </div>

      <ol className="loading-steps">
        {loadingSteps.map((step, index) => (
          <li
            className={index <= currentStepIndex ? "active" : ""}
            key={step}
          >
            {index < currentStepIndex ? (
              <CheckCircle2 size={18} aria-hidden="true" />
            ) : index === currentStepIndex ? (
              <Search size={18} aria-hidden="true" />
            ) : (
              <ListChecks size={18} aria-hidden="true" />
            )}
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function FitCheckResults({ analysis, bulletAnalysis, isOptimising, onOptimiseBullets }) {
  const readiness = getReadiness(analysis);

  return (
    <div className="report">
      <section className="next-action">
        <div>
          <p className="panel-label">Next best action</p>
          <h2>{analysis.nextBestAction || readiness.nextAction}</h2>
          <p>{readiness.reason}</p>
        </div>
        <span className={`status-chip ${readiness.statusClass}`}>{readiness.label}</span>
      </section>

      <div className="results-grid">
        <ScoreCard
          title="Application Readiness"
          score={analysis.overallMatchScore}
          status={readiness.label}
        />
        <ScoreCard title="ATS Match" score={analysis.atsKeywordMatch} status={getScoreLabel(analysis.atsKeywordMatch)} />

        <ResultCard title="Recruiter 8-Second Scan" wide>
          <RecruiterScan scan={analysis.recruiterScan} />
        </ResultCard>

        <ResultCard title="Top Matching Areas">
          <IconList
            icon={<CheckCircle2 size={18} />}
            items={analysis.topMatchingAreas}
          />
        </ResultCard>

        <ResultCard title="Top Missing Areas">
          <KeywordList items={analysis.missingOrWeakKeywords} />
        </ResultCard>

        <ResultCard title="Recommended Fixes" wide>
          <IconList
            icon={<AlertTriangle size={18} />}
            items={analysis.resumeSuggestions}
          />
        </ResultCard>
      </div>

      <ImproveResumePanel
        bulletAnalysis={bulletAnalysis}
        isOptimising={isOptimising}
        onOptimiseBullets={onOptimiseBullets}
      />
    </div>
  );
}

function RecruiterScan({ scan }) {
  return (
    <div className="recruiter-scan">
      <div className="recruiter-target">
        <span className="bullet-label">Recruiter target</span>
        <p>{scan.recruiterTargetSummary}</p>
      </div>
      <div>
        <h3>What the recruiter is looking for</h3>
        <IconList icon={<Search size={18} />} items={scan.whatRecruiterIsLookingFor} />
      </div>
      <div>
        <h3>What the recruiter sees in your resume</h3>
        <IconList icon={<FileSearch size={18} />} items={scan.whatRecruiterSees} />
      </div>
      <div className="first-page-scan">
        <div>
          <h3>First 5 seconds: attention gate</h3>
          <span className={`status-chip ${getAttentionGateClass(scan.attentionGate)}`}>
            {scan.attentionGate}
          </span>
        </div>
        <div>
          <h3>Visible on the first page</h3>
          <IconList icon={<CheckCircle2 size={18} />} items={scan.firstPageAlignment} />
        </div>
        <div>
          <h3>Needs to show faster</h3>
          <IconList icon={<AlertTriangle size={18} />} items={scan.firstPageGaps} />
        </div>
      </div>
      <div>
        <h3>Next 5 seconds: proof that jumps out</h3>
        <IconList icon={<ListChecks size={18} />} items={scan.supportingEvidence} />
      </div>
      <div className="recruiter-decision">
        <span className={`status-chip ${getDecisionStatusClass(scan.decision)}`}>
          {scan.decision}
        </span>
        <p>{scan.reason}</p>
      </div>
    </div>
  );
}

function ImproveResumePanel({ bulletAnalysis, isOptimising, onOptimiseBullets }) {
  return (
    <section className="improve-panel" aria-label="Improve Resume">
      <div className="improve-panel-header">
        <div>
          <p className="panel-label">Next step</p>
          <h2>Improve Resume</h2>
          <p>
            Use the job ad keywords to strengthen weaker resume bullets before
            submitting.
          </p>
        </div>
        <button
          className="analyse-button"
          disabled={isOptimising}
          onClick={onOptimiseBullets}
          type="button"
        >
          <ArrowRight size={18} aria-hidden="true" />
          {bulletAnalysis ? "Re-run Bullet Optimiser" : "Optimise Resume Bullets"}
        </button>
      </div>

      {bulletAnalysis ? <BulletOptimiserResults analysis={bulletAnalysis} /> : null}
    </section>
  );
}

function BulletOptimiserResults({ analysis }) {
  return (
    <div className="optimiser-results">
      <ResultCard title="Job Ad Keywords" wide>
        <div className="keyword-table">
          {analysis.jobKeywords.map((keyword) => (
            <div className="keyword-row" key={keyword.keyword}>
              <div>
                <strong>{keyword.keyword}</strong>
                <p>{keyword.whyItMatters}</p>
              </div>
              <span>{keyword.importance}</span>
              <span className={`status ${getKeywordStatusClass(keyword.resumeStatus)}`}>
                {keyword.resumeStatus}
              </span>
            </div>
          ))}
        </div>
      </ResultCard>

      <ResultCard title="Recommended As-Is To-Be Changes" wide>
        <div className="bullet-list">
          {analysis.weakestBullets.map((bullet) => (
            <article className="bullet-card" key={bullet.originalBullet}>
              <div>
                <span className="bullet-label">Original bullet</span>
                <p className="original-bullet">{bullet.originalBullet}</p>
              </div>
              <div>
                <span className="bullet-label">Change to</span>
                <p className="rewritten-bullet">{bullet.rewrittenBullet}</p>
              </div>
              <KeywordList items={bullet.targetKeywords} />
              <p>{bullet.whyThisHelps}</p>
              <p className="truth-note">{bullet.truthfulnessNote}</p>
            </article>
          ))}
        </div>
      </ResultCard>

      <ResultCard title="Top Fixes" wide>
        <IconList icon={<CheckCircle2 size={18} />} items={analysis.topFixes} />
      </ResultCard>
    </div>
  );
}

function getReadiness(analysis) {
  const lowestScore = Math.min(analysis.overallMatchScore, analysis.atsKeywordMatch);

  if (lowestScore >= 78) {
    return {
      label: analysis.applicationReadiness || "Strong",
      statusClass: "strong",
      nextAction: "Improve the executive profile, then prepare to submit.",
      reason: "The resume looks close enough to start polishing the top section and final wording."
    };
  }

  if (lowestScore >= 58) {
    return {
      label: "Needs work",
      statusClass: "needs-work",
      nextAction: "Fix the missing keywords and sharpen the most relevant bullets first.",
      reason: "The application has usable foundations, but the resume should be tightened before submission."
    };
  }

  return {
    label: "Risk",
    statusClass: "risk",
    nextAction: "Close the biggest fit gaps before applying.",
    reason: "The current resume may struggle to pass screening or hold recruiter attention for this role."
  };
}

function getScoreLabel(score) {
  if (score >= 78) return "Strong";
  if (score >= 58) return "Needs work";
  return "Risk";
}

function ScoreCard({ title, score, status }) {
  return (
    <article className="score-card">
      <div className="card-title-row">
        <h2>{title}</h2>
        <span className={`status-chip ${getStatusClass(status)}`}>{status}</span>
      </div>
      <div className="score-row">
        <strong>{score}%</strong>
        <div className="score-track" aria-hidden="true">
          <span style={{ width: `${score}%` }} />
        </div>
      </div>
    </article>
  );
}

function ResultCard({ title, children, wide = false }) {
  return (
    <article className={wide ? "result-card wide" : "result-card"}>
      <h2>{title}</h2>
      {children}
    </article>
  );
}

function KeywordList({ items }) {
  return (
    <div className="keyword-list">
      {items.map((keyword) => (
        <span key={keyword}>{keyword}</span>
      ))}
    </div>
  );
}

function IconList({ icon, items }) {
  return (
    <ul className="icon-list">
      {items.map((item) => (
        <li key={item}>
          {icon}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function getStatusClass(status) {
  if (status === "Strong" || status === "Ready to submit") return "strong";
  if (status === "Needs work") return "needs-work";
  return "risk";
}

function getDecisionStatusClass(decision) {
  if (decision === "Must Screen" || decision === "Strong Shortlist" || decision === "Shortlist") {
    return "strong";
  }

  if (decision === "Maybe") {
    return "needs-work";
  }

  return "risk";
}

function getAttentionGateClass(gate) {
  if (gate === "Passes") return "strong";
  if (gate === "Partial") return "needs-work";
  return "risk";
}

function getKeywordStatusClass(status) {
  if (status === "Found") return "found";
  if (status === "Weak") return "weak";
  return "missing";
}

async function extractDocxText(file) {
  if (!("DecompressionStream" in window)) {
    throw new Error("This browser cannot extract .docx files yet. Please paste your resume text instead.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const entries = parseZipEntries(arrayBuffer);
  const documentEntry = entries.find((entry) => entry.name === "word/document.xml");

  if (!documentEntry) {
    throw new Error("Could not find readable resume text in this .docx file.");
  }

  const xml = await inflateZipEntry(arrayBuffer, documentEntry);
  const text = documentXmlToText(xml);

  if (!text.trim()) {
    throw new Error("The .docx file opened, but no resume text could be extracted.");
  }

  return text;
}

function parseZipEntries(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  const decoder = new TextDecoder();
  const entries = [];
  let offset = 0;

  while (offset + 30 < view.byteLength && view.getUint32(offset, true) === 0x04034b50) {
    const compression = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const fileNameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    const nameStart = offset + 30;
    const dataStart = nameStart + fileNameLength + extraLength;
    const name = decoder.decode(new Uint8Array(arrayBuffer, nameStart, fileNameLength));

    entries.push({
      name,
      compression,
      dataStart,
      compressedSize
    });

    offset = dataStart + compressedSize;
  }

  return entries;
}

async function inflateZipEntry(arrayBuffer, entry) {
  const bytes = new Uint8Array(arrayBuffer, entry.dataStart, entry.compressedSize);

  if (entry.compression === 0) {
    return new TextDecoder().decode(bytes);
  }

  if (entry.compression !== 8) {
    throw new Error("This .docx compression format is not supported. Please paste your resume text instead.");
  }

  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  const inflatedBuffer = await new Response(stream).arrayBuffer();

  return new TextDecoder().decode(inflatedBuffer);
}

function documentXmlToText(xml) {
  return xml
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<\/w:tr>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default App;
