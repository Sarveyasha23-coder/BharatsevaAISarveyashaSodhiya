"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { sampleProfile, schemes } from "@/lib/schemes";
import type {
  ApplicationReceipt,
  CitizenProfile,
  Scheme,
  SchemeRecommendation,
} from "@/lib/types";

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    start: (audioTrack?: MediaStreamTrack) => void;
    stop: () => void;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  }

  interface SpeechRecognitionEvent {
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    readonly length: number;
  }

  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    readonly isFinal: boolean;
    readonly length: number;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
  }

  interface SpeechRecognitionErrorEvent {
    readonly error: "no-speech" | "aborted" | "audio-capture" | "network" | "not-allowed" | "service-not-allowed" | "bad-grammar" | "language-not-supported";
    readonly message: string;
  }
}

const voicePrompts = [
  "मुझे किसान योजना चाहिए",
  "I need health insurance for my family",
  "मुझे गांव में घर बनाने के लिए मदद चाहिए",
];

const statCards = [
  {
    label: "Schemes indexed",
    value: "120+",
    hint: "Central and state-ready architecture",
  },
  {
    label: "Languages",
    value: "22",
    hint: "Voice-first multilingual expansion path",
  },
  {
    label: "Rural ready",
    value: "Offline",
    hint: "Low-bandwidth assisted workflows",
  },
  {
    label: "Fraud checks",
    value: "AI",
    hint: "Duplicate, risk and missing-doc detection",
  },
];

