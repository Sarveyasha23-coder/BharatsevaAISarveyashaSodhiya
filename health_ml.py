import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

# Create comprehensive disease dataset with realistic symptoms
def create_disease_dataset():
    np.random.seed(42)

    # Define diseases and their common symptoms
    diseases = [
        'Common Cold', 'Flu', 'COVID-19', 'Pneumonia', 'Bronchitis',
        'Asthma', 'Diabetes', 'Hypertension', 'Heart Disease', 'Migraine',
        'Allergies', 'Gastritis', 'Ulcer', 'Hepatitis', 'Kidney Stones',
        'Arthritis', 'Depression', 'Anxiety', 'Thyroid Disorder', 'Anemia'
    ]

    # Symptom features
    symptoms = [
        'fever', 'cough', 'headache', 'fatigue', 'nausea', 'vomiting',
        'diarrhea', 'chest_pain', 'shortness_breath', 'sore_throat',
        'runny_nose', 'body_ache', 'loss_appetite', 'dizziness',
        'sweating', 'chills', 'joint_pain', 'rash', 'itching',
        'abdominal_pain', 'back_pain', 'frequent_urination',
        'weight_loss', 'weight_gain', 'mood_swings', 'insomnia'
    ]

    # Create dataset with realistic symptom patterns
    data = []

    for _ in range(10000):  # Large dataset for better training
        disease = np.random.choice(diseases)

        # Base symptom probabilities for each disease
        symptom_data = {}

        if disease == 'Common Cold':
            symptom_data = {
                'fever': np.random.choice([0, 1], p=[0.7, 0.3]),
                'cough': np.random.choice([0, 1], p=[0.4, 0.6]),
                'headache': np.random.choice([0, 1], p=[0.6, 0.4]),
                'runny_nose': np.random.choice([0, 1], p=[0.2, 0.8]),
                'sore_throat': np.random.choice([0, 1], p=[0.3, 0.7]),
                'fatigue': np.random.choice([0, 1], p=[0.8, 0.2]),
            }

        elif disease == 'Flu':
            symptom_data = {
                'fever': np.random.choice([0, 1], p=[0.1, 0.9]),
                'cough': np.random.choice([0, 1], p=[0.3, 0.7]),
                'headache': np.random.choice([0, 1], p=[0.2, 0.8]),
                'body_ache': np.random.choice([0, 1], p=[0.1, 0.9]),
                'fatigue': np.random.choice([0, 1], p=[0.1, 0.9]),
                'chills': np.random.choice([0, 1], p=[0.2, 0.8]),
            }

        elif disease == 'COVID-19':
            symptom_data = {
                'fever': np.random.choice([0, 1], p=[0.2, 0.8]),
                'cough': np.random.choice([0, 1], p=[0.1, 0.9]),
                'fatigue': np.random.choice([0, 1], p=[0.1, 0.9]),
                'loss_appetite': np.random.choice([0, 1], p=[0.3, 0.7]),
                'shortness_breath': np.random.choice([0, 1], p=[0.4, 0.6]),
                'body_ache': np.random.choice([0, 1], p=[0.3, 0.7]),
            }

        elif disease == 'Pneumonia':
            symptom_data = {
                'fever': np.random.choice([0, 1], p=[0.1, 0.9]),
                'cough': np.random.choice([0, 1], p=[0.1, 0.9]),
                'chest_pain': np.random.choice([0, 1], p=[0.2, 0.8]),
                'shortness_breath': np.random.choice([0, 1], p=[0.1, 0.9]),
                'fatigue': np.random.choice([0, 1], p=[0.2, 0.8]),
                'chills': np.random.choice([0, 1], p=[0.3, 0.7]),
            }

        elif disease == 'Diabetes':
            symptom_data = {
                'frequent_urination': np.random.choice([0, 1], p=[0.1, 0.9]),
                'fatigue': np.random.choice([0, 1], p=[0.2, 0.8]),
                'weight_loss': np.random.choice([0, 1], p=[0.3, 0.7]),
                'increased_thirst': np.random.choice([0, 1], p=[0.1, 0.9]),
                'blurred_vision': np.random.choice([0, 1], p=[0.4, 0.6]),
            }

        elif disease == 'Hypertension':
            symptom_data = {
                'headache': np.random.choice([0, 1], p=[0.3, 0.7]),
                'dizziness': np.random.choice([0, 1], p=[0.4, 0.6]),
                'chest_pain': np.random.choice([0, 1], p=[0.5, 0.5]),
                'shortness_breath': np.random.choice([0, 1], p=[0.6, 0.4]),
                'fatigue': np.random.choice([0, 1], p=[0.4, 0.6]),
            }

        elif disease == 'Heart Disease':
            symptom_data = {
                'chest_pain': np.random.choice([0, 1], p=[0.1, 0.9]),
                'shortness_breath': np.random.choice([0, 1], p=[0.2, 0.8]),
                'fatigue': np.random.choice([0, 1], p=[0.2, 0.8]),
                'dizziness': np.random.choice([0, 1], p=[0.3, 0.7]),
                'sweating': np.random.choice([0, 1], p=[0.3, 0.7]),
            }

        elif disease == 'Migraine':
            symptom_data = {
                'headache': np.random.choice([0, 1], p=[0.1, 0.9]),
                'nausea': np.random.choice([0, 1], p=[0.2, 0.8]),
                'vomiting': np.random.choice([0, 1], p=[0.4, 0.6]),
                'sensitivity_light': np.random.choice([0, 1], p=[0.1, 0.9]),
                'fatigue': np.random.choice([0, 1], p=[0.3, 0.7]),
            }

        elif disease == 'Asthma':
            symptom_data = {
                'shortness_breath': np.random.choice([0, 1], p=[0.1, 0.9]),
                'cough': np.random.choice([0, 1], p=[0.2, 0.8]),
                'chest_tightness': np.random.choice([0, 1], p=[0.1, 0.9]),
                'wheezing': np.random.choice([0, 1], p=[0.2, 0.8]),
                'fatigue': np.random.choice([0, 1], p=[0.3, 0.7]),
            }

        elif disease == 'Depression':
            symptom_data = {
                'fatigue': np.random.choice([0, 1], p=[0.1, 0.9]),
                'loss_appetite': np.random.choice([0, 1], p=[0.2, 0.8]),
                'insomnia': np.random.choice([0, 1], p=[0.2, 0.8]),
                'mood_swings': np.random.choice([0, 1], p=[0.1, 0.9]),
                'concentration_difficulty': np.random.choice([0, 1], p=[0.2, 0.8]),
            }

        # Add some noise and fill missing symptoms
        for symptom in symptoms:
            if symptom not in symptom_data:
                symptom_data[symptom] = np.random.choice([0, 1], p=[0.85, 0.15])

        symptom_data['disease'] = disease
        data.append(symptom_data)

    df = pd.DataFrame(data)
    return df

# Train and save the model
def train_and_save_model():
    print("Creating comprehensive disease dataset...")
    df = create_disease_dataset()

    print(f"Dataset shape: {df.shape}")
    print("Sample data:")
    print(df.head())

    # Save dataset
    df.to_csv("disease_dataset.csv", index=False)
    print("Dataset saved as disease_dataset.csv")

    # Prepare features and target
    feature_columns = [col for col in df.columns if col != 'disease']
    X = df[feature_columns]
    y = df['disease']

    print(f"Features: {len(feature_columns)}")
    print(f"Target classes: {len(y.unique())}")

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples: {len(X_test)}")

    # Train model
    print("Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)

    # Evaluate model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"Model Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save model
    with open("disease_model.pkl", "wb") as f:
        pickle.dump(model, f)

    print("Model saved as disease_model.pkl")

    # Save feature names for API
    with open("feature_names.pkl", "wb") as f:
        pickle.dump(feature_columns, f)

    print("Feature names saved as feature_names.pkl")

    return model, feature_columns

if __name__ == "__main__":
    train_and_save_model()