import requests

DATA_GOV_API_KEY = '579b464db66ec23bdd00000179977fd7d3b74f0561bf8481f75e62ad'
DATA_GOV_API_URL = f'https://data.gov.in/resource/c967fe8f-69c4-42df-8afc-8a2c98057437?api-key={DATA_GOV_API_KEY}&format=json'

SCHEMES = {
    "pm awas": {
        "name": "PM Awas Yojana",
        "fields": ["name", "income", "aadhaar"]
    },
    "ayushman": {
        "name": "Ayushman Bharat",
        "fields": ["name", "age", "health_status"]
    }
}

def fetch_agriculture_data():
    try:
        response = requests.get(DATA_GOV_API_URL)
        if response.status_code == 200:
            data = response.json()
            return data.get('data', data)
        else:
            print(f"API request failed with status code: {response.status_code}")
            return []
    except Exception as e:
        print(f"Error fetching data: {e}")
        return []

def match_scheme(intent):
    for key in SCHEMES:
        if key in intent.lower():
            return SCHEMES[key]
    return {"name": "Unknown Scheme"}
