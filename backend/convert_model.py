import tensorflow as tf
from keras.models import load_model

# old load try
model = load_model("../models/disease_model.h5", compile=False)

# new format save
model = load_model("../models/disease_model.h5", compile=False)

print("MODEL CONVERTED SUCCESSFULLY")