let model, webcam;
const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').concat(['del', 'nothing', 'space']); // adjust if needed

async function loadModel() {
  model = await tf.loadGraphModel('model/model.json');
  console.log("✅ Model loaded");
  setupWebcam();
}

async function setupWebcam() {
  const video = document.createElement('video');
  video.width = 200;
  video.height = 200;
  video.autoplay = true;

  const webcamContainer = document.getElementById("webcam-container");
  webcamContainer.innerHTML = '';
  webcamContainer.appendChild(video);

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  video.addEventListener('loadeddata', () => {
    setInterval(() => predict(video), 200);
  });
}

function preprocessImage(video) {
  return tf.tidy(() => {
    return tf.browser.fromPixels(video)
      .resizeNearestNeighbor([200, 200])
      .toFloat()
      .div(255.0)
      .expandDims(); // [1, 200, 200, 3]
  });
}

async function predict(video) {
  const input = preprocessImage(video);
  const output = model.predict(input);
  const classIndex = (await output.argMax(-1).data())[0];

  const labelContainer = document.getElementById("label-container");
  labelContainer.innerText = `Prediction: ${labels[classIndex]}`;
}

// Start everything
loadModel();
