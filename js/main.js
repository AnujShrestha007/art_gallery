import * as THREE from "three";
import { PointerLockControls } from "three-stdlib";
import { setupAudio, startAudio, stopAudio } from "./audioGuide.js"; // Import the audio functions
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Create the scene
const scene = new THREE.Scene();

// Initialize the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1, // near point
  1000 // far point
);
camera.position.set(0, 5, 5); // Adjusted for a better view

// Adjusted light intensities
// const ambientLight = new THREE.AmbientLight(0x404040, 0.05); // Further reduced intensity
// scene.add(ambientLight);

// const sunLight = new THREE.DirectionalLight(0xdddddd, 0.05); // Further reduced intensity
// sunLight.position.set(10, 10, 10);
// scene.add(sunLight);

// Initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000); // Set the background color to black

// Create a cube
// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// const cubeMaterial = new THREE.MeshBasicMaterial({ color: "cyan" });
// const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
// scene.add(cubeMesh);

// Load textures
const textureLoader = new THREE.TextureLoader();

const wallTexture = textureLoader.load("../img/brick.png");
const floorTexture = textureLoader.load("../img/floor.jpg");
const ceilingTexture = textureLoader.load("../img/ceiling-texture2.jpg");

// Create the floor plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshBasicMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});
const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
floorPlane.rotation.x = -Math.PI / 2; // Rotate by 90 degrees
floorPlane.position.y = -10;
scene.add(floorPlane);

// Create a group to hold the walls
const wallGroup = new THREE.Group();
scene.add(wallGroup);

// Create walls with texture
const wallMaterial = new THREE.MeshBasicMaterial({
  map: wallTexture,
  side: THREE.DoubleSide,
});

// Front Wall
const frontWall = new THREE.Mesh(
  new THREE.BoxGeometry(100, 50, 0.1), // Adjusted thickness
  wallMaterial
);
frontWall.position.z = -50;
wallGroup.add(frontWall);

// Back Wall
const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(100, 50, 0.1), // Adjusted thickness
  wallMaterial
);
backWall.position.z = 50;
wallGroup.add(backWall);

// Left Wall
const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(100, 50, 0.1), // Adjusted thickness
  wallMaterial
);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -50;
wallGroup.add(leftWall);

// Right Wall
const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(100, 50, 0.1), // Adjusted thickness
  wallMaterial
);
rightWall.rotation.y = Math.PI / 2;
rightWall.position.x = 50;
wallGroup.add(rightWall);

// Create the ceiling
const ceilingGeometry = new THREE.PlaneGeometry(100, 100);
const ceilingMaterial = new THREE.MeshBasicMaterial({
  map: ceilingTexture,
  side: THREE.DoubleSide,
});
const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilingPlane.rotation.x = Math.PI / 2;
ceilingPlane.position.y = 25;
scene.add(ceilingPlane);

// // Load and add paintings with MeshBasicMaterial to avoid lighting effects
// async function loadPainting(imageURL, width, height, position) {
//   const texture = await textureLoader.loadAsync(imageURL);
//   const paintingMaterial = new THREE.MeshBasicMaterial({ map: texture });
//   const paintingGeometry = new THREE.PlaneGeometry(width, height);
//   const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
//   painting.position.copy(position);
//   return painting;
// }

// // const painting1 = new loadPainting( "../artworks/1.jpg",
// //   13.5,
// //   10.5,
// //   new THREE.Vector3(10, 5, -49.9)
// // )
// // painting1.rotateY = Math.PI/2
// // scene.add(painting1);

// Promise.all([
//   loadPainting(
//     "../artworks/1.jpg",
//     13.5,
//     10.5,
//     new THREE.Vector3(10, 5, -49.9)
//   ),
//   loadPainting("../artworks/2.png", 16, 10, new THREE.Vector3(-10, 5, -49.9)),
//   //Right wall
//   //loadPainting("../artwork/3.jpg",16,9, new THREE.Vector(49.99,5,-10) )
// ]).then(([painting1, painting2, painting3]) => {
//   scene.add(painting1);
//   scene.add(painting2);
//   //scene.add(painting3);
// });

//3d model

// Add Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Add Ambient Light
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// Add Spot Light with Color
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 10, 0);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.1;
spotLight.decay = 2;
spotLight.distance = 100;
scene.add(spotLight);

// Add Hemisphere Light with Color
const hemisphereLight = new THREE.HemisphereLight(0xeeeeff, 0x777777, 1);
scene.add(hemisphereLight);

