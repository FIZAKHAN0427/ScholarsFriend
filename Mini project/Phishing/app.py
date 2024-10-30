# Importing required libraries
from flask import Flask, request, render_template
import numpy as np
import pickle
import warnings
from feature import FeatureExtraction

warnings.filterwarnings('ignore')

# Load the model
gbc = None  # Initialize as None to handle cases where the model may not load
try:
    with open("pickle/model.pkl", "rb") as file:
        gbc = pickle.load(file)
except FileNotFoundError:
    print("Model file not found. Please check the path to 'model.pkl'.")
except ValueError as e:
    print(f"Model loading error: {e}")

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        url = request.form.get("url", "")
        if url:
            try:
                obj = FeatureExtraction(url)
                x = np.array(obj.getFeaturesList()).reshape(1, -1)  # Ensure correct feature count in the model
                
                if gbc:  # Check if the model loaded successfully
                    y_pred = gbc.predict(x)[0]
                    y_pro_phishing = gbc.predict_proba(x)[0, 0]
                    y_pro_non_phishing = gbc.predict_proba(x)[0, 1]
                    
                    pred = f"It is {y_pro_phishing * 100:.2f}% safe to go"
                    return render_template('UrlDetection.js', xx=round(y_pro_non_phishing, 2), url=url)
                else:
                    return render_template("UrlDetection.js", xx=-1, error="Model could not be loaded.")
            except Exception as e:
                print(f"Prediction error: {e}")
                return render_template("UrlDetection.js", xx=-1, error="Error during prediction. Please check the URL and try again.")
        else:
            return render_template("UrlDetection.js", xx=-1, error="URL not provided")
    
    return render_template("UrlDetection.js", xx=-1)

if __name__ == "__main__":
    app.run(debug=True,  port=5001)
