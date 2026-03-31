from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model and feature names
try:
    with open("disease_model.pkl", "rb") as f:
        model = pickle.load(f)
    logger.info("Disease prediction model loaded successfully")

    with open("feature_names.pkl", "rb") as f:
        feature_names = pickle.load(f)
    logger.info("Feature names loaded successfully")

except FileNotFoundError as e:
    logger.error(f"Model files not found: {e}")
    logger.info("Please run health_ml.py first to train the model")
    model = None
    feature_names = None

# Disease information and recommendations
DISEASE_INFO = {
    'Common Cold': {
        'description': 'A viral infection of the upper respiratory tract',
        'severity': 'Mild',
        'recommendations': [
            'Rest and drink plenty of fluids',
            'Use over-the-counter cold medications',
            'Use humidifier to ease congestion',
            'Avoid close contact with others'
        ],
        'precautions': 'Wash hands frequently, avoid touching face'
    },
    'Flu': {
        'description': 'A contagious respiratory illness caused by influenza viruses',
        'severity': 'Moderate to Severe',
        'recommendations': [
            'Rest and stay hydrated',
            'Take antiviral medications as prescribed',
            'Use pain relievers for fever and aches',
            'Seek medical attention if symptoms worsen'
        ],
        'precautions': 'Get annual flu vaccine, practice good hygiene'
    },
    'COVID-19': {
        'description': 'A respiratory illness caused by SARS-CoV-2 virus',
        'severity': 'Variable (Mild to Critical)',
        'recommendations': [
            'Isolate immediately and contact healthcare provider',
            'Monitor symptoms closely',
            'Stay hydrated and rest',
            'Seek emergency care for breathing difficulties'
        ],
        'precautions': 'Wear mask, maintain social distance, get vaccinated'
    },
    'Pneumonia': {
        'description': 'Inflammation of the air sacs in the lungs',
        'severity': 'Severe',
        'recommendations': [
            'Seek immediate medical attention',
            'Complete prescribed antibiotic course',
            'Rest and stay hydrated',
            'Use oxygen therapy if needed'
        ],
        'precautions': 'Get vaccinated, quit smoking, maintain healthy lifestyle'
    },
    'Bronchitis': {
        'description': 'Inflammation of the bronchial tubes',
        'severity': 'Moderate',
        'recommendations': [
            'Rest and drink fluids',
            'Use humidifier',
            'Take prescribed medications',
            'Avoid irritants like smoke'
        ],
        'precautions': 'Avoid smoking, get flu vaccine'
    },
    'Asthma': {
        'description': 'A chronic respiratory condition causing breathing difficulties',
        'severity': 'Variable',
        'recommendations': [
            'Use prescribed inhalers regularly',
            'Identify and avoid triggers',
            'Create an asthma action plan',
            'Regular check-ups with doctor'
        ],
        'precautions': 'Avoid allergens, exercise regularly, maintain healthy weight'
    },
    'Diabetes': {
        'description': 'A metabolic disorder affecting blood sugar regulation',
        'severity': 'Chronic',
        'recommendations': [
            'Monitor blood sugar regularly',
            'Follow prescribed medication regimen',
            'Maintain healthy diet and exercise',
            'Regular medical check-ups'
        ],
        'precautions': 'Healthy diet, regular exercise, weight management'
    },
    'Hypertension': {
        'description': 'High blood pressure that can damage arteries',
        'severity': 'Chronic',
        'recommendations': [
            'Take prescribed medications regularly',
            'Monitor blood pressure at home',
            'Reduce salt intake',
            'Regular exercise and weight management'
        ],
        'precautions': 'Healthy diet, regular exercise, limit alcohol, manage stress'
    },
    'Heart Disease': {
        'description': 'Conditions affecting the heart and blood vessels',
        'severity': 'Severe',
        'recommendations': [
            'Seek immediate medical attention for chest pain',
            'Follow cardiac rehabilitation program',
            'Take prescribed medications',
            'Lifestyle modifications'
        ],
        'precautions': 'Healthy diet, exercise, no smoking, regular check-ups'
    },
    'Migraine': {
        'description': 'Severe headache often accompanied by other symptoms',
        'severity': 'Moderate',
        'recommendations': [
            'Identify and avoid triggers',
            'Take prescribed preventive medications',
            'Use acute medications for attacks',
            'Practice stress management techniques'
        ],
        'precautions': 'Maintain regular sleep schedule, manage stress, healthy diet'
    },
    'Allergies': {
        'description': 'Immune system reaction to substances',
        'severity': 'Mild to Moderate',
        'recommendations': [
            'Avoid known allergens',
            'Use antihistamines as needed',
            'Consider allergy shots for severe cases',
            'Keep allergy diary'
        ],
        'precautions': 'Identify triggers, use air purifiers, regular cleaning'
    },
    'Gastritis': {
        'description': 'Inflammation of the stomach lining',
        'severity': 'Moderate',
        'recommendations': [
            'Avoid irritants like alcohol and NSAIDs',
            'Eat smaller, more frequent meals',
            'Take prescribed medications',
            'Manage stress'
        ],
        'precautions': 'Healthy diet, avoid smoking, manage stress'
    },
    'Ulcer': {
        'description': 'Sores in the lining of stomach or duodenum',
        'severity': 'Moderate',
        'recommendations': [
            'Take prescribed medications',
            'Avoid irritants (alcohol, smoking, NSAIDs)',
            'Follow bland diet during flare-ups',
            'Regular follow-up with doctor'
        ],
        'precautions': 'Avoid H. pylori infection, manage stress, healthy lifestyle'
    },
    'Hepatitis': {
        'description': 'Inflammation of the liver',
        'severity': 'Variable',
        'recommendations': [
            'Complete prescribed treatment',
            'Avoid alcohol completely',
            'Regular medical monitoring',
            'Vaccination for hepatitis A and B'
        ],
        'precautions': 'Safe sex practices, avoid sharing needles, get vaccinated'
    },
    'Kidney Stones': {
        'description': 'Hard deposits formed in kidneys',
        'severity': 'Moderate to Severe',
        'recommendations': [
            'Drink plenty of water',
            'Take pain medications as prescribed',
            'May need medical procedures to remove stones',
            'Follow dietary recommendations'
        ],
        'precautions': 'Stay hydrated, balanced diet, regular exercise'
    },
    'Arthritis': {
        'description': 'Inflammation of joints causing pain and stiffness',
        'severity': 'Chronic',
        'recommendations': [
            'Regular exercise and physical therapy',
            'Take prescribed medications',
            'Use assistive devices if needed',
            'Maintain healthy weight'
        ],
        'precautions': 'Regular exercise, healthy diet, protect joints'
    },
    'Depression': {
        'description': 'Mental health disorder affecting mood and behavior',
        'severity': 'Variable',
        'recommendations': [
            'Seek professional help (therapy, counseling)',
            'Consider medication if prescribed',
            'Practice self-care and stress management',
            'Build support network'
        ],
        'precautions': 'Regular exercise, healthy diet, adequate sleep, social support'
    },
    'Anxiety': {
        'description': 'Mental health disorder characterized by excessive worry',
        'severity': 'Variable',
        'recommendations': [
            'Practice relaxation techniques',
            'Cognitive behavioral therapy',
            'Consider medication if prescribed',
            'Regular exercise and healthy lifestyle'
        ],
        'precautions': 'Stress management, regular sleep, limit caffeine, social support'
    },
    'Thyroid Disorder': {
        'description': 'Problems with thyroid gland function',
        'severity': 'Variable',
        'recommendations': [
            'Take thyroid hormone replacement if prescribed',
            'Regular thyroid function tests',
            'Follow dietary recommendations',
            'Regular medical follow-up'
        ],
        'precautions': 'Iodine-rich diet, regular check-ups, manage stress'
    },
    'Anemia': {
        'description': 'Condition with insufficient healthy red blood cells',
        'severity': 'Variable',
        'recommendations': [
            'Take iron supplements if prescribed',
            'Eat iron-rich foods',
            'Treat underlying cause',
            'Regular blood tests'
        ],
        'precautions': 'Balanced diet with iron-rich foods, regular health check-ups'
    }
}

