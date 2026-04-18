import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

def train_model(data_path, model_path):
    df = pd.read_csv(data_path)

    df["label"] = df["label"].str.lower().str.strip()

    model = Pipeline([
        ("tfidf", TfidfVectorizer(
            analyzer="char_wb",
            ngram_range=(3,5)
        )),
        ("clf", LogisticRegression(max_iter=1000))
    ])
    
    model.fit(df["content"], df["label"])

    joblib.dump(model, model_path)
    print("Model trained & saved")


if __name__ == "__main__":
    train_model("../data/dataset.csv", "../models/code_text_classifier.pkl")