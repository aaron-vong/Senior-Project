from flask import Flask, jsonify
import cv2
import numpy as np
import tensorflow as tf

# Load model and labels
model = tf.keras.models.load_model("keras_model.h5")
with open("labels.txt", "r") as f:
    labels = [line.strip() for line in f.readlines()]

app = Flask(__name__)
cap = cv2.VideoCapture(0)  # make sure webcam index is 0

@app.route("/predict", methods=["GET"])
def predict():
    ret, frame = cap.read()
    if not ret:
        return jsonify({'error': 'Could not access webcam'})

    # Resize and normalize image for Teachable Machine model
    img = cv2.resize(frame, (224, 224))
    img = np.asarray(img, dtype=np.float32).reshape(1, 224, 224, 3)
    img = (img / 127.5) - 1

    prediction = model.predict(img)
    index = np.argmax(prediction)
    class_name = labels[index]
    confidence = float(prediction[0][index])

    return jsonify({
        'letter': class_name,
        'confidence': round(confidence, 2)
    })

if __name__ == "__main__":
    app.run(debug=True)
