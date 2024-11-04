const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const capturedImage = document.getElementById('capturedImage');
        let handposeModel;

        // Function to set up the video feed
        async function setupCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                return new Promise((resolve) => {
                    video.onloadedmetadata = () => {
                        video.play();
                        resolve();
                    };
                });
            } catch (error) {
                alert("Error accessing the camera: " + error.message);
            }
        }

        // Function to detect hands and draw on the canvas
        async function detectHands() {
            const predictions = await handposeModel.estimateHands(video);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (predictions.length > 0) {
                predictions.forEach(prediction => {
                    const landmarks = prediction.landmarks;

                    // Draw the palm outline (connecting relevant landmarks)
                    ctx.strokeStyle = 'blue';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(landmarks[0][0], landmarks[0][1]); // wrist
                    ctx.lineTo(landmarks[1][0], landmarks[1][1]); // index finger
                    ctx.lineTo(landmarks[2][0], landmarks[2][1]); // middle finger
                    ctx.lineTo(landmarks[3][0], landmarks[3][1]); // ring finger
                    ctx.lineTo(landmarks[4][0], landmarks[4][1]); // pinky finger
                    ctx.closePath();
                    ctx.stroke();

                    // Draw each landmark point
                    ctx.fillStyle = 'red';
                    landmarks.forEach(([x, y]) => {
                        ctx.beginPath();
                        ctx.arc(x, y, 5, 0, 2 * Math.PI);
                        ctx.fill();
                    });
                });
            }
            requestAnimationFrame(detectHands);
        }

        // Function to draw a random pattern based on hand landmarks
        function drawRandomPattern(landmarks) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 150, 255, 0.5)';
            ctx.strokeStyle = 'rgba(0, 150, 255, 1)';
            ctx.lineWidth = 2;

            // Draw the palm outline again
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.moveTo(landmarks[0][0], landmarks[0][1]);
            ctx.lineTo(landmarks[1][0], landmarks[1][1]);
            ctx.lineTo(landmarks[2][0], landmarks[2][1]);
            ctx.lineTo(landmarks[3][0], landmarks[3][1]);
            ctx.lineTo(landmarks[4][0], landmarks[4][1]);
            ctx.closePath();
            ctx.stroke();

            // Draw each landmark point
            landmarks.forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fill();
            });

            // Create random connections between points
            for (let i = 0; i < landmarks.length; i++) {
                for (let j = i + 1; j < landmarks.length; j++) {
                    if (Math.random() > 0.5) {
                        ctx.beginPath();
                        ctx.moveTo(landmarks[i][0], landmarks[i][1]);
                        ctx.lineTo(landmarks[j][0], landmarks[j][1]);
                        ctx.stroke();
                    }
                }
            }
        }

        // Main function to load the handpose model and initialize camera
        async function main() {
            try {
                handposeModel = await handpose.load();
                console.log('Handpose model loaded successfully.');
                await setupCamera();
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                detectHands();
            } catch (error) {
                console.error("Error in main function: ", error);
            }
        }

        // Capture button to draw a pattern when hand is detected and display captured image
        document.getElementById('captureButton').addEventListener('click', async () => {
            const predictions = await handposeModel.estimateHands(video);
            if (predictions.length > 0) {
                const landmarks = predictions[0].landmarks;
                drawRandomPattern(landmarks);

                const img = document.getElementById('capturedImage');
                const heading = document.getElementById('imagehead');
                const button = document.getElementById('confirmbutton');
                
                img.classList.add('show'); // Hide the image
                heading.classList.add('show'); // Hide the heading
                button.classList.add('show'); 
                // Capture the canvas image and display it below
                const imageData = canvas.toDataURL('image/png');
                capturedImage.src = imageData;
            } else {
                alert("No hand detected. Please try again.");
            }
        });

        function handleImageError() {
            const img = document.getElementById('capturedImage');
            const heading = document.getElementById('imagehead');
            const button = document.getElementById('confirmbutton');
            
            img.classList.add('hidden'); // Hide the image
            heading.classList.add('hidden'); // Hide the heading
            button.classList.add('hidden'); 
        }

        // Run the main function to start the app
        main();