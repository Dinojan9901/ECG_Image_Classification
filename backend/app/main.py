from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import tensorflow as tf
import numpy as np
import io
import json
import os
from PIL import Image

app = FastAPI(
    title="ECG Arrhythmia Classification API",
    description="API for classifying ECG images into arrhythmia types",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, you may want to restrict this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and class indices
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../model/ecg_model_final_balanced.h5")
CLASS_INDICES_PATH = os.path.join(os.path.dirname(__file__), "../model/class_indices_balanced.json")

model = None
class_indices = None
class_descriptions = {
    'F': 'Fusion of ventricular and normal beat',
    'M': 'Myocardial infarction',
    'N': 'Normal beat',
    'Q': 'Unclassifiable beat',
    'S': 'Supraventricular premature beat',
    'V': 'Premature ventricular contraction'
}

@app.on_event("startup")
async def load_model():
    global model, class_indices
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        
        with open(CLASS_INDICES_PATH, "r") as f:
            class_indices = json.load(f)
        
        print("Model and class indices loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")

@app.get("/")
def read_root():
    return {"message": "ECG Arrhythmia Classification API"}

@app.get("/health")
def health_check():
    if model is None:
        return {"status": "error", "message": "Model not loaded"}
    return {"status": "healthy", "message": "Model loaded and ready"}

@app.get("/classes")
def get_classes():
    """Return the class names and descriptions"""
    return {
        "class_indices": class_indices,
        "class_descriptions": class_descriptions
    }

@app.post("/predict/")
async def predict_image(file: UploadFile = File(...)):
    """
    Predict ECG arrhythmia class from uploaded image
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to grayscale if not already
        if image.mode != "L":
            image = image.convert("L")
        
        # Resize and preprocess
        image = image.resize((128, 128))
        img_array = np.array(image) / 255.0
        img_array = img_array.reshape(1, 128, 128, 1)
        
        # Make prediction
        prediction = model.predict(img_array)
        class_idx = np.argmax(prediction, axis=1)[0]
        confidence = float(prediction[0][class_idx])
        
        # Map class index to class name
        idx_to_class = {v: k for k, v in class_indices.items()}
        predicted_class = idx_to_class[class_idx]
        
        # Get top 3 predictions
        top_indices = np.argsort(prediction[0])[-3:][::-1]
        top_predictions = [
            {
                "class": idx_to_class[idx],
                "description": class_descriptions[idx_to_class[idx]],
                "confidence": float(prediction[0][idx])
            }
            for idx in top_indices
        ]
        
        return {
            "class": predicted_class,
            "description": class_descriptions[predicted_class],
            "confidence": confidence,
            "top_predictions": top_predictions
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

# Add route for batch prediction if needed
@app.post("/predict-batch/")
async def predict_batch(files: list[UploadFile] = File(...)):
    """
    Predict ECG arrhythmia classes from multiple uploaded images
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    results = []
    
    for file in files:
        # Validate file type
        if not file.content_type.startswith("image/"):
            results.append({"filename": file.filename, "error": "File must be an image"})
            continue
        
        try:
            # Read image file
            image_data = await file.read()
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to grayscale if not already
            if image.mode != "L":
                image = image.convert("L")
            
            # Resize and preprocess
            image = image.resize((128, 128))
            img_array = np.array(image) / 255.0
            img_array = img_array.reshape(1, 128, 128, 1)
            
            # Make prediction
            prediction = model.predict(img_array)
            class_idx = np.argmax(prediction, axis=1)[0]
            confidence = float(prediction[0][class_idx])
            
            # Map class index to class name
            idx_to_class = {v: k for k, v in class_indices.items()}
            predicted_class = idx_to_class[class_idx]
            
            results.append({
                "filename": file.filename,
                "class": predicted_class,
                "description": class_descriptions[predicted_class],
                "confidence": confidence
            })
        
        except Exception as e:
            results.append({"filename": file.filename, "error": str(e)})
    
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)