from fastapi import FastAPI, File, UploadFile
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io
import json
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Paths
# -------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "models")

model_path = os.path.join(MODEL_DIR, "disease_model.h5")
class_path = os.path.join(MODEL_DIR, "class_names.json")

# -------------------------------
# Load model
# -------------------------------

model = tf.keras.models.load_model(model_path)

# -------------------------------
# Load class names
# -------------------------------

with open(class_path) as f:
    class_indices = json.load(f)

class_names = list(class_indices.keys())

IMG_SIZE = 224

# -------------------------------
# Image preprocessing
# -------------------------------

def preprocess(image):

    image = cv2.resize(image, (IMG_SIZE, IMG_SIZE))
    image = image / 255.0
    image = np.expand_dims(image, axis=0)

    return image


# -------------------------------
# API routes
# -------------------------------

@app.get("/")
def home():
    return {"message": "PhytoScan API running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    try:

        contents = await file.read()

        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = np.array(image)

        image = preprocess(image)

        prediction = model.predict(image, verbose=0)

        class_index = int(np.argmax(prediction))

        predicted_class = class_names[class_index]

        # cleaner label for UI
        predicted_class = predicted_class.replace("__", " ")

        confidence = float(np.max(prediction))

        return {
            "prediction": predicted_class,
            "confidence": confidence
        }

    except Exception as e:

        return {
            "error": str(e)
        }