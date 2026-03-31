def fill_form(scheme):
    # Mock Aadhaar DB
    aadhaar_data = {
        "name": "Ramesh Kumar",
        "income": "2.5 LPA",
        "aadhaar": "XXXX-XXXX-1234",
        "age": 42
    }

    filled = {}
    for field in scheme.get("fields", []):
        filled[field] = aadhaar_data.get(field, "N/A")

    return filled
