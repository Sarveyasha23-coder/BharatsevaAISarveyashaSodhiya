from llm import ask_llm
from schemes import match_scheme
from autofill import fill_form
from fraud import detect_fraud


def process_query(text, lang):
    fraud_status = detect_fraud(text)

    if fraud_status != "safe":
        return {
            "scheme": {"name": "Fraud Alert"},
            "form": {},
            "status": fraud_status
        }

    # Step 1: Understand intent
    intent = ask_llm(f"Extract scheme intent from: {text}")

    # Step 2: Match scheme
    scheme = match_scheme(intent)

    # Step 3: Autofill form
    form = fill_form(scheme)

    return {
        "scheme": scheme,
        "form": form,
        "status": "auto-filled"
    }
