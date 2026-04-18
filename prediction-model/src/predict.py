import joblib

MODEL_PATH = "../models/code_text_classifier.pkl"

model = joblib.load(MODEL_PATH)

def predict_snippet(text):
    prediction = model.predict([text])[0]
    confidence = max(model.predict_proba([text])[0])

    return {
        "prediction": prediction,
        "confidence": round(confidence, 3)
    }