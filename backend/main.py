# main.py
import sys
import json
import joblib

model = joblib.load("code_text_classifier.pkl")

def predict(text):
    probs = model.predict_proba([text])[0]
    pred = model.predict([text])[0]

    return {
        "prediction": pred,
        "confidence": float(max(probs))
    }

while True:
    line = sys.stdin.readline()
    if not line:
        break

    text = line.strip()
    result = predict(text)

    print(json.dumps(result))
    sys.stdout.flush()