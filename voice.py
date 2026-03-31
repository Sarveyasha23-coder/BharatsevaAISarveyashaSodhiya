import whisper

model = whisper.load_model("base")


def speech_to_text(audio):
    result = model.transcribe(audio)
    return result["text"]
