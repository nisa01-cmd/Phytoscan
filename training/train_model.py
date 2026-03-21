import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import json, os
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report
import pandas as pd
import random

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(BASE_DIR, "..")

DATASET_PATH = os.path.join(PROJECT_ROOT, "dataset", "plantvillage")
MODEL_DIR = os.path.join(PROJECT_ROOT, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 25

train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    validation_split=0.2,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    zoom_range=0.3,
    horizontal_flip=True,
    brightness_range=[0.6, 1.4],
    shear_range=0.2
)

train_data = train_datagen.flow_from_directory(DATASET_PATH, target_size=IMG_SIZE,
    batch_size=BATCH_SIZE, class_mode='categorical', subset='training')

val_data = train_datagen.flow_from_directory(DATASET_PATH, target_size=IMG_SIZE,
    batch_size=BATCH_SIZE, class_mode='categorical', subset='validation')

class_names = list(train_data.class_indices.keys())

with open(os.path.join(MODEL_DIR, "class_names.json"), "w") as f:
    json.dump(train_data.class_indices, f)

# MODEL
base_model = tf.keras.applications.MobileNetV2(input_shape=(224,224,3),
    include_top=False, weights="imagenet")

base_model.trainable = False

x = base_model.output
x = layers.GlobalAveragePooling2D()(x)
x = layers.BatchNormalization()(x)
x = layers.Dense(256, activation="relu")(x)
x = layers.Dropout(0.5)(x)
outputs = layers.Dense(train_data.num_classes, activation="softmax")(x)

model = models.Model(inputs=base_model.input, outputs=outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(0.0001),
    loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
    metrics=["accuracy"]
)

checkpoint_path = os.path.join(MODEL_DIR, "disease_model.h5")

callbacks = [
    tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True),
    tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.3, patience=3),
    tf.keras.callbacks.ModelCheckpoint(checkpoint_path, monitor="val_accuracy", save_best_only=True)
]

history = model.fit(train_data, validation_data=val_data, epochs=EPOCHS, callbacks=callbacks)

# Fine tuning
for layer in base_model.layers[-40:]:
    layer.trainable = True
for layer in base_model.layers[:-40]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-5),
    loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
    metrics=["accuracy"]
)

history_fine = model.fit(train_data, validation_data=val_data, epochs=10, callbacks=callbacks)

model.save(checkpoint_path)

# ---------------- VISUALS ----------------

acc = history.history['accuracy'] + history_fine.history['accuracy']
val_acc = history.history['val_accuracy'] + history_fine.history['val_accuracy']
loss = history.history['loss'] + history_fine.history['loss']
val_loss = history.history['val_loss'] + history_fine.history['val_loss']

# Accuracy
plt.plot(acc); plt.plot(val_acc)
plt.title("Accuracy")
plt.legend(["Train","Val"])
plt.savefig(os.path.join(MODEL_DIR,"accuracy.png"))
plt.close()

# Loss
plt.plot(loss); plt.plot(val_loss)
plt.title("Loss")
plt.legend(["Train","Val"])
plt.savefig(os.path.join(MODEL_DIR,"loss.png"))
plt.close()

# Confusion Matrix
Y_pred = model.predict(val_data)
y_pred = np.argmax(Y_pred, axis=1)
y_true = val_data.classes

cm = confusion_matrix(y_true, y_pred)
sns.heatmap(cm)
plt.savefig(os.path.join(MODEL_DIR,"confusion_matrix.png"))
plt.close()

# Histogram
plt.hist(acc)
plt.savefig(os.path.join(MODEL_DIR,"histogram.png"))
plt.close()

# Correlation
df = pd.DataFrame({"acc":acc,"val_acc":val_acc,"loss":loss,"val_loss":val_loss})
sns.heatmap(df.corr(),annot=True)
plt.savefig(os.path.join(MODEL_DIR,"correlation_matrix.png"))
plt.close()

print("Training complete")