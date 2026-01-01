import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report

def train_model():
    # Load dataset
    df = pd.read_csv('stress_data.csv')
    
    # Check for null values (though our generator makes none)
    if df.isnull().sum().any():
        df.dropna(inplace=True)

    X = df.drop('stress_level', axis=1)
    y = df['stress_level']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Feature Scaling
    # It's good practice, though RF is robust to scaling.
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Initialize and Train Model
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = clf.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc:.4f}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    
    # Save Model and Scaler
    with open('model.pkl', 'wb') as f:
        pickle.dump(clf, f)
        
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
        
    print("Model and Scaler saved successfully.")

if __name__ == "__main__":
    train_model()
