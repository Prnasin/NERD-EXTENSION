from src.predict import predict_snippet

if __name__ == "__main__":
    while True:
        text = input("\nEnter text (or 'exit'): ")
        if text.lower() == "exit":
            break
        
        result = predict_snippet(text)
        print(result)