"""
AI/ML Models for BharatSeva AI System
Includes: Crop disease detection, fraud pattern detection, language detection, OCR pipeline, eligibility calculator
"""

import re
import json
import base64
from typing import Dict, List, Tuple, Optional, Any, Union
from dataclasses import dataclass
from enum import Enum
import numpy as np

# Enums and Data Classes
class DiseaseSeverity(Enum):
    HEALTHY = "healthy"
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"

class FraudRiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Language(Enum):
    HINDI = "hi"
    ENGLISH = "en"
    BENGALI = "bn"
    MARATHI = "mr"
    TAMIL = "ta"
    TELUGU = "te"
    GUJARATI = "gu"
    KANNADA = "kn"
    MALAYALAM = "ml"
    PUNJABI = "pa"

@dataclass
class CropDiseaseResult:
    disease_name: str
    confidence: float
    severity: DiseaseSeverity
    recommendations: List[str]
    affected_area_percent: float

@dataclass
class FraudDetectionResult:
    risk_level: FraudRiskLevel
    confidence: float
    flagged_patterns: List[str]
    risk_factors: List[str]
    recommended_action: str

@dataclass
class LanguageDetectionResult:
    detected_language: Language
    confidence: float
    supported_languages: List[Language]

@dataclass
class OCRResult:
    extracted_text: str
    confidence: float
    bounding_boxes: List[Dict[str, Any]]
    document_type: Optional[str]
    processed_fields: Dict[str, Any]

@dataclass
class EligibilityResult:
    is_eligible: bool
    confidence: float
    score: float
    missing_requirements: List[str]
    matching_criteria: List[str]
    recommendations: List[str]