@app.route("/")
def home():
    return jsonify({
        "message": "BharatSeva Health AI API Running",
        "status": "active",
        "version": "2.0",
        "endpoints": {
            "predict": "POST /predict - Predict disease from symptoms",
            "diseases": "GET /diseases - Get list of detectable diseases",
            "health": "GET /health - API health check"
        }
    })

@app.route("/health")
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": model is not None,
        "features_loaded": feature_names is not None
    })

@app.route("/diseases")
def get_diseases():
    """Get list of all detectable diseases with information"""
    return jsonify({
        "diseases": list(DISEASE_INFO.keys()),
        "count": len(DISEASE_INFO),
        "disease_info": DISEASE_INFO
    })

@app.route("/predict", methods=["POST"])
def predict():
    """Predict disease based on symptoms"""
    try:
        if model is None or feature_names is None:
            return jsonify({
                "error": "Model not loaded. Please train the model first by running health_ml.py",
                "status": "error"
            }), 500

        # Get JSON data from request
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No data provided. Please send symptom data in JSON format.",
                "status": "error"
            }), 400

        logger.info(f"Received prediction request: {data}")

        # Extract symptoms from request
        symptoms = {}

        # Map common symptom names to model features
        symptom_mapping = {
            'fever': ['fever', 'high_temperature', 'temperature'],
            'cough': ['cough', 'coughing'],
            'headache': ['headache', 'head_pain'],
            'fatigue': ['fatigue', 'tiredness', 'weakness'],
            'nausea': ['nausea', 'feeling_sick'],
            'vomiting': ['vomiting', 'throwing_up'],
            'diarrhea': ['diarrhea', 'loose_stools'],
            'chest_pain': ['chest_pain', 'chest_discomfort'],
            'shortness_breath': ['shortness_breath', 'difficulty_breathing', 'breathlessness'],
            'sore_throat': ['sore_throat', 'throat_pain'],
            'runny_nose': ['runny_nose', 'nasal_discharge'],
            'body_ache': ['body_ache', 'muscle_pain', 'aches'],
            'loss_appetite': ['loss_appetite', 'no_appetite'],
            'dizziness': ['dizziness', 'lightheadedness'],
            'sweating': ['sweating', 'excessive_sweating'],
            'chills': ['chills', 'shivering'],
            'joint_pain': ['joint_pain', 'arthritis'],
            'rash': ['rash', 'skin_rash'],
            'itching': ['itching', 'itchy_skin'],
            'abdominal_pain': ['abdominal_pain', 'stomach_pain'],
            'back_pain': ['back_pain', 'backache'],
            'frequent_urination': ['frequent_urination', 'urinating_often'],
            'weight_loss': ['weight_loss', 'losing_weight'],
            'weight_gain': ['weight_gain', 'gaining_weight'],
            'mood_swings': ['mood_swings', 'mood_changes'],
            'insomnia': ['insomnia', 'sleep_problems']
        }

        # Initialize all features to 0
        for feature in feature_names:
            symptoms[feature] = 0

        # Process input symptoms
        for input_symptom, value in data.items():
            input_symptom_lower = input_symptom.lower()

            # Check if input symptom matches any known symptoms
            for model_feature, aliases in symptom_mapping.items():
                if input_symptom_lower in aliases or any(alias in input_symptom_lower for alias in aliases):
                    if model_feature in symptoms:
                        symptoms[model_feature] = 1 if value else 0
                    break

        # Convert to array for prediction
        input_features = np.array([symptoms[feature] for feature in feature_names]).reshape(1, -1)

        logger.info(f"Input features: {input_features}")

        # Make prediction
        prediction = model.predict(input_features)
        predicted_disease = prediction[0]

        # Get prediction probabilities
        probabilities = model.predict_proba(input_features)[0]
        confidence = float(max(probabilities))

        # Get disease information
        disease_details = DISEASE_INFO.get(predicted_disease, {
            'description': 'Disease information not available',
            'severity': 'Unknown',
            'recommendations': ['Consult a healthcare professional'],
            'precautions': 'Seek medical advice'
        })

        # Prepare response
        response = {
            "prediction": predicted_disease,
            "confidence": round(confidence * 100, 2),
            "description": disease_details['description'],
            "severity": disease_details['severity'],
            "recommendations": disease_details['recommendations'],
            "precautions": disease_details['precautions'],
            "timestamp": datetime.now().isoformat(),
            "status": "success",
            "disclaimer": "This is an AI prediction tool. Please consult a qualified healthcare professional for accurate diagnosis and treatment."
        }

        logger.info(f"Prediction result: {predicted_disease} (confidence: {confidence:.2f})")

        return jsonify(response)

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            "error": f"An error occurred during prediction: {str(e)}",
            "status": "error"
        }), 500

@app.route("/symptoms")
def get_symptoms():
    """Get list of all possible symptoms"""
    symptoms_list = [
        "fever", "cough", "headache", "fatigue", "nausea", "vomiting",
        "diarrhea", "chest_pain", "shortness_breath", "sore_throat",
        "runny_nose", "body_ache", "loss_appetite", "dizziness",
        "sweating", "chills", "joint_pain", "rash", "itching",
        "abdominal_pain", "back_pain", "frequent_urination",
        "weight_loss", "weight_gain", "mood_swings", "insomnia"
    ]

    return jsonify({
        "symptoms": symptoms_list,
        "count": len(symptoms_list)
    })

if __name__ == "__main__":
    print("Starting BharatSeva Health AI API...")
    print("API will be available at: http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    app.run(host='0.0.0.0', port=5000, debug=True)