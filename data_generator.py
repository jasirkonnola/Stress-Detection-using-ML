import pandas as pd
import numpy as np
import random

def generate_data(num_samples=1000):
    """
    Generates a synthetic dataset for stress detection.
    Features based on common physiological indicators.
    """
    np.random.seed(42)
    random.seed(42)

    # DataFrame columns
    columns = [
        'snoring_range', 
        'respiration_rate', 
        'body_temperature', 
        'limb_movement', 
        'blood_oxygen', 
        'eye_movement', 
        'sleeping_hours', 
        'heart_rate', 
        'stress_level'
    ]

    data = []

    for _ in range(num_samples):
        # Stress level 0 (Low/Normal) to 4 (High)
        # We'll simulate correlations: Higher stress -> higher HR, temp, movement; lower sleep, oxygen.
        
        stress_level = random.randint(0, 4)
        
        if stress_level == 0:
            sr = random.randint(45, 60) # Snoring
            rr = random.randint(16, 20) # Respiration
            bt = round(random.uniform(96.0, 98.0), 1) # Temp
            lm = random.randint(4, 8)   # Limb Move
            bo = random.randint(95, 98) # Blood Oxygen
            em = random.randint(60, 80) # Eye Move
            sh = random.randint(7, 9)   # Sleep Hours
            hr = random.randint(50, 70) # Heart Rate
            
        elif stress_level == 1:
            sr = random.randint(60, 70)
            rr = random.randint(20, 22)
            bt = round(random.uniform(98.0, 99.0), 1)
            lm = random.randint(8, 12)
            bo = random.randint(92, 95)
            em = random.randint(80, 90)
            sh = random.randint(6, 7)
            hr = random.randint(70, 80)
            
        elif stress_level == 2:
            sr = random.randint(70, 80)
            rr = random.randint(22, 24)
            bt = round(random.uniform(99.0, 100.0), 1)
            lm = random.randint(12, 16)
            bo = random.randint(90, 92)
            em = random.randint(90, 100)
            sh = random.randint(5, 6)
            hr = random.randint(80, 90)

        elif stress_level == 3:
            sr = random.randint(80, 90)
            rr = random.randint(24, 26)
            bt = round(random.uniform(100.0, 101.0), 1)
            lm = random.randint(16, 20)
            bo = random.randint(88, 90)
            em = random.randint(100, 110)
            sh = random.randint(3, 5)
            hr = random.randint(90, 100)
            
        elif stress_level == 4: # High Stress
            sr = random.randint(90, 100)
            rr = random.randint(26, 30)
            bt = round(random.uniform(101.0, 102.0), 1)
            lm = random.randint(20, 25)
            bo = random.randint(85, 88)
            em = random.randint(110, 120)
            sh = random.randint(0, 3)
            hr = random.randint(100, 120)

        data.append([sr, rr, bt, lm, bo, em, sh, hr, stress_level])

    df = pd.DataFrame(data, columns=columns)
    
    # Save to CSV
    output_file = 'stress_data.csv'
    df.to_csv(output_file, index=False)
    print(f"Dataset generated with {num_samples} samples and saved to {output_file}")
    print(df.head())
    return df

if __name__ == "__main__":
    generate_data()
