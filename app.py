from flask import Flask, request, jsonify, render_template
from inference_sdk import InferenceHTTPClient
import base64
import os

app = Flask(__name__)

# Load API key from environment or hardcode it temporarily (but NOT for production)
ROBOFLOW_API_KEY = "Co4G0VLFnqzAKJal6i0C"

client = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",  # or "https://detect.roboflow.com" depending on version
    api_key=ROBOFLOW_API_KEY
)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/learn')
def learn():
    return render_template('learn.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400

        image_data = data['image'].split(",")[1]
        image_bytes = base64.b64decode(image_data)

        # Save image temporarily
        temp_image_path = "temp.jpg"
        with open(temp_image_path, "wb") as f:
            f.write(image_bytes)

        # Perform inference
        result = client.infer(temp_image_path, model_id="american-sign-language-letters-gxpdm-ugxsf/9")

        # Clean up
        os.remove(temp_image_path)

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
