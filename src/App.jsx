import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileSearch,
  ListChecks,
  Search,
  Sparkles
} from "lucide-react";
import { sampleJobDescription, sampleResume } from "./sampleData.js";

const API_URL = import.meta.env.PROD
  ? "/api/analyse"
  : "http://127.0.0.1:8787/api/analyse";
const analysisTabs = [
  {
    id: "roleMatch",
    label: "Role Match",
    emptyTitle: "Role match results will appear here",
    emptyText: "Run a role fit analysis to see scores, gaps, risks, and questions.",
    loadingSteps: [
      "Reading the resume",
      "Scanning the job description",
      "Comparing role keywords",
      "Checking ATS match",
      "Preparing suggestions",
      "Drafting interview questions"
    ]
  },
  {
    id: "bulletOptimiser",
    label: "ATS Bullet Optimiser",
    emptyTitle: "Bullet optimisation results will appear here",
    emptyText: "Run the optimiser to find ATS keywords and improve weak bullets.",
    loadingSteps: [
      "Extracting job ad keywords",
      "Checking resume keyword coverage",
      "Finding weaker bullet points",
      "Matching bullets to target keywords",
      "Rewriting bullets truthfully",
      "Preparing top fixes"
    ]
  }
];

function App() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("roleMatch");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState("");
  const activeAnalysis = analysisTabs.find((tab) => tab.id === activeTab);

  useEffect(() => {
    if (!isAnalysing) {
      setLoadingStepIndex(0);
      return undefined;
    }

    const stepTimer = window.setInterval(() => {
      setLoadingStepIndex((currentIndex) =>
        Math.min(currentIndex + 1, activeAnalysis.loadingSteps.length - 1)
      );
    }, 1400);

    return () => window.clearInterval(stepTimer);
  }, [activeAnalysis.loadingSteps.length, isAnalysing]);

  function handleTabChange(tabId) {
    setActiveTab(tabId);
    setAnalysis(null);
    setError("");
    setLoadingStepIndex(0);
  }

  async function handleAnalyse() {
    setError("");
    setAnalysis(null);
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
          analysisType: activeTab
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The analysis request failed.");
      }

      setAnalysis(data);
    } catch (requestError) {
      setAnalysis(null);
      setError(requestError.message);
    } finally {
      setIsAnalysing(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">Resume to role comparison</p>
        <h1>RoleFit AI</h1>
        <p>
          Paste a resume and a job description to see an AI-powered analysis of
          how well the resume fits the role.
        </p>
      </section>

      <section className="workspace" aria-label="Resume and job description form">
        <label className="field">
          <span className="field-heading">
            Resume
            <button
              className="sample-button"
              onClick={() => setResume(sampleResume)}
              type="button"
            >
              Load sample resume
            </button>
          </span>
          <textarea
            value={resume}
            onChange={(event) => setResume(event.target.value)}
            placeholder="Paste the resume here..."
          />
        </label>

        <label className="field">
          <span className="field-heading">
            Job Description
            <button
              className="sample-button"
              onClick={() => setJobDescription(sampleJobDescription)}
              type="button"
            >
              Load sample job
            </button>
          </span>
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the job description here..."
          />
        </label>
      </section>

      <div className="tabs" aria-label="Analysis modules">
        {analysisTabs.map((tab) => (
          <button
            className={activeTab === tab.id ? "tab-button active" : "tab-button"}
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <button className="analyse-button" onClick={handleAnalyse} disabled={isAnalysing}>
        <Sparkles size={18} aria-hidden="true" />
        {isAnalysing ? "Analysing..." : "Analyse"}
      </button>

      {error ? <p className="error-message">{error}</p> : null}

      <section className="results" aria-label="Analysis results">
        {analysis ? (
          activeTab === "bulletOptimiser" ? (
            <BulletOptimiserResults analysis={analysis} />
          ) : (
            <RoleMatchResults analysis={analysis} />
          )
        ) : (
          <EmptyResults
            activeAnalysis={activeAnalysis}
            isAnalysing={isAnalysing}
            loadingStepIndex={loadingStepIndex}
          />
        )}
      </section>
    </main>
  );
}

function EmptyResults({ activeAnalysis, isAnalysing, loadingStepIndex }) {
  if (isAnalysing) {
    return (
      <LoadingResults
        currentStepIndex={loadingStepIndex}
        loadingSteps={activeAnalysis.loadingSteps}
      />
    );
  }

  return (
    <div className="empty-state">
      <FileSearch size={34} aria-hidden="true" />
      <h2>{activeAnalysis.emptyTitle}</h2>
      <p>{activeAnalysis.emptyText}</p>
    </div>
  );
}

function LoadingResults({ currentStepIndex, loadingSteps }) {
  return (
    <div className="loading-state" aria-live="polite">
      <div className="loading-header">
        <div className="spinner" aria-hidden="true" />
        <div>
          <h2>Analysing resume fit</h2>
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

function RoleMatchResults({ analysis }) {
  return (
    <div className="results-grid">
      <ScoreCard title="Overall role match" score={analysis.overallMatchScore} />
      <ScoreCard title="ATS keyword match" score={analysis.atsKeywordMatch} />

      <ResultCard title="Recruiter search simulation">
        <p>{analysis.recruiterSearchSimulation}</p>
      </ResultCard>

      <ResultCard title="Missing or weak keywords">
        <KeywordList items={analysis.missingOrWeakKeywords} />
      </ResultCard>

      <ResultCard title="Resume improvement suggestions">
        <IconList icon={<CheckCircle2 size={18} />} items={analysis.resumeSuggestions} />
      </ResultCard>

      <ResultCard title="Interview risk areas">
        <IconList icon={<AlertTriangle size={18} />} items={analysis.interviewRiskAreas} />
      </ResultCard>

      <ResultCard title="Likely interview questions" wide>
        <ol className="question-list">
          {analysis.likelyInterviewQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </ResultCard>
    </div>
  );
}

function BulletOptimiserResults({ analysis }) {
  return (
    <div className="results-grid">
      <ResultCard title="Job ad keywords" wide>
        <div className="keyword-table">
          {analysis.jobKeywords.map((keyword) => (
            <div className="keyword-row" key={keyword.keyword}>
              <div>
                <strong>{keyword.keyword}</strong>
                <p>{keyword.whyItMatters}</p>
              </div>
              <span>{keyword.importance}</span>
              <span className={getStatusClass(keyword.resumeStatus)}>
                {keyword.resumeStatus}
              </span>
            </div>
          ))}
        </div>
      </ResultCard>

      <ResultCard title="Weakest bullets to improve" wide>
        <div className="bullet-list">
          {analysis.weakestBullets.map((bullet) => (
            <article className="bullet-card" key={bullet.originalBullet}>
              <p className="original-bullet">{bullet.originalBullet}</p>
              <p>{bullet.issue}</p>
              <KeywordList items={bullet.targetKeywords} />
              <strong>{bullet.rewrittenBullet}</strong>
            </article>
          ))}
        </div>
      </ResultCard>

      <ResultCard title="Top fixes" wide>
        <IconList icon={<CheckCircle2 size={18} />} items={analysis.topFixes} />
      </ResultCard>
    </div>
  );
}

function getStatusClass(status) {
  return status === "Found" ? "status found" : status === "Weak" ? "status weak" : "status missing";
}

function ScoreCard({ title, score }) {
  return (
    <article className="score-card">
      <h2>{title}</h2>
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

export default App;
