def detect_fraud(text):
    keywords = ["otp", "upi", "bank", "urgent"]
    if any(keyword in text.lower() for keyword in keywords):
        return "Warning: Possible fraud call detected"
    return "safe"
