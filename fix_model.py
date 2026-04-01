from tensorflow import keras

print("Loading model...")
model = keras.models.load_model("models/disease_model.h5")

print("Saving fixed model...")
model.save("models/disease_model_fixed.h5")

print("Done ✅")