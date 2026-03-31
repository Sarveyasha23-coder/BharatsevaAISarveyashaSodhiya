const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { ModelFactory } = require('../models');

// Initialize AI models
const modelFactory = new ModelFactory();
const fraudDetector = modelFactory.get_fraud_detector();

// Mock database for applications (in production, use MongoDB)
const applications = new Map();

// POST /api/apply - Submit scheme application
router.post('/', async (req, res) => {
  try {
    const { schemeId, citizen, notes, documents } = req.body;

    if (!schemeId || !citizen) {
      return res.status(400).json({ 
        error: 'Scheme ID and citizen information are required' 
      });
    }

    // Generate application ID
    const applicationId = `APP-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Perform fraud detection
    const fraudResult = fraudDetector.detect_fraud({
      personal_info: JSON.stringify(citizen),
      application_text: notes || '',
      supporting_documents: documents?.join(', ') || '',
      income: citizen.annual_income || 0
    });

    // Create application record
    const application = {
      id: applicationId,
      schemeId,
      citizen,
      notes: notes || '',
      documents: documents || [],
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      fraudCheck: {
        riskLevel: fraudResult.risk_level.value,
        confidence: fraudResult.confidence,
        flaggedPatterns: fraudResult.flagged_patterns,
        riskFactors: fraudResult.risk_factors
      },
      nextStep: 'Application under review'
    };

    // Determine status based on fraud check
    if (fraudResult.risk_level.value === 'critical') {
      application.status = 'flagged';
      application.nextStep = 'Application flagged for manual review due to high fraud risk';
    } else if (fraudResult.risk_level.value === 'high') {
      application.status = 'under_review';
      application.nextStep = 'Additional verification required';
    }

    // Store application (in production, save to database)
    applications.set(applicationId, application);

    // Create receipt
    const receipt = {
      applicationId,
      schemeName: getSchemeName(schemeId),
      status: application.status,
      submittedAt: application.submittedAt,
      nextStep: application.nextStep,
      fraudRiskLevel: fraudResult.risk_level.value,
      estimatedProcessingTime: getProcessingTime(fraudResult.risk_level.value)
    };

    console.log(`Application submitted: ${applicationId} for scheme: ${schemeId}`);
    console.log(`Fraud risk: ${fraudResult.risk_level.value} (${fraudResult.confidence.toFixed(2)})`);

    res.json(receipt);

  } catch (error) {
    console.error('Error in apply API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/apply/:id - Get application status
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const application = applications.get(id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
      applicationId: application.id,
      schemeName: getSchemeName(application.schemeId),
      status: application.status,
      submittedAt: application.submittedAt,
      nextStep: application.nextStep,
      documents: application.documents,
      fraudCheck: application.fraudCheck
    });

  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/apply - Get all applications (admin endpoint)
router.get('/', (req, res) => {
  try {
    const allApplications = Array.from(applications.values()).map(app => ({
      applicationId: app.id,
      schemeId: app.schemeId,
      schemeName: getSchemeName(app.schemeId),
      status: app.status,
      submittedAt: app.submittedAt,
      citizenName: app.citizen.fullName,
      fraudRiskLevel: app.fraudCheck.riskLevel
    }));

    res.json({ applications: allApplications });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/apply/:id/status - Update application status (admin endpoint)
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, nextStep, notes } = req.body;

    const application = applications.get(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update application
    application.status = status;
    application.nextStep = nextStep || application.nextStep;
    application.updatedAt = new Date().toISOString();
    if (notes) {
      application.adminNotes = notes;
    }

    applications.set(id, application);

    res.json({
      applicationId: id,
      status: application.status,
      nextStep: application.nextStep,
      updatedAt: application.updatedAt
    });

  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
function getSchemeName(schemeId) {
  const schemes = {
    'pm_kisan': 'PM-Kisan Samman Nidhi',
    'ayushman_bharat': 'Ayushman Bharat PM-JAY',
    'pm_awas_yojana': 'PM Awas Yojana'
  };
  return schemes[schemeId] || 'Unknown Scheme';
}

function getProcessingTime(riskLevel) {
  const times = {
    'low': '3-5 working days',
    'medium': '5-7 working days',
    'high': '7-10 working days',
    'critical': '10-15 working days'
  };
  return times[riskLevel] || '5-7 working days';
}

module.exports = router;
