const video1 = document.getElementsByClassName('input_video1')[0];
const out1 = document.getElementsByClassName('output1')[0];
const controlsElement1 = document.getElementsByClassName('control1')[0];
const canvasCtx1 = out1.getContext('2d');
const fpsControl = new FPS();

const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
  spinner.style.display = 'none';
};

function onResultsFace(results) {
  document.body.classList.add('loaded');
  fpsControl.tick();
  canvasCtx1.save();
  canvasCtx1.clearRect(0, 0, out1.width, out1.height);
  canvasCtx1.drawImage(
      results.image, 0, 0, out1.width, out1.height);
  if (results.detections.length > 0) {
    drawRectangle(
        canvasCtx1, results.detections[0].boundingBox,
        {color: 'blue', lineWidth: 4, fillColor: '#00000000'});
    drawLandmarks(canvasCtx1, results.detections[0].landmarks, {
      color: 'red',
      radius: 5,
    });
  }
  canvasCtx1.restore();
}

const faceDetection = new FaceDetection({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.0/${file}`;
}});
faceDetection.onResults(onResultsFace);

// var constraints = { 
//   audio: false, 
//   video: { 
//     width: {ideal: 540}, 
//     height: {ideal: 540},
//     facingMode: "user"
//   } 
// }; 


// var mediaStream = null;
// async function getMediaStream(constraints) {
//   try {
//     mediaStream =  await navigator.mediaDevices.getUserMedia(constraints).then(async (mediaStream) => {
//       // let video = video1;    
//       video1.srcObject = mediaStream;
//       video1.onloadedmetadata = (event) => {
//         video1.play();
//       };
//       // setInterval(() => {
//       //   faceDetection.send({image: video1});
//       // }, 1000); 

//     });
//   } catch (err)  {    
//     console.error(err.message);   
//   }
// };
// getMediaStream(constraints);

const camera = new Camera(video1, {
  onFrame: async () => {
    await faceDetection.send({image: video1});
  },
  width: 540,
  height: 540
});
camera.start();

new ControlPanel(controlsElement1, {
      selfieMode: true,
      minDetectionConfidence: 0.5,
    })
    .add([
      new StaticText({title: 'MediaPipe Face Detection'}),
      fpsControl,
      new Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
      new Slider({
        title: 'Min Detection Confidence',
        field: 'minDetectionConfidence',
        range: [0, 1],
        step: 0.01
      }),
      // new SourcePicker({
      //   onFrame:
      //       async (input) => {
      //         await faceDetection.send({image: video1});
      //       },
      // }),
    ])
    .on(options => {
      video1.classList.toggle('selfie', options.selfieMode);
      faceDetection.setOptions(options);
    });




// var mediaStream = null;

// // Prefer camera resolution nearest to 1280x720.
// var constraints = { 
//   audio: false, 
//   video: { 
//     width: {ideal: 540}, 
//     height: {ideal: 540},
//     facingMode: "user"
//   } 
// }; 

// async function getMediaStream(constraints) {
//   try {
//     mediaStream =  await navigator.mediaDevices.getUserMedia(constraints);
//     // let video = document.getElementById('cam');    
//     video1.srcObject = mediaStream;
//     video1.onloadedmetadata = (event) => {
//       video1.play();
//     };
//     // faceDetection.send({image: video1});
//   } catch (err)  {    
//     console.error(err.message);   
//   }
// };

// async function switchCamera(cameraMode) {  
//   try {
//     // stop the current video stream
//     if (mediaStream != null && mediaStream.active) {
//       var tracks = mediaStream.getVideoTracks();
//       tracks.forEach(track => {
//         track.stop();
//       })      
//     }
    
//     // set the video source to null
//     // document.getElementById('cam').srcObject = null;
//     video1.srcObject = null;
    
//     // change "facingMode"
//     constraints.video.facingMode = cameraMode;
    
//     // get new media stream
//     await getMediaStream(constraints);
//   } catch (err)  {    
//     console.error(err.message); 
//     alert(err.message);
//   }
// }

// function takePicture() {  
//   // let canvas = document.getElementById('canvas');
//   // let video = document.getElementById('cam');
//   // let photo = document.getElementById('photo');  
//   // let context = canvas.getContext('2d');
  
//   // const height = video1.videoHeight;
//   // const width = video1.videoWidth;
  
//   canvasCtx1.drawImage(video1, 0, 0, 540, 540);    
//   // var data = canvasCtx1.toDataURL('image/png');
//   // photo.setAttribute('src', data);
//   faceDetection.send({image: video1});
// }

// // function clearPhoto() {
// //   let canvas = document.getElementById('canvas');
// //   let photo = document.getElementById('photo');
// //   let context = canvas.getContext('2d');
  
// //   context.fillStyle = "#AAA";
// //   context.fillRect(0, 0, canvas.width, canvas.height);
// //   var data = canvas.toDataURL('image/png');
// //   photo.setAttribute('src', data);
// // }

// document.getElementById('switchFrontBtn').onclick = (event) => {
//   switchCamera("user");
// }

// // document.getElementById('switchBackBtn').onclick = (event) => {  
// //   switchCamera("environment");
// // }

// document.getElementById('snapBtn').onclick = (event) => {  
//   takePicture();
//   // faceDetection.send({image: video1});
//   // event.preventDefault();
// }

// // clearPhoto();