class CropDiseaseDetector:
    """
    Crop disease detection using rule-based system with YOLOv11 integration hooks
    """
    
    def __init__(self):
        self.disease_patterns = {
            "leaf_blight": {
                "symptoms": ["yellow_spots", "brown_patches", "leaf_drying"],
                "color_ranges": {"yellow": [(20, 100, 100), (30, 255, 255)], "brown": [(10, 100, 100), (20, 255, 255)]},
                "severity_thresholds": {"mild": 0.1, "moderate": 0.3, "severe": 0.6}
            },
            "powdery_mildew": {
                "symptoms": ["white_powder", "leaf_curling", "stunted_growth"],
                "color_ranges": {"white": [(0, 0, 200), (180, 30, 255)]},
                "severity_thresholds": {"mild": 0.15, "moderate": 0.35, "severe": 0.7}
            },
            "bacterial_spot": {
                "symptoms": ["dark_spots", "water_soaked", "leaf_holes"],
                "color_ranges": {"dark": [(0, 0, 0), (10, 255, 255)]},
                "severity_thresholds": {"mild": 0.2, "moderate": 0.4, "severe": 0.8}
            }
        }
        
        # YOLOv11 model placeholder - in production, load actual model
        self.yolo_model = None
        self.model_loaded = False
    
    def load_yolo_model(self, model_path: str = "models/yolov11_crop_disease.pt"):
        """Hook for loading YOLOv11 model"""
        try:
            # In production: self.yolo_model = torch.hub.load('ultralytics/yolov11', 'custom', path=model_path)
            self.model_loaded = True
            return True
        except Exception as e:
            print(f"Failed to load YOLO model: {e}")
            return False
    
    def detect_with_yolo(self, image_data: bytes) -> List[Dict]:
        """YOLOv11 detection hook"""
        if not self.model_loaded or not self.yolo_model:
            return []
        
        # Placeholder for YOLOv11 inference
        # In production:
        # results = self.yolo_model(image_data)
        # return results.pandas().xyxy[0].to_dict('records')
        return []
    
    def analyze_symptoms(self, image_features: Dict) -> Dict[str, float]:
        """Rule-based symptom analysis"""
        disease_scores = {}
        
        for disease, config in self.disease_patterns.items():
            score = 0.0
            symptom_matches = 0
            
            for symptom in config["symptoms"]:
                if symptom in image_features.get("detected_symptoms", []):
                    symptom_matches += 1
                    score += 0.3
            
            # Color-based detection
            for color, (lower, upper) in config["color_ranges"].items():
                if color in image_features.get("dominant_colors", []):
                    score += 0.2
            
            disease_scores[disease] = min(score, 1.0)
        
        return disease_scores
    
    def calculate_severity(self, disease: str, affected_area: float) -> DiseaseSeverity:
        """Calculate disease severity based on affected area"""
        thresholds = self.disease_patterns[disease]["severity_thresholds"]
        
        if affected_area >= thresholds["severe"]:
            return DiseaseSeverity.SEVERE
        elif affected_area >= thresholds["moderate"]:
            return DiseaseSeverity.MODERATE
        elif affected_area >= thresholds["mild"]:
            return DiseaseSeverity.MILD
        else:
            return DiseaseSeverity.HEALTHY
    
    def detect_disease(self, image_data: bytes, image_features: Optional[Dict] = None) -> CropDiseaseResult:
        """Main disease detection method"""
        # Try YOLOv11 detection first
        yolo_results = self.detect_with_yolo(image_data)
        
        # Fallback to rule-based detection
        if not yolo_results and image_features:
            disease_scores = self.analyze_symptoms(image_features)
        else:
            disease_scores = {}
        
        # Determine most likely disease
        if disease_scores:
            disease_name = max(disease_scores, key=disease_scores.get)
            confidence = disease_scores[disease_name]
        else:
            disease_name = "healthy"
            confidence = 0.8
        
        # Calculate severity
        affected_area = image_features.get("affected_area_percent", 0.0) if image_features else 0.0
        severity = self.calculate_severity(disease_name, affected_area)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(disease_name, severity)
        
        return CropDiseaseResult(
            disease_name=disease_name,
            confidence=confidence,
            severity=severity,
            recommendations=recommendations,
            affected_area_percent=affected_area
        )
    
    def _generate_recommendations(self, disease: str, severity: DiseaseSeverity) -> List[str]:
        """Generate treatment recommendations based on disease and severity"""
        recommendations = {
            "leaf_blight": {
                DiseaseSeverity.MILD: ["Apply copper-based fungicide", "Improve air circulation"],
                DiseaseSeverity.MODERATE: ["Remove affected leaves", "Apply systemic fungicide", "Monitor closely"],
                DiseaseSeverity.SEVERE: ["Remove entire plant if necessary", "Apply strong fungicide treatment", "Quarantine area"]
            },
            "powdery_mildew": {
                DiseaseSeverity.MILD: ["Apply neem oil spray", "Reduce humidity"],
                DiseaseSeverity.MODERATE: ["Use sulfur-based fungicide", "Prune affected areas"],
                DiseaseSeverity.SEVERE: ["Apply chemical fungicide", "Remove severely affected plants"]
            },
            "bacterial_spot": {
                DiseaseSeverity.MILD: ["Apply copper spray", "Avoid overhead watering"],
                DiseaseSeverity.MODERATE: ["Use bactericide", "Remove spotted leaves"],
                DiseaseSeverity.SEVERE: ["Destroy affected plants", "Treat soil with bactericide"]
            }
        }
        
        if disease == "healthy":
            return ["Continue regular monitoring", "Maintain proper plant care"]
        
        return recommendations.get(disease, {}).get(severity, ["Consult agricultural expert"])

