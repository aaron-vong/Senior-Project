from flask import Flask, request, jsonify, render_template
from inference_sdk import InferenceHTTPClient
import base64
import os

app = Flask(__name__, static_url_path='', static_folder='.', template_folder='.')

client = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="Co4G0VLFnqzAKJal6i0C"
)

@app.route('/')
def home():
    return render_template('learn.html')  # Launch from here

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    image_data = data['image'].split(",")[1]
    image_bytes = base64.b64decode(image_data)

    with open("temp.jpg", "wb") as f:
        f.write(image_bytes)

    result = client.infer("temp.jpg", model_id="american-sign-language-letters-gxpdm/4")
    os.remove("temp.jpg")

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