// Add Point Lights with Different Colors
const redPointLight = new THREE.PointLight(0xff0000, 1, 100);
redPointLight.position.set(-15, 10, 15);
scene.add(redPointLight);

const greenPointLight = new THREE.PointLight(0x00ff00, 1, 100);
greenPointLight.position.set(15, 10, 15);
scene.add(greenPointLight);

const bluePointLight = new THREE.PointLight(0x0000ff, 1, 100);
bluePointLight.position.set(0, 10, -15);
scene.add(bluePointLight);

// // Create a loader
// const loader = new GLTFLoader();

// // Load a GLTF/GLB model
// loader.load(
//   '../artworks/statue.glb', // Path to your 3D model
//   (gltf) => {
//     // Add the loaded model to the scene
//     scene.add(gltf.scene);
//     // Optional: scale, position, or rotate the model
//     gltf.scene.scale.set(0.1,0.1,0.1); // Example scale
//     gltf.scene.position.set(-10, -10, 0); // Example position
//   },
//   undefined, // onProgress callback
//   (error) => {
//     console.error('An error happened:', error);
//   }
// );

// loader.load(
//   '../artworks/statue.glb', // Path to your 3D model
//   (gltf) => {
//     // Add the loaded model to the scene
//     scene.add(gltf.scene);
//     // Optional: scale, position, or rotate the model
//     gltf.scene.scale.set(0.1,0.1,0.1);
//     gltf.scene.rotateY = Math.PI/2;// Example scale
//     gltf.scene.position.set(10, -10, 0); // Example position
//   },
//   undefined, // onProgress callback
//   (error) => {
//     console.error('An error happened:', error);
//   }
// );

// Assuming you have stored your models in variables like these
let model1; // For the first model
let model2; // For the second model

// Load your models
const loader = new GLTFLoader();

loader.load(
  "../artworks/model.glb",
  (gltf) => {
    model1 = gltf.scene;
    scene.add(model1);
    model1.scale.set(1.5, 1.5, 1.5);
    model1.position.set(0, 10, 30);
    model1.rotation.y = -Math.PI;
  },
  undefined,
  (error) => {
    console.error("An error happened:", error);
  }
);

// loader.load(
//   '../artworks/statue.glb',
//   (gltf) => {
//     // let 3scale = 0.2;
//     model2 = gltf.scene;
//     scene.add(model2);
//     model2.scale.set(0.2,0.2,0.2);
//     model2.rotation.y = -Math.PI/2 ;
//     model2.position.set(20, -10, 0);
//   },
//   undefined,
//   (error) => {
//     console.error('An error happened:', error);
//   }
// );

function createPainting(imageURL, width, height, position) {
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load(imageURL);
  // Creating material that will reflect the light like a painting would
  const paintingMaterial = new THREE.MeshBasicMaterial({
    map: paintingTexture,
  }); // Default black material
  // Creating geometry - it's basically an object of material which takes on the shape of its container.
  const paintingGeometry = new THREE.PlaneGeometry(width, height); // PlaneGeometry is flat geometry
  // Attaching material and geometry together to create an actual object we can add to our scene.
  const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
  painting.position.set(position.x, position.y, position.z); // Set the position of that object relative to other objects in our scene.

  // Load the texture and update the material once loaded
  textureLoader.load(
    imageURL,
    function (texture) {
      paintingMaterial.map = texture;
      paintingMaterial.needsUpdate = true;
    },
    undefined,
    function (err) {
      console.error("An error occurred while loading the texture:", err);
    }
  );

  return painting;
}
let factor = 2;
let defactor = 2;
//Front wall
const painting1 = new createPainting(
  "../artworks/starrynight.jpg",
  13.5 * factor,
  10.5 * factor,
  new THREE.Vector3(17.5, 8, -49.9)
);
scene.add(painting1);

const painting2 = new createPainting(
  "../artworks/amane.png",
  13.5 * factor,
  10.5 * factor,
  new THREE.Vector3(-17.5, 8, -49.9)
);
scene.add(painting2);

const painting3 = new createPainting(
  "../artworks/aymoon.jpg",
  10 / factor,
  16 / factor,
  new THREE.Vector3(-40, 5, -49.9)
);
scene.add(painting3);

const painting4 = new createPainting(
  "../artworks/aybirds.jpg",
  10 / factor,
  16 / factor,
  new THREE.Vector3(40, 5, -49.9)
);
scene.add(painting4);