class FraudDetector:
    """
    Fraud pattern detection using regex patterns and NLP analysis
    """
    
    def __init__(self):
        self.suspicious_patterns = {
            "duplicate_applications": [
                r"same.*aadhaar.*multiple.*times",
                r"duplicate.*application.*detected",
                r"multiple.*schemes.*same.*period"
            ],
            "identity_mismatch": [
                r"name.*mismatch.*documents",
                r"different.*signature.*detected",
                r"photo.*verification.*failed"
            ],
            "document_forgery": [
                r"fake.*document.*detected",
                r"photoshop.*evidence",
                r"digital.*alteration.*found"
            ],
            "ineligible_patterns": [
                r"income.*exceeds.*limit",
                r"age.*below.*requirement",
                r"residence.*outside.*scope"
            ],
            "suspicious_timing": [
                r"multiple.*applications.*short.*time",
                r"batch.*submission.*detected",
                r"automated.*pattern.*found"
            ]
        }
        
        self.risk_keywords = {
            "high": ["urgent", "immediate", "emergency", "critical", "severe"],
            "medium": ["review", "verify", "check", "confirm"],
            "low": ["standard", "normal", "regular", "routine"]
        }
    
    def analyze_text_patterns(self, text: str) -> List[str]:
        """Analyze text for suspicious patterns using regex"""
        detected_patterns = []
        
        for category, patterns in self.suspicious_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text, re.IGNORECASE):
                    detected_patterns.append(f"{category}: {pattern}")
        
        return detected_patterns
    
    def analyze_nlp_sentiment(self, text: str) -> Dict[str, float]:
        """NLP analysis for sentiment and unusual patterns"""
        # Placeholder for actual NLP processing
        # In production, use transformers or spaCy
        
        words = text.lower().split()
        sentiment_score = 0.0
        urgency_score = 0.0
        
        for word in words:
            if word in self.risk_keywords["high"]:
                urgency_score += 0.3
            elif word in self.risk_keywords["medium"]:
                urgency_score += 0.1
        
        # Simple sentiment analysis
        negative_words = ["problem", "issue", "error", "failed", "rejected"]
        positive_words = ["approved", "success", "complete", "verified"]
        
        for word in words:
            if word in negative_words:
                sentiment_score -= 0.2
            elif word in positive_words:
                sentiment_score += 0.2
        
        return {
            "sentiment": max(-1, min(1, sentiment_score)),
            "urgency": min(1, urgency_score)
        }
    
    def calculate_risk_score(self, patterns: List[str], nlp_scores: Dict) -> Tuple[FraudRiskLevel, float]:
        """Calculate overall fraud risk score"""
        base_score = len(patterns) * 0.2
        urgency_bonus = nlp_scores.get("urgency", 0) * 0.3
        sentiment_penalty = abs(nlp_scores.get("sentiment", 0)) * 0.1
        
        total_score = min(1.0, base_score + urgency_bonus + sentiment_penalty)
        
        if total_score >= 0.8:
            return FraudRiskLevel.CRITICAL, total_score
        elif total_score >= 0.6:
            return FraudRiskLevel.HIGH, total_score
        elif total_score >= 0.3:
            return FraudRiskLevel.MEDIUM, total_score
        else:
            return FraudRiskLevel.LOW, total_score
    
    def detect_fraud(self, application_data: Dict[str, Any]) -> FraudDetectionResult:
        """Main fraud detection method"""
        # Extract text from application data
        text_content = " ".join([
            str(application_data.get("personal_info", "")),
            str(application_data.get("application_text", "")),
            str(application_data.get("supporting_documents", ""))
        ])
        
        # Pattern detection
        flagged_patterns = self.analyze_text_patterns(text_content)
        
        # NLP analysis
        nlp_scores = self.analyze_nlp_sentiment(text_content)
        
        # Risk calculation
        risk_level, confidence = self.calculate_risk_score(flagged_patterns, nlp_scores)
        
        # Generate risk factors and recommendations
        risk_factors = self._generate_risk_factors(flagged_patterns, application_data)
        recommended_action = self._generate_action(risk_level)
        
        return FraudDetectionResult(
            risk_level=risk_level,
            confidence=confidence,
            flagged_patterns=flagged_patterns,
            risk_factors=risk_factors,
            recommended_action=recommended_action
        )
    
    def _generate_risk_factors(self, patterns: List[str], app_data: Dict) -> List[str]:
        """Generate specific risk factors based on detected patterns"""
        factors = []
        
        for pattern in patterns:
            if "duplicate" in pattern:
                factors.append("Multiple applications detected")
            elif "mismatch" in pattern:
                factors.append("Identity verification issues")
            elif "fake" in pattern or "forgery" in pattern:
                factors.append("Document authenticity concerns")
            elif "timing" in pattern:
                factors.append("Unusual submission pattern")
        
        # Add data-specific factors
        if app_data.get("income", 0) > 1000000:  # High income threshold
            factors.append("Income above scheme limits")
        
        return factors
    
    def _generate_action(self, risk_level: FraudRiskLevel) -> str:
        """Generate recommended action based on risk level"""
        actions = {
            FraudRiskLevel.LOW: "Proceed with standard processing",
            FraudRiskLevel.MEDIUM: "Additional verification required",
            FraudRiskLevel.HIGH: "Manual review and document verification",
            FraudRiskLevel.CRITICAL: "Immediate investigation required"
        }
        return actions.get(risk_level, "Standard processing")

