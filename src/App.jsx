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
const loadingSteps = [
  "Reading the resume",
  "Scanning the job description",
  "Comparing role keywords",
  "Checking ATS match",
  "Preparing suggestions",
  "Drafting interview questions"
];

function App() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAnalysing) {
      setLoadingStepIndex(0);
      return undefined;
    }

    const stepTimer = window.setInterval(() => {
      setLoadingStepIndex((currentIndex) =>
        Math.min(currentIndex + 1, loadingSteps.length - 1)
      );
    }, 1400);

    return () => window.clearInterval(stepTimer);
  }, [isAnalysing]);

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
          jobDescription
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

      <button className="analyse-button" onClick={handleAnalyse} disabled={isAnalysing}>
        <Sparkles size={18} aria-hidden="true" />
        {isAnalysing ? "Analysing..." : "Analyse"}
      </button>

      {error ? <p className="error-message">{error}</p> : null}

      <section className="results" aria-label="Analysis results">
        {analysis ? (
          <Results analysis={analysis} />
        ) : (
          <EmptyResults
            isAnalysing={isAnalysing}
            loadingStepIndex={loadingStepIndex}
          />
        )}
      </section>
    </main>
  );
}

function EmptyResults({ isAnalysing, loadingStepIndex }) {
  if (isAnalysing) {
    return <LoadingResults currentStepIndex={loadingStepIndex} />;
  }

  return (
    <div className="empty-state">
      <FileSearch size={34} aria-hidden="true" />
      <h2>Results will appear here</h2>
      <p>Paste both texts, then run a real AI-powered analysis.</p>
    </div>
  );
}

function LoadingResults({ currentStepIndex }) {
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

function Results({ analysis }) {
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