export function BharatSevaApp() {
  const [query, setQuery] = useState("मुझे किसान योजना चाहिए");
  const [profile, setProfile] = useState<CitizenProfile>(sampleProfile);
  const [recommendations, setRecommendations] = useState<
    SchemeRecommendation[]
  >([]);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(
    schemes[0],
  );
  const [documents, setDocuments] = useState<string[]>([
    "aadhaar.pdf",
    "land-record.pdf",
  ]);
  const [notes, setNotes] = useState(
    "Voice intent captured in Hindi. Aadhaar verified. Farmer seeks income support.",
  );
  const [receipt, setReceipt] = useState<ApplicationReceipt | null>(null);
  const [voiceState, setVoiceState] = useState<
    "idle" | "listening" | "unsupported"
  >("idle");
  const [isSearching, startSearch] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();

  useEffect(() => {
    runRecommendation(query, profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headlineRecommendation = useMemo(
    () => recommendations[0] ?? null,
    [recommendations],
  );

  function updateProfile<K extends keyof CitizenProfile>(
    key: K,
    value: CitizenProfile[K],
  ) {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function runRecommendation(nextQuery: string, nextProfile: CitizenProfile) {
    startSearch(async () => {
      const response = await fetch("/api/schemes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: nextQuery,
          profile: nextProfile,
        }),
      });

      const data = (await response.json()) as {
        recommendations: SchemeRecommendation[];
      };

      setRecommendations(data.recommendations);
      setSelectedScheme(data.recommendations[0]?.scheme ?? null);
      setReceipt(null);
    });
  }

  function triggerVoiceCapture() {
    const Recognition =
      typeof window !== "undefined"
        ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
        : undefined;

    if (!Recognition) {
      setVoiceState("unsupported");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setVoiceState("listening");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setVoiceState("idle");
      runRecommendation(transcript, profile);
    };

    recognition.onerror = () => {
      setVoiceState("idle");
    };

    recognition.start();
  }

  function handleDocumentUpload(fileList: FileList | null) {
    if (!fileList) {
      return;
    }

    setDocuments(Array.from(fileList).map((file) => file.name));
  }

  function submitApplicationFlow() {
    if (!selectedScheme) {
      return;
    }

    startSubmitting(async () => {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schemeId: selectedScheme.id,
          citizen: profile,
          notes,
          documents,
        }),
      });

      const data = (await response.json()) as ApplicationReceipt;
      setReceipt(data);
    });
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">India 2026-ready civic AI</span>
          <h1>
            BharatSeva AI turns government schemes into a 10-second
            voice-to-application journey.
          </h1>
          <p className="hero-text">
            A multilingual, offline-capable citizen copilot that finds the right
            scheme, checks likely eligibility, and auto-prepares a verified
            application for assisted submission.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => runRecommendation(query, profile)}
            >
              Launch live demo
            </button>
            <button
              className="ghost-button"
              onClick={() => setQuery(voicePrompts[0])}
            >
              Load Hindi farmer scenario
            </button>
          </div>

          <div className="stats-grid">
            {statCards.map((item) => (
              <article className="stat-card" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <p>{item.hint}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="hero-demo">
          <div className="demo-phone">
            <div className="demo-topline">
              <span className="dot" />
              <span>Live demo flow</span>
            </div>
            <ol className="demo-steps">
              <li>User speaks in Hindi</li>
              <li>AI detects best-fit scheme</li>
              <li>Eligibility scored instantly</li>
              <li>Application prepared and submitted</li>
            </ol>
            <div className="demo-highlight">
              <span>Detected intent</span>
              <strong>
                {headlineRecommendation?.scheme.name ?? "PM-KISAN"}
              </strong>
              <p>
                {headlineRecommendation?.status ?? "Eligible"} with{" "}
                {headlineRecommendation?.score ?? 89}% confidence
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="workspace-grid">
        <div className="workspace-column">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Voice + intent</span>
                <h2>Scheme discovery</h2>
              </div>
              <button className="chip-button" onClick={triggerVoiceCapture}>
                {voiceState === "listening" ? "Listening..." : "Use microphone"}
              </button>
            </div>

            <label className="field-label" htmlFor="scheme-query">
              Citizen query
            </label>
            <textarea
              id="scheme-query"
              className="text-input query-box"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Describe what the citizen needs in Hindi or English"
            />

            <div className="prompt-row">
              {voicePrompts.map((prompt) => (
                <button
                  className="prompt-pill"
                  key={prompt}
                  onClick={() => {
                    setQuery(prompt);
                    runRecommendation(prompt, profile);
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <button
              className="primary-button full-width"
              onClick={() => runRecommendation(query, profile)}
              disabled={isSearching}
            >
              {isSearching ? "Analyzing request..." : "Find best schemes"}
            </button>

            {voiceState === "unsupported" ? (
              <p className="inline-note">
                Browser microphone API is unavailable here, so use the sample
                prompts for the demo.
              </p>
            ) : null}
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Citizen context</span>
                <h2>Eligibility profile</h2>
              </div>
            </div>

            <div className="form-grid">
              <div>
                <label className="field-label" htmlFor="fullName">
                  Full name
                </label>
                <input
                  id="fullName"
                  className="text-input"
                  value={profile.fullName}
                  onChange={(event) =>
                    updateProfile("fullName", event.target.value)
                  }
                />
              </div>
              <div>
                <label className="field-label" htmlFor="age">
                  Age
                </label>
                <input
                  id="age"
                  className="text-input"
                  type="number"
                  value={profile.age}
                  onChange={(event) =>
                    updateProfile("age", Number(event.target.value))
                  }
                />
              </div>
              <div>
                <label className="field-label" htmlFor="state">
                  State
                </label>
                <input
                  id="state"
                  className="text-input"
                  value={profile.state}
                  onChange={(event) =>
                    updateProfile("state", event.target.value)
                  }
                />
              </div>
              <div>
                <label className="field-label" htmlFor="district">
                  District
                </label>
                <input
                  id="district"
                  className="text-input"
                  value={profile.district}
                  onChange={(event) =>
                    updateProfile("district", event.target.value)
                  }
                />
              </div>
              <div>
                <label className="field-label" htmlFor="income">
                  Annual income (INR)
                </label>
                <input
                  id="income"
                  className="text-input"
                  type="number"
                  value={profile.annualIncome}
                  onChange={(event) =>
                    updateProfile("annualIncome", Number(event.target.value))
                  }
                />
              </div>
              <div>
                <label className="field-label" htmlFor="landHolding">
                  Land (acres)
                </label>
                <input
                  id="landHolding"
                  className="text-input"
                  type="number"
                  step="0.1"
                  value={profile.landHoldingAcres}
                  onChange={(event) =>
                    updateProfile(
                      "landHoldingAcres",
                      Number(event.target.value),
                    )
                  }
                />
              </div>
              <div>
                <label className="field-label" htmlFor="occupation">
                  Occupation
                </label>
                <select
                  id="occupation"
                  className="text-input"
                  value={profile.occupation}
                  onChange={(event) =>
                    updateProfile(
                      "occupation",
                      event.target.value as CitizenProfile["occupation"],
                    )
                  }
                >
                  <option value="farmer">Farmer</option>
                  <option value="worker">Worker</option>
                  <option value="student">Student</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="homemaker">Homemaker</option>
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="language">
                  Language
                </label>
                <select
                  id="language"
                  className="text-input"
                  value={profile.language}
                  onChange={(event) =>
                    updateProfile(
                      "language",
                      event.target.value as CitizenProfile["language"],
                    )
                  }
                >
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>
            </div>

            <div className="switch-row">
              <Toggle
                label="Rural household"
                checked={profile.isRural}
                onChange={(checked) => updateProfile("isRural", checked)}
              />
              <Toggle
                label="Has ration card"
                checked={profile.hasRationCard}
                onChange={(checked) => updateProfile("hasRationCard", checked)}
              />
              <Toggle
                label="Already insured"
                checked={profile.hasHealthCoverage}
                onChange={(checked) =>
                  updateProfile("hasHealthCoverage", checked)
                }
              />
              <Toggle
                label="Aadhaar linked"
                checked={profile.aadhaarLinked}
                onChange={(checked) => updateProfile("aadhaarLinked", checked)}
              />
            </div>

            <button
              className="ghost-button full-width"
              onClick={() => runRecommendation(query, profile)}
            >
              Recalculate eligibility
            </button>
          </div>
        </div>

        <div className="workspace-column">
          <div className="panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">AI recommendations</span>
                <h2>Best-fit schemes</h2>
              </div>
            </div>

            <div className="recommendation-list">
              {recommendations.map((item) => (
                <button
                  key={item.scheme.id}
                  className={`recommendation-card ${selectedScheme?.id === item.scheme.id ? "active" : ""}`}
                  onClick={() => setSelectedScheme(item.scheme)}
                >
                  <div className="recommendation-top">
                    <div>
                      <strong>{item.scheme.name}</strong>
                      <p>{item.scheme.tagline}</p>
                    </div>
                    <span
                      className={`score-badge ${item.status.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      {item.score}%
                    </span>
                  </div>
                  <div className="mini-tags">
                    {item.scheme.focus.map((focus) => (
                      <span key={focus}>{focus}</span>
                    ))}
                  </div>
                  <ul className="reasons-list">
                    {item.reasons.slice(0, 3).map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Application copilot</span>
                <h2>Auto-filled submission</h2>
              </div>
            </div>

            {selectedScheme ? (
              <>
                <div className="detail-card">
                  <div className="detail-top">
                    <div>
                      <h3>{selectedScheme.name}</h3>
                      <p>{selectedScheme.ministry}</p>
                    </div>
                    <span className="mini-status">
                      {headlineRecommendation?.status ?? "Ready"}
                    </span>
                  </div>
                  <p className="detail-benefit">{selectedScheme.benefit}</p>
                  <div className="detail-columns">
                    <div>
                      <span className="detail-label">Required documents</span>
                      <ul className="simple-list">
                        {selectedScheme.documents.map((doc) => (
                          <li key={doc}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="detail-label">Core eligibility</span>
                      <ul className="simple-list">
                        {selectedScheme.eligibility.map((rule) => (
                          <li key={rule}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="form-grid">
                  <div>
                    <label className="field-label" htmlFor="notes">
                      Case notes
                    </label>
                    <textarea
                      id="notes"
                      className="text-input notes-box"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="documents">
                      Upload citizen documents
                    </label>
                    <input
                      id="documents"
                      className="file-input"
                      type="file"
                      multiple
                      onChange={(event) =>
                        handleDocumentUpload(event.target.files)
                      }
                    />
                    <div className="document-list">
                      {documents.map((document) => (
                        <span className="document-chip" key={document}>
                          {document}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  className="primary-button full-width"
                  onClick={submitApplicationFlow}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting application..."
                    : "Submit application"}
                </button>
              </>
            ) : null}

            {receipt ? (
              <div className="receipt-card">
                <span className="panel-kicker">Submission result</span>
                <h3>{receipt.schemeName}</h3>
                <p>Application ID: {receipt.applicationId}</p>
                <p>Status: {receipt.status}</p>
                <p>{receipt.nextStep}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="toggle-card">
      <span>{label}</span>
      <button
        type="button"
        className={`toggle-switch ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      >
        <span />
      </button>
    </label>
  );
}