//Right Wall
// const painting5 = createPainting(
//   "../artworks/abocean.mkv",
//   16 * factor,
//   9 * factor,
//   new THREE.Vector3(49.9, 8, -30)
// );
// painting5.rotation.y = -Math.PI / 2;
// scene.add(painting5);

// Create the video element and texture
const video = document.createElement("video");
video.src = "../artworks/abocean.mkv";
video.load();
document.getElementById("play_video").addEventListener("click", () => {
  video.play();
});

// video.play();
video.loop = true;
video.muted = true; // Ensure the video has sound

const videoTexture = new THREE.VideoTexture(video);
const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
const videoGeometry = new THREE.PlaneGeometry(16 * 3, 9 * 3);
const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
videoMesh.position.set(49.9, 8, -25);
videoMesh.rotation.y = -Math.PI / 2; // Rotate to align with the wall
scene.add(videoMesh);

const painting5 = createPainting(
  "../artworks/colony.png",
  16 * 3,
  9 * 3,
  new THREE.Vector3(49.9, 8, 25)
);
painting5.rotation.y = -Math.PI / 2;
scene.add(painting5);

//left wall
const painting6 = createPainting(
  "../artworks/nepal.jpg",
  30 * 1.5,
  21 * 1.5,
  new THREE.Vector3(-49.9, 8, 24)
);
painting6.rotation.y = Math.PI / 2;
scene.add(painting6);

const painting7 = createPainting(
  "../artworks/lastsupper.jpg",
  30 * 1.5,
  21 * 1.5,
  new THREE.Vector3(-49.9, 8, -24)
);
painting7.rotation.y = Math.PI / 2;
scene.add(painting7);

//backwall
const painting8 = createPainting(
  "../artworks/pearlgirl.jpg",
  9 * factor,
  10 * factor,
  new THREE.Vector3(38, 10, 49.9)
);
painting8.rotation.y = Math.PI;
scene.add(painting8);

const painting9 = createPainting(
  "../artworks/monalisa.jpg",
  14.5,
  21.5,
  new THREE.Vector3(-38, 10, 49.9)
);
painting9.rotation.y = Math.PI;
scene.add(painting9);

// const painting1 = new createPainting(
//   "../artworks/starrynight.jpg",
//   13.5 * factor,
//   10.5 * factor,
//   new THREE.Vector3(17.5, 8, -49.9)
// );
// scene.add(painting1);

// const videoElement1 = document.getElementById("video1");
// const videoElement2 = document.getElementById("video2");

// const videoTexture1 = new THREE.VideoTexture(videoElement1);
// const videoTexture2 = new THREE.VideoTexture(videoElement2);

// const videoMaterial1 = new THREE.MeshBasicMaterial({ map: videoTexture1 });
// const videoMaterial2 = new THREE.MeshBasicMaterial({ map: videoTexture2 });

// // Example for a mesh using videoTexture1
// const videoMesh1 = new THREE.Mesh(
//   new THREE.PlaneGeometry(16, 9),
//   videoMaterial1
// );
// videoMesh1.position.set(-10, 8, -30);
// videoMesh.rotation.y = -Math.PI / 2;
// scene.add(videoMesh1);

// // Example for a mesh using videoTexture2
// const videoMesh2 = new THREE.Mesh(
//   new THREE.PlaneGeometry(9,16),
//   videoMaterial2
// );
// videoMesh2.position.set(-50, 8, -30);
// videoMesh.rotation.y = Math.PI / 2;
// scene.add(videoMesh2);

// videoElement1.play();
// videoElement2.play();

// const painting2 = createPainting

// Controls
const controls = new PointerLockControls(camera, document.body);

// Lock the pointer (control activated) and hide the menu when the experience starts
function startExperience() {
  controls.lock();
  hideMenu();
}

const playButton = document.getElementById("play_button");
playButton.addEventListener("click", startExperience);

// Hide Menu
function hideMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = "none";
}

// Show Menu
function showMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = "block";
}

// Collision detection
function checkCollision() {
  const playerBoundingBox = new THREE.Box3();
  const cameraWorldPosition = new THREE.Vector3();
  camera.getWorldPosition(cameraWorldPosition);

  // Adjust player bounding box size
  playerBoundingBox.setFromCenterAndSize(
    cameraWorldPosition,
    new THREE.Vector3(0.1, 0.1, 0.1) // Adjust size to fit your player
  );

  const floorBoundingBox = new THREE.Box3().setFromObject(floorPlane);
  const ceilingBoundingBox = new THREE.Box3().setFromObject(ceilingPlane);

  if (
    playerBoundingBox.intersectsBox(floorBoundingBox) ||
    playerBoundingBox.intersectsBox(ceilingBoundingBox)
  ) {
    return true;
  }

  for (const wall of wallGroup.children) {
    const wallBoundingBox = new THREE.Box3().setFromObject(wall);
    if (playerBoundingBox.intersectsBox(wallBoundingBox)) {
      return true;
    }
  }

  return false;
}

