import React, { useState } from 'react';

const BharatSevaApp = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    isFarmer: false,
    category: 'General'
  });
  const [docResult, setDocResult] = useState(null);

  // Use the environment variable for your live Render URL, or localhost for development
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAnalyzeSchemes = async () => {
    setLoading(true);
    try {
      // Example: Calling your live Recommendation Engine
      const response = await fetch(`${API_BASE}/api/schemes/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          age: parseInt(formData.age), 
          income: parseInt(formData.income), 
          category: formData.category,
          isFarmer: formData.isFarmer,
          interests: ['health', 'pension'] // Scalable for future selection
        })
      });
      const result = await response.json();
      setRecommendations(result.data || []);
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSurvey = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/survey/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: `USER-${Math.floor(Math.random() * 10000)}`, // Startup level: persistent ID
          responses: { ...formData, recommendationsCount: recommendations.length }
        })
      });
      const result = await response.json();
      if (result.status === 'success') alert("Survey and matches secured in database!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Critical: Could not persist live data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/ai/analyze-doc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'AadharCard', file: 'base64_simulated_data' })
      });
      const result = await response.json();
      setDocResult(result);
    } catch (error) {
      console.error("AI Analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="top-branding">
        Built by <span>Sarveyasha Sodhiya</span>
      </div>

      <header>
        <h1>BharatSeva AI Surveyasha</h1>
        <p>Empowering citizens with real-time AI eligibility insights.</p>
      </header>

      <main className="dashboard">
        <section className="card">
          <h3>Live Scheme Matcher</h3>
          <div className="form-group">
            <input 
              type="number" 
              name="age" 
              placeholder="Enter Age" 
              value={formData.age} 
              onChange={handleInputChange} 
            />
            <input 
              type="number" 
              name="income" 
              placeholder="Annual Income (₹)" 
              value={formData.income} 
              onChange={handleInputChange} 
            />
            <select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC/ST">SC/ST</option>
            </select>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="isFarmer" 
                checked={formData.isFarmer} 
                onChange={handleInputChange} 
              />
              Registered Farmer?
            </label>
          </div>

          <button 
            className="primary-btn" 
            onClick={handleAnalyzeSchemes} 
            disabled={loading || !formData.age || !formData.income}
          >
            {loading ? 'Analyzing Live Data...' : 'Find Eligible Schemes'}
          </button>
          
          <div className="recommendations-list">
            {recommendations.map((scheme) => (
              <div key={scheme.id} className="scheme-item">
                <div className="scheme-header">
                  <span className="scheme-name">{scheme.id}</span>
                  <span className="match-badge">{scheme.matchScore}% Match</span>
                </div>
                <div className="tags">
                  {scheme.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                </div>
              </div>
            ))}
          </div>

          {recommendations.length > 0 && (
            <div className="submission-zone">
              <div className="results">
                Found {recommendations.length} matching schemes!
              </div>
              <button className="submit-btn" onClick={handleSubmitSurvey}>
                Secure Results to Database
              </button>
            </div>
          )}
        </section>

        <section className="card">
          <h3>AI Document Verification</h3>
          <p>Upload your document for instant AI verification against government standards.</p>
          <button className="secondary-btn" onClick={handleFileUpload} disabled={loading}>
            {loading ? 'Processing...' : 'Upload & Verify ID'}
          </button>
          {docResult && (
            <div className="doc-status">Status: {docResult.status} (ID: {docResult.extractedData.docId})</div>
          )}
        </section>
      </main>

      <style jsx>{`
        .container {
          font-family: 'Inter', -apple-system, sans-serif;
          background: #f4f7f6;
          min-height: 100vh;
          padding: 2rem;
          color: #1a1a1a;
        }
        .top-branding {
          text-align: center;
          font-size: 0.75rem;
          letter-spacing: 0.1rem;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 1rem;
        }
        .top-branding span {
          color: #0070f3;
          font-weight: 800;
        }
        header { 
          text-align: center; 
          margin-bottom: 4rem; 
          animation: slideUp 0.8s ease-out;
        }
        h1 { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.05rem; margin: 0; }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        input, select {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        .dashboard {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: transform 0.2s;
        }
        .card:hover { transform: translateY(-5px); }
        .primary-btn { background: #111; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
        .submit-btn { 
          background: #0070f3; 
          color: white; 
          border: none; 
          padding: 10px 20px; 
          border-radius: 6px; 
          cursor: pointer; 
          margin-top: 10px;
          width: 100%;
          font-weight: bold;
        }
        .secondary-btn { background: #fff; color: #111; border: 1px solid #111; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
        
        .recommendations-list {
          margin-top: 2rem;
          text-align: left;
        }
        .scheme-item {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          animation: fadeIn 0.5s ease-in;
        }
        .scheme-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .scheme-name { font-weight: bold; color: #111; }
        .match-badge { background: #e6f7ed; color: #008a2e; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }
        .tags { display: flex; gap: 0.5rem; }
        .tag { font-size: 0.7rem; color: #666; background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .submission-zone {
          border-top: 2px dashed #eee;
          margin-top: 20px;
          padding-top: 20px;
        }
        .doc-status {
          margin-top: 1rem;
          font-size: 0.85rem;
          background: #f0f0f0;
          padding: 10px;
          border-radius: 6px;
        }
        .results {
          margin-top: 1rem;
          color: #0070f3;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default BharatSevaApp;