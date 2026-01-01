from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import os
import warnings

# Suppress sklearn version warnings
warnings.filterwarnings("ignore", category=UserWarning)

app = Flask(__name__)

# Load Model and Scaler
model = None
scaler = None

def load_model():
    global model, scaler
    try:
        with open('model.pkl', 'rb') as f:
            model = pickle.load(f)
        with open('scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
        print("Model and Scaler loaded.")
    except Exception as e:
        print(f"Error loading model: {e}")

load_model()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze')
def analyze():
    return render_template('analyze.html')

@app.route('/predict', methods=['POST'])
def predict():
    if not model or not scaler:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.json
        
        # Extract features in correct order
        features = [
            float(data.get('snoring_range')),
            float(data.get('respiration_rate')),
            float(data.get('body_temperature')),
            float(data.get('limb_movement')),
            float(data.get('blood_oxygen')),
            float(data.get('eye_movement')),
            float(data.get('sleeping_hours')),
            float(data.get('heart_rate'))
        ]
        
        # Reshape and Scale
        final_features = scaler.transform([features])
        
        # Predict
        prediction = model.predict(final_features)[0]
        
        # Map prediction to label
        labels = {
            0: "Low / Normal",
            1: "Medium Low",
            2: "Medium",
            3: "Medium High",
            4: "High Stress"
        }
        
        result = labels.get(prediction, "Unknown")
        
        return jsonify({'prediction': result, 'stress_level': int(prediction)})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)
