from tensorflow import keras
import tensorflow as tf

print("Loading model...")
model = keras.models.load_model("models/disease_model.h5")

print("Saving in TensorFlow SavedModel format...")

tf.saved_model.save(model, "models/model")   # 🔥 IMPORTANT FIX

print("Done ✅")