from fastapi import FastAPI, File, UploadFile 
from fastapi.staticfiles import StaticFiles
# import tensorflow as tf
import numpy as np
# import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import io, json, os
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import time
import cv2
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "disease_model.h5"
)
app = FastAPI()

# -------------------------------
# CORS
# -------------------------------
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
print("MODEL PATH:", os.path.join(MODEL_DIR, "disease_model.h5"))
print("EXISTS:", os.path.exists(os.path.join(MODEL_DIR, "disease_model.h5")))

app.mount("/models", StaticFiles(directory=MODEL_DIR), name="models")

# -------------------------------
# Load Model
# -------------------------------
# from keras.models import load_model  

# model = load_model(
#     os.path.join(MODEL_DIR, "disease_model.h5"),
#     compile=False
# )
# model = tf.keras.models.load_model(
#     MODEL_PATH,
#     compile=False
# )

# # 🔥 FIX for incompatible layers
# model = tf.keras.models.Sequential(model.layers)
model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False,
    custom_objects=None
)

with open(os.path.join(MODEL_DIR, "class_names.json")) as f:
    class_indices = json.load(f)

# 🔥 Reverse mapping (fix)
class_names = {v: k for k, v in class_indices.items()}

# class_names = list(class_indices.keys())

# -------------------------------
# Preprocessing
# -------------------------------
def preprocess(image):
    image = cv2.resize(image, (224,224))
    image = preprocess_input(image)
    image = np.expand_dims(image, axis=0)
    return image

# -------------------------------
# Grad-CAM Function
# -------------------------------
def get_gradcam_heatmap(img_array, model, last_conv_layer_name="Conv_1"):

    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        class_idx = tf.argmax(predictions[0])
        loss = predictions[:, class_idx]

    grads = tape.gradient(loss, conv_outputs)

    pooled_grads = tf.reduce_mean(grads, axis=(0,1,2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0) / (tf.reduce_max(heatmap) + 1e-8)

    return heatmap.numpy()

# -------------------------------
# Predict API
# -------------------------------
# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):

#     try:
#         contents = await file.read()

#         # Original image (for Grad-CAM)
#         original_image = Image.open(io.BytesIO(contents)).convert("RGB")
#         original_np = np.array(original_image)

#         # Preprocess
#         image = preprocess(original_np)

#         # Prediction
#         # pred = model.predict(image)[0]
#         # import numpy as np
#         # pred = np.array([0.9, 0.1, 0.0])
#         # # -------------------------------
#         # # Top-3 Predictions
#         # # -------------------------------
#         # top_indices = pred.argsort()[-3:][::-1]

#         # top_predictions = []
#         # for i in top_indices:
#         #     top_predictions.append({
#         #         "class": class_names[i].replace("_", " "),
#         #         "confidence": float(pred[i])
#         #     })
#         # Fake prediction
#         pred = np.array([0.9, 0.1, 0.0])
#         class_names = ["Healthy", "Disease1", "Disease2"]

#      top_indices = pred.argsort()[-3:][::-1]

#      top_predictions = []
#      for i in top_indices:
#     top_predictions.append({
#         "class": class_names.get(i, "Unknown").replace("_", " "),
#         "confidence": float(pred[i])
#         # -------------------------------
#         # Grad-CAM
#         # -------------------------------
#         # heatmap = get_gradcam_heatmap(image, model)

#         # heatmap = cv2.resize(heatmap, (224,224))
#         # heatmap = np.uint8(255 * heatmap)
#         # heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

#         # original_resized = cv2.resize(original_np, (224,224))
#         # superimposed = heatmap * 0.4 + original_resized

#         # gradcam_path = os.path.join(MODEL_DIR, "gradcam.jpg")
#         # cv2.imwrite(gradcam_path, superimposed)

#         # -------------------------------
#         # Final Output
#         # -------------------------------
#         # return {
#         #     "prediction": top_predictions[0]["class"],
#         #     "confidence": top_predictions[0]["confidence"],
#         #     "top_predictions": top_predictions,
#         #     "gradcam_url": f"http://127.0.0.1:8000/models/gradcam.jpg?t={int(time.time())}"
#         # }
#         return {
#     "prediction": top_predictions[0]["class"],
#     "confidence": top_predictions[0]["confidence"],
#     "top_predictions": top_predictions,
#     "gradcam_url": None
# }
#     except Exception as e:
#         return {"error": str(e)}
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try: 

        contents = await file.read()

        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image = np.array(image)

        image = preprocess(image)

        pred = model.predict(image)[0]

        top_indices = pred.argsort()[-3:][::-1]

        top_predictions = []
        for i in top_indices:
            top_predictions.append({
                "class": class_names.get(i, "Unknown").replace("_", " "),
                "confidence": float(pred[i])
            })

        return {
            "prediction": top_predictions[0]["class"],
            "confidence": top_predictions[0]["confidence"],
            "top_predictions": top_predictions
        }

    except Exception as e:
        return {"error": str(e)}