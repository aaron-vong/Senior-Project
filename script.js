const URL = "model/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Load the model and metadata
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Setup webcam
  const flip = true; // flip webcam for mirror view
  webcam = new tmImage.Webcam(224, 224, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  prediction.sort((a, b) => b.probability - a.probability);
  const top = prediction[0];

  labelContainer.innerHTML = `${top.className} (${(top.probability * 100).toFixed(1)}%)`;
}
