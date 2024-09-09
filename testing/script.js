let model, webcam, labelContainer, maxPredictions;

// Function to load the model from the provided URL
async function loadModel() {
    const modelURL = document.getElementById('model-url').value + 'model.json';
    const metadataURL = document.getElementById('model-url').value + 'metadata.json';

    try {
        console.log('Loading model from:', modelURL);
        console.log('Loading metadata from:', metadataURL);

        // Load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        console.log('Model loaded successfully');

        // Setup webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(640, 480, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // Clear previous elements
        const webcamContainer = document.getElementById('webcam-container');
        webcamContainer.innerHTML = '';
        webcamContainer.appendChild(webcam.canvas);

        labelContainer = document.getElementById('label-container');
        labelContainer.innerHTML = ''; // Clear previous labels
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement('div'));
        }
    } catch (error) {
        console.error('Error loading model:', error);
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// Run the webcam image through the image model
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
