const video = document.createElement("video");
const canvas = document.createElement("canvas");
canvas.width = 224;
canvas.height = 224;
const context = canvas.getContext("2d");
let labelContainer;

async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.width = 224;
    video.height = 224;
    video.autoplay = true;

    document.getElementById("webcam-container")?.appendChild(video);
    labelContainer = document.getElementById("label-container");

    video.addEventListener("loadeddata", () => {
      window.requestAnimationFrame(loop);
    });
  } catch (error) {
    console.error("Error accessing webcam:", error);
    labelContainer.innerHTML = "Error accessing webcam";
  }
}

async function loop() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const imageData = canvas.toDataURL("image/jpeg");

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData }),
    });

    const result = await response.json();
    const predictions = result.predictions;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (predictions && predictions.length > 0) {
      predictions.forEach((pred) => {
        drawBoundingBox(pred);
        drawLabel(pred);
      });

      const topPrediction = predictions.sort((a, b) => b.confidence - a.confidence)[0];
      labelContainer.innerHTML = `${topPrediction.class} (${(topPrediction.confidence * 100).toFixed(1)}%)`;
    } else {
      labelContainer.innerHTML = "No hand detected";
    }
  } catch (error) {
    console.error("Prediction error:", error);
    labelContainer.innerHTML = "Prediction error";
  }
}

function drawBoundingBox(pred) {
  context.strokeStyle = "#00FF00";
  context.lineWidth = 2;
  context.strokeRect(
    pred.x - pred.width / 2,
    pred.y - pred.height / 2,
    pred.width,
    pred.height
  );
}

function drawLabel(pred) {
  context.fillStyle = "#00FF00";
  context.font = "16px Arial";
  context.fillText(
    `${pred.class} (${(pred.confidence * 100).toFixed(1)}%)`,
    pred.x - pred.width / 2,
    pred.y - pred.height / 2 - 5
  );
}

init();
