const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const Ajv = require("ajv")
const next = require("next")
const { ModelFactory } = require("./models")

dotenv.config()

const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const app = express()

// Trust proxy for platforms like Render/Vercel/AWS to handle HTTPS/IPs correctly
app.set('trust proxy', 1);

// Secure CORS for production
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' })) // Increased limit for AI document data
app.use(express.urlencoded({ extended: true }))

// Initialize Validation
const ajv = new Ajv()
const factory = new ModelFactory();

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bharatseva";
mongoose.connect(MONGODB_URI, { 
    dbName: 'bharatseva',
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    heartbeatFrequencyMS: 10000, // Check server health every 10 seconds
    family: 4
})
    .then(() => {
        const host = mongoose.connection.host;
        console.log(`Connected to MongoDB: ${host.includes('mongodb.net') ? 'Atlas' : 'Local'}`);
    })
    .catch(err => console.error("Database connection error:", err));

// Survey Schema for data persistence
const SurveySchema = new mongoose.Schema({
    userId: String,
    responses: Object,
    detectedLanguage: String,
    timestamp: { type: Date, default: Date.now }
});
const Survey = mongoose.model("Survey", SurveySchema);

const langDetector = factory.get_language_detector();
const eligibilityCalc = factory.get_eligibility_calculator();
const docAI = factory.get_document_ai();
const recommender = factory.get_recommendation_engine();

// Validation Schemas
const surveySchema = {
    type: "object",
    properties: {
        userId: { type: "string" },
        responses: { type: "object" }
    },
    required: ["userId", "responses"]
};
const validateSurvey = ajv.compile(surveySchema);

// Recommendation Input Schema
const recommendationSchema = {
    type: "object",
    properties: {
        age: { type: "integer" },
        income: { type: "integer" },
        category: { type: "string" },
        isFarmer: { type: "boolean" },
        interests: { type: "array", items: { type: "string" } }
    },
    required: ["age", "income"]
};
const validateRecommendation = ajv.compile(recommendationSchema);

// Eligibility Input Schema
const eligibilitySchema = {
    type: "object",
    properties: {
        scheme: { type: "string" },
        userData: {
            type: "object",
            properties: { 
                age: { type: "integer" }, 
                income: { type: "integer" },
                category: { type: "string" },
                isFarmer: { type: "boolean" }
            }
        }
    },
    required: ["scheme", "userData"]
};
const validateEligibility = ajv.compile(eligibilitySchema);

// Request Logger (Simple version of Morgan)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get("/", (req,res)=>{
    res.status(200).json({ status: "success", message: "BharatSeva AI Backend Running" });
})

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// AI Route: Detect Language
app.post("/api/ai/detect", (req, res) => {
    const { text } = req.body;
    const lang = langDetector.detect(text);
    res.json({ language: lang });
});

// AI Route: Check Eligibility
app.post("/api/ai/eligibility", (req, res) => {
    const valid = validateEligibility(req.body);
    if (!valid) {
        return res.status(400).json({ error: "Invalid eligibility parameters", details: validateEligibility.errors });
    }

    const { scheme, userData } = req.body;
    const result = eligibilityCalc.calculate(scheme, userData);
    res.json(result);
});

// Recommendation Route: Personalized Scheme Match
app.post("/api/schemes/recommend", (req, res) => {
    const valid = validateRecommendation(req.body);
    if (!valid) {
        return res.status(400).json({ error: "Invalid user data provided", details: validateRecommendation.errors });
    }

    const recommendations = recommender.recommend(req.body);
    res.json({ status: "success", data: recommendations });
});

// AI Route: Analyze Document (Live Simulation)
app.post("/api/ai/analyze-doc", async (req, res, next) => {
    try {
        const result = await docAI.analyze(req.body.type, req.body.file);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

// Survey Route: Submit and Save
app.post("/api/survey/submit", async (req, res, next) => {
    try {
        const valid = validateSurvey(req.body);
        if (!valid) {
            return res.status(400).json({ error: "Validation failed", details: validateSurvey.errors });
        }

        const newSurvey = new Survey(req.body);
        newSurvey.detectedLanguage = langDetector.detect(JSON.stringify(req.body.responses));
        await newSurvey.save();
        res.status(201).json({ status: "success", message: "Survey data secured" });
    } catch (err) {
        next(err);
    }
});

// Next.js Handler: Handle all routes not caught by Express API
app.all("*", (req, res) => {
    return handle(req, res);
});

// 404 Handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Global Error Handler to prevent server crashes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "An internal server error occurred" });
});

// Graceful Shutdown
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});

const PORT = process.env.PORT || 10000;

nextApp.prepare().then(() => {
    app.listen(PORT, () => {
        console.log(`
🚀 Server running on port ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
        `);
    });
});
