// Wait for the HTML content to load
document.addEventListener('DOMContentLoaded', async () => {
    const videoElement = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const displaySize = { width: videoElement.width, height: videoElement.height };
    const faceapi = window.faceapi;

    // Load models (you may need to change the model paths)
    await faceapi.nets.tinyFaceDetector.load('/models');
    await faceapi.nets.faceLandmark68Net.load('/models');
    await faceapi.nets.faceRecognitionNet.load('/models');

    // Start the webcam feed
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    videoElement.srcObject = stream;

    // Detect faces and draw bounding boxes
    videoElement.addEventListener('play', () => {
        const canvasDisplaySize = faceapi.matchDimensions(canvas, displaySize);
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
            const resizedDetections = faceapi.resizeResults(detections, canvasDisplaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
        }, 100);
    });
});