class LanguageDetector:
    """
    Language detection for multilingual support
    """
    
    def __init__(self):
        self.language_patterns = {
            Language.HINDI: {
                "scripts": [r"[\u0900-\u097F]"],  # Devanagari
                "words": ["है", "हैं", "के", "में", "से", "पर", "और", "लेकिन"],
                "common_phrases": ["नमस्ते", "धन्यवाद", "कृपया"]
            },
            Language.BENGALI: {
                "scripts": [r"[\u0980-\u09FF]"],  # Bengali
                "words": ["আছে", "আছেন", "এর", "তে", "থেকে", "এবং"],
                "common_phrases": ["নমস্কার", "ধন্যবাদ", "অনুগ্রহ"]
            },
            Language.TAMIL: {
                "scripts": [r"[\u0B80-\u0BFF]"],  # Tamil
                "words": ["உள்ளது", "இருக்கிறது", "இன்", "இல்", "இருந்து"],
                "common_phrases": ["வணக்கம்", "நன்றி", "தயவு"]
            },
            Language.TELUGU: {
                "scripts": [r"[\u0C00-\u0C7F]"],  # Telugu
                "words": ["ఉంది", "కి", "లో", "నుండి", "మరియు"],
                "common_phrases": ["నమస్కారం", "ధన్యవాదాలు", "దయచేసి"]
            },
            Language.MARATHI: {
                "scripts": [r"[\u0900-\u097F]"],  # Devanagari (shared with Hindi)
                "words": ["आहे", "आहेत", "चे", "मध्ये", "पासून", "आणि"],
                "common_phrases": ["नमस्कार", "धन्यवाद", "कृपया"]
            },
            Language.GUJARATI: {
                "scripts": [r"[\u0A80-\u0AFF]"],  # Gujarati
                "words": ["છે", "છે", "ના", "માં", "થી", "અને"],
                "common_phrases": ["નમસ્કાર", "આભાર", "કૃપા"]
            },
            Language.KANNADA: {
                "scripts": [r"[\u0C80-\u0CFF]"],  # Kannada
                "words": ["ಇದೆ", "ಇದ್ದಾರೆ", "ಎಸ್", "ನಲ್ಲಿ", "ಇಂದ", "ಮತ್ತು"],
                "common_phrases": ["ನಮಸ್ಕಾರ", "ಧನ್ಯವಾದಗಳು", "ದಯವಿಟ್ಟು"]
            },
            Language.MALAYALAM: {
                "scripts": [r"[\u0D00-\u0D7F]"],  # Malayalam
                "words": ["ഉണ്ട്", "ആണ്", "ന്റെ", "ൽ", "നിന്ന്", "ഒപ്പം"],
                "common_phrases": ["നമസ്കാരം", "നന്ദി", "ദയവായി"]
            },
            Language.PUNJABI: {
                "scripts": [r"[\u0A00-\u0A7F]"],  # Gurmukhi
                "words": ["ਹੈ", "ਹਨ", "ਦਾ", "ਵਿੱਚ", "ਤੋਂ", "ਅਤੇ"],
                "common_phrases": ["ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "ਧੰਨਵਾਦ", "ਕਿਰਪਾ"]
            }
        }
    
    def detect_script(self, text: str) -> List[Language]:
        """Detect language based on script patterns"""
        detected_languages = []
        
        for language, patterns in self.language_patterns.items():
            for script_pattern in patterns["scripts"]:
                if re.search(script_pattern, text):
                    detected_languages.append(language)
                    break
        
        return detected_languages
    
    def analyze_vocabulary(self, text: str) -> Dict[Language, float]:
        """Analyze vocabulary to detect language"""
        text_lower = text.lower()
        language_scores = {}
        
        for language, patterns in self.language_patterns.items():
            score = 0.0
            word_matches = 0
            
            # Check for common words
            for word in patterns["words"]:
                if word in text_lower:
                    word_matches += 1
                    score += 0.2
            
            # Check for common phrases
            for phrase in patterns["common_phrases"]:
                if phrase in text_lower:
                    score += 0.3
            
            language_scores[language] = min(score, 1.0)
        
        return language_scores
    
    def detect_language(self, text: str) -> LanguageDetectionResult:
        """Main language detection method"""
        # Script-based detection
        script_languages = self.detect_script(text)
        
        # Vocabulary-based detection
        vocab_scores = self.analyze_vocabulary(text)
        
        # Combine results
        final_scores = {}
        for language in Language:
            script_score = 1.0 if language in script_languages else 0.0
            vocab_score = vocab_scores.get(language, 0.0)
            final_scores[language] = (script_score * 0.7) + (vocab_score * 0.3)
        
        # Determine most likely language
        if final_scores:
            detected_language = max(final_scores, key=final_scores.get)
            confidence = final_scores[detected_language]
        else:
            detected_language = Language.ENGLISH
            confidence = 0.5
        
        supported_languages = list(Language)
        
        return LanguageDetectionResult(
            detected_language=detected_language,
            confidence=confidence,
            supported_languages=supported_languages
        )

class OCRPipeline:
    """
    OCR pipeline for document processing and field extraction
    """
    
    def __init__(self):
        self.document_patterns = {
            "aadhaar": {
                "fields": {
                    "name": r"Name[:\s]+([A-Za-z\s]+)",
                    "dob": r"DOB[:\s]+(\d{2}/\d{2}/\d{4})",
                    "aadhaar_number": r"\d{4}\s\d{4}\s\d{4}",
                    "gender": r"Gender[:\s]+(Male|Female|Other)"
                },
                "keywords": ["Aadhaar", "UIDAI", "Government of India"]
            },
            "pan_card": {
                "fields": {
                    "name": r"Name[:\s]+([A-Za-z\s]+)",
                    "pan_number": r"[A-Z]{5}\d{4}[A-Z]",
                    "dob": r"DOB[:\s]+(\d{2}/\d{2}/\d{4})"
                },
                "keywords": ["Permanent Account Number", "Income Tax", "PAN"]
            },
            "ration_card": {
                "fields": {
                    "name": r"Name[:\s]+([A-Za-z\s]+)",
                    "card_number": r"Card No[:\s]+(\w+)",
                    "address": r"Address[:\s]+(.+)"
                },
                "keywords": ["Ration Card", "Public Distribution", "PDS"]
            }
        }
    
    def preprocess_image(self, image_data: bytes) -> bytes:
        """Preprocess image for better OCR accuracy"""
        # Placeholder for image preprocessing
        # In production: enhance contrast, remove noise, deskew
        return image_data
    
    def extract_text(self, image_data: bytes) -> Tuple[str, float]:
        """Extract text from image using OCR"""
        # Placeholder for OCR engine (Tesseract, PaddleOCR, etc.)
        # In production:
        # import pytesseract
        # from PIL import Image
        # image = Image.open(io.BytesIO(image_data))
        # text = pytesseract.image_to_string(image, lang='eng+hin')
        # confidence = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
        
        # Mock extraction for demonstration
        mock_text = """
        Name: Raj Kumar Sharma
        DOB: 15/08/1985
        Aadhaar Number: 2345 6789 0123
        Gender: Male
        Address: Village Rampur, District Mathura, Uttar Pradesh
        """
        confidence = 0.85
        
        return mock_text.strip(), confidence
    
    def detect_document_type(self, text: str) -> Optional[str]:
        """Detect document type based on keywords"""
        text_lower = text.lower()
        
        for doc_type, config in self.document_patterns.items():
            keyword_count = sum(1 for keyword in config["keywords"] 
                              if keyword.lower() in text_lower)
            if keyword_count >= 2:  # At least 2 keywords match
                return doc_type
        
        return None
    
    def extract_fields(self, text: str, doc_type: str) -> Dict[str, Any]:
        """Extract specific fields based on document type"""
        if doc_type not in self.document_patterns:
            return {}
        
        extracted_fields = {}
        patterns = self.document_patterns[doc_type]["fields"]
        
        for field_name, pattern in patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                extracted_fields[field_name] = match.group(1).strip()
        
        return extracted_fields
    
    def process_document(self, image_data: bytes) -> OCRResult:
        """Main OCR pipeline processing"""
        # Preprocess image
        processed_image = self.preprocess_image(image_data)
        
        # Extract text
        extracted_text, confidence = self.extract_text(processed_image)
        
        # Detect document type
        document_type = self.detect_document_type(extracted_text)
        
        # Extract fields if document type is known
        processed_fields = {}
        if document_type:
            processed_fields = self.extract_fields(extracted_text, document_type)
        
        # Generate mock bounding boxes
        bounding_boxes = [
            {"x": 100, "y": 50, "width": 200, "height": 30, "text": "Name: Raj Kumar Sharma"},
            {"x": 100, "y": 90, "width": 150, "height": 30, "text": "DOB: 15/08/1985"},
            {"x": 100, "y": 130, "width": 180, "height": 30, "text": "Aadhaar: 2345 6789 0123"}
        ]
        
        return OCRResult(
            extracted_text=extracted_text,
            confidence=confidence,
            bounding_boxes=bounding_boxes,
            document_type=document_type,
            processed_fields=processed_fields
        )

class EligibilityCalculator:
    """
    Eligibility calculator for government schemes
    """
    
    def __init__(self):
        self.scheme_rules = {
            "pm_kisan": {
                "name": "PM-Kisan Samman Nidhi",
                "eligibility_criteria": {
                    "min_age": 18,
                    "max_age": 100,
                    "max_annual_income": 300000,
                    "required_occupation": ["farmer"],
                    "land_ownership": True,
                    "min_land_acres": 0.1,
                    "rural_required": True
                },
                "scoring_weights": {
                    "income": 0.3,
                    "land_ownership": 0.25,
                    "occupation": 0.2,
                    "rural_status": 0.15,
                    "age": 0.1
                }
            },
            "ayushman_bharat": {
                "name": "Ayushman Bharat PM-JAY",
                "eligibility_criteria": {
                    "min_age": 0,
                    "max_age": 100,
                    "max_annual_income": 500000,
                    "no_health_insurance": True,
                    "ration_card_required": True,
                    "rural_or_urban": True
                },
                "scoring_weights": {
                    "income": 0.4,
                    "health_coverage": 0.3,
                    "ration_card": 0.2,
                    "residence": 0.1
                }
            },
            "pm_awas_yojana": {
                "name": "PM Awas Yojana",
                "eligibility_criteria": {
                    "min_age": 18,
                    "max_annual_income": 300000,
                    "no_pucca_house": True,
                    "land_ownership": True,
                    "rural_required": True
                },
                "scoring_weights": {
                    "income": 0.35,
                    "house_status": 0.3,
                    "land_ownership": 0.2,
                    "rural_status": 0.15
                }
            }
        }
    
    def check_criteria_match(self, profile: Dict[str, Any], criteria: Dict[str, Any]) -> Dict[str, bool]:
        """Check individual eligibility criteria"""
        results = {}
        
        # Age check
        if "min_age" in criteria:
            results["age_min"] = profile.get("age", 0) >= criteria["min_age"]
        if "max_age" in criteria:
            results["age_max"] = profile.get("age", 0) <= criteria["max_age"]
        
        # Income check
        if "max_annual_income" in criteria:
            results["income"] = profile.get("annual_income", 0) <= criteria["max_annual_income"]
        
        # Occupation check
        if "required_occupation" in criteria:
            results["occupation"] = profile.get("occupation", "") in criteria["required_occupation"]
        
        # Land ownership
        if "land_ownership" in criteria:
            results["land_ownership"] = profile.get("owns_land", False) == criteria["land_ownership"]
        
        # Minimum land area
        if "min_land_acres" in criteria:
            results["land_area"] = profile.get("land_holding_acres", 0) >= criteria["min_land_acres"]
        
        # Rural status
        if "rural_required" in criteria:
            results["rural_status"] = profile.get("is_rural", False) == criteria["rural_required"]
        
        # Health insurance
        if "no_health_insurance" in criteria:
            results["no_health_insurance"] = not profile.get("has_health_coverage", False)
        
        # Ration card
        if "ration_card_required" in criteria:
            results["ration_card"] = profile.get("has_ration_card", False) == criteria["ration_card_required"]
        
        # House ownership
        if "no_pucca_house" in criteria:
            results["no_pucca_house"] = not profile.get("owns_pucca_house", False)
        
        return results
    
    def calculate_eligibility_score(self, criteria_results: Dict[str, bool], 
                                  weights: Dict[str, float]) -> float:
        """Calculate weighted eligibility score"""
        total_score = 0.0
        total_weight = 0.0
        
        for criterion, passed in criteria_results.items():
            weight = weights.get(criterion, 0.0)
            if weight > 0:
                total_score += (1.0 if passed else 0.0) * weight
                total_weight += weight
        
        return total_score / total_weight if total_weight > 0 else 0.0
    
    def identify_missing_requirements(self, criteria_results: Dict[str, bool], 
                                    criteria: Dict[str, Any]) -> List[str]:
        """Identify missing eligibility requirements"""
        missing = []
        
        if not criteria_results.get("age_min", True):
            missing.append(f"Minimum age requirement: {criteria.get('min_age', 'N/A')} years")
        
        if not criteria_results.get("age_max", True):
            missing.append(f"Maximum age limit: {criteria.get('max_age', 'N/A')} years")
        
        if not criteria_results.get("income", True):
            missing.append(f"Annual income below ₹{criteria.get('max_annual_income', 'N/A'):,}")
        
        if not criteria_results.get("occupation", True):
            missing.append(f"Required occupation: {criteria.get('required_occupation', 'N/A')}")
        
        if not criteria_results.get("land_ownership", True):
            missing.append("Land ownership required")
        
        if not criteria_results.get("land_area", True):
            missing.append(f"Minimum land area: {criteria.get('min_land_acres', 'N/A')} acres")
        
        if not criteria_results.get("rural_status", True):
            missing.append("Rural residence required")
        
        if not criteria_results.get("no_health_insurance", True):
            missing.append("Should not have existing health insurance")
        
        if not criteria_results.get("ration_card", True):
            missing.append("Ration card required")
        
        if not criteria_results.get("no_pucca_house", True):
            missing.append("Should not own a pucca house")
        
        return missing
    
    def calculate_eligibility(self, profile: Dict[str, Any], scheme_id: str) -> EligibilityResult:
        """Main eligibility calculation method"""
        if scheme_id not in self.scheme_rules:
            return EligibilityResult(
                is_eligible=False,
                confidence=0.0,
                score=0.0,
                missing_requirements=["Scheme not found"],
                matching_criteria=[],
                recommendations=["Check available schemes"]
            )
        
        scheme_config = self.scheme_rules[scheme_id]
        criteria = scheme_config["eligibility_criteria"]
        weights = scheme_config["scoring_weights"]
        
        # Check criteria
        criteria_results = self.check_criteria_match(profile, criteria)
        
        # Calculate score
        score = self.calculate_eligibility_score(criteria_results, weights)
        
        # Determine eligibility (threshold: 0.7)
        is_eligible = score >= 0.7
        confidence = min(score + 0.1, 1.0) if is_eligible else score
        
        # Identify missing requirements
        missing_requirements = self.identify_missing_requirements(criteria_results, criteria)
        
        # Identify matching criteria
        matching_criteria = [criterion for criterion, passed in criteria_results.items() if passed]
        
        # Generate recommendations
        recommendations = self._generate_recommendations(score, missing_requirements, scheme_id)
        
        return EligibilityResult(
            is_eligible=is_eligible,
            confidence=confidence,
            score=score,
            missing_requirements=missing_requirements,
            matching_criteria=matching_criteria,
            recommendations=recommendations
        )
    
    def _generate_recommendations(self, score: float, missing: List[str], scheme_id: str) -> List[str]:
        """Generate personalized recommendations"""
        recommendations = []
        
        if score >= 0.7:
            recommendations.append("You appear eligible for this scheme")
            recommendations.append("Proceed with application submission")
        elif score >= 0.5:
            recommendations.append("You may be eligible with additional documentation")
            recommendations.append("Consider applying with supporting evidence")
        else:
            recommendations.append("You may not be eligible for this scheme")
            recommendations.append("Consider other available schemes")
        
        # Specific recommendations based on missing requirements
        if any("income" in req.lower() for req in missing):
            recommendations.append("Verify income documentation")
        
        if any("land" in req.lower() for req in missing):
            recommendations.append("Prepare land ownership documents")
        
        if any("rural" in req.lower() for req in missing):
            recommendations.append("Provide rural residence proof")
        
        return recommendations

# Main model factory for easy access
class ModelFactory:
    """Factory class for accessing all AI/ML models"""
    
    def __init__(self):
        self.crop_detector = CropDiseaseDetector()
        self.fraud_detector = FraudDetector()
        self.language_detector = LanguageDetector()
        self.ocr_pipeline = OCRPipeline()
        self.eligibility_calculator = EligibilityCalculator()
    
    def get_crop_disease_detector(self) -> CropDiseaseDetector:
        return self.crop_detector
    
    def get_fraud_detector(self) -> FraudDetector:
        return self.fraud_detector
    
    def get_language_detector(self) -> LanguageDetector:
        return self.language_detector
    
    def get_ocr_pipeline(self) -> OCRPipeline:
        return self.ocr_pipeline
    
    def get_eligibility_calculator(self) -> EligibilityCalculator:
        return self.eligibility_calculator

# Example usage and testing
if __name__ == "__main__":
    # Initialize models
    factory = ModelFactory()
    
    # Test crop disease detection
    print("=== Crop Disease Detection Test ===")
    image_features = {
        "detected_symptoms": ["yellow_spots", "leaf_drying"],
        "dominant_colors": ["yellow", "brown"],
        "affected_area_percent": 0.4
    }
    disease_result = factory.crop_detector.detect_disease(b"mock_image_data", image_features)
    print(f"Disease: {disease_result.disease_name}, Confidence: {disease_result.confidence:.2f}")
    print(f"Severity: {disease_result.severity.value}")
    print(f"Recommendations: {disease_result.recommendations}")
    
    # Test fraud detection
    print("\n=== Fraud Detection Test ===")
    app_data = {
        "personal_info": "John Doe",
        "application_text": "Urgent application for multiple schemes submitted in short time",
        "income": 500000
    }
    fraud_result = factory.fraud_detector.detect_fraud(app_data)
    print(f"Risk Level: {fraud_result.risk_level.value}, Confidence: {fraud_result.confidence:.2f}")
    print(f"Risk Factors: {fraud_result.risk_factors}")
    
    # Test language detection
    print("\n=== Language Detection Test ===")
    hindi_text = "मुझे किसान योजना के लिए आवेदन करना है"
    lang_result = factory.language_detector.detect_language(hindi_text)
    print(f"Detected Language: {lang_result.detected_language.value}, Confidence: {lang_result.confidence:.2f}")
    
    # Test OCR
    print("\n=== OCR Pipeline Test ===")
    ocr_result = factory.ocr_pipeline.process_document(b"mock_document_image")
    print(f"Document Type: {ocr_result.document_type}")
    print(f"Extracted Fields: {ocr_result.processed_fields}")
    print(f"Confidence: {ocr_result.confidence:.2f}")
    
    # Test eligibility calculator
    print("\n=== Eligibility Calculator Test ===")
    profile = {
        "age": 35,
        "annual_income": 150000,
        "occupation": "farmer",
        "owns_land": True,
        "land_holding_acres": 2.5,
        "is_rural": True
    }
    eligibility_result = factory.eligibility_calculator.calculate_eligibility(profile, "pm_kisan")
    print(f"Eligible: {eligibility_result.is_eligible}, Score: {eligibility_result.score:.2f}")
    print(f"Missing Requirements: {eligibility_result.missing_requirements}")
    print(f"Recommendations: {eligibility_result.recommendations}")
