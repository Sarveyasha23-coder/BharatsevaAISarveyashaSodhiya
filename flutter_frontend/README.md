# BharatSeva Flutter Frontend

This Flutter app is a companion frontend for the Python FastAPI backend in this repository.

## Run

1. Start the FastAPI server from the repo root.
2. Open this folder in Flutter.
3. Run:

```bash
flutter pub get
flutter run
```

## Backend Endpoint

The app calls:

`POST http://10.0.2.2:8000/voice-query`

For a physical device or web build, update `defaultBaseUrl` in `lib/main.dart`.