// Object to hold the keys pressed
const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
  u: false,
  h: false,
  r: false,
  e: false,
};

// Event Listener for when we press the keys
document.addEventListener(
  "keydown",
  (event) => {
    if (event.key in keysPressed) {
      keysPressed[event.key] = true;
    }
  },
  false
);

// Event Listener for when we release the keys
document.addEventListener(
  "keyup",
  (event) => {
    if (event.key in keysPressed) {
      keysPressed[event.key] = false;
    }
  },
  false
);

// Function to update the camera position
function updateCamera() {
  const previousPosition = camera.position.clone();
  let speed = 0.1;
  // Move the camera
  if (keysPressed.ArrowRight || keysPressed.d) {
    controls.moveRight(speed);
  }
  if (keysPressed.ArrowLeft || keysPressed.a) {
    controls.moveRight(-speed);
  }
  if (keysPressed.ArrowUp || keysPressed.w) {
    controls.moveForward(speed);
  }
  if (keysPressed.ArrowDown || keysPressed.s) {
    controls.moveForward(-speed);
  }

  if (keysPressed.u) {
    camera.translateY(speed);
  }
  if (keysPressed.h) {
    camera.translateY(-speed);
  }
  if (keysPressed.r) {
    // camera.rotateY(-0.01);
    camera.rotation.y -= 0.02;
  }
  if (keysPressed.e) {
    // camera.rotateY(0.01);
    camera.rotation.y += 0.02;
  }

  // Check for collisions after moving the camera
  if (checkCollision()) {
    camera.position.copy(previousPosition); // Revert to previous position if collision detected
  }
}

// const displayPaintingInfo = (info) =>{
//   const infoElement = document.getElementById('painting-info'); //get the reference

//   //set the html content inside info elemenr
//   infoElement.innerHTML =`
//   <h3>${info.title}</h3>
//   <p>Artist: ${info.artist}</p>
//   <p>Description: ${info.description}</p>
//   <p>Year : ${info.year}</p>
//   `;
//   infoElement.classList.add('show'); //Add Show class
// };
// const hidePaintingInfo = () => {
//   const infoElement = document.getElementById('painting-info'); // Get Reference
//   infoElement.classList.remove('show'); //Remove the 'show' class
// };

// Set up audio
setupAudio(camera);
// Add event listeners for audio controls
const startAudioButton = document.getElementById("start_audio");
const stopAudioButton = document.getElementById("stop_audio");

startAudioButton.addEventListener("click", startAudio);
stopAudioButton.addEventListener("click", stopAudio);

// setupAudio(camera);
// document.getElementById("start_audio").addEventListener("click", startAudio);
// document.getElementById("stop_audio").addEventListener("click", stopAudio);
// Render loop
//for audio
// let play = document.getElementById("play");
//       function playMusic(){
//         let audio = new Audio("tiersen.mp3");
//         audio.play();
//       }
//       play.addEventListener("click", playMusic);

// Render loop
function render() {
  //const delta = clock.getDelta();
  updateCamera();

  if (model1) {
    model1.rotation.y += 0.01; // Rotate around the Y axis
  }

  // if (model2) {
  //   model2.rotation.y += 0.00; // Rotate around the Y axis
  // }

  //   const distanceThreshold = 8;

  //   let paintingToShow;
  //  painting.forEach(painting) => {
  //     //loop through all paintings
  //     const distanceToPainting = camera.position.distanceTo(painting.position); //get distance to painting
  //     if(distanceToPainting < distanceThreshold){
  //       paintingToShow = painting; // set paintingToShow to this painting
  //     }
  //   };
  //   if(paintingToShow) {
  //     //if there is painting to show
  //     displayPaintingInfo(paintingToShow.userData.info); //display the painting info
  //   }
  //   else{
  //     hidePaintingInfo(); //otherwise hide the painting info
  //   }

  // cubeMesh.rotation.x += 0.01;
  // cubeMesh.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

// Start the rendering loop
render();
