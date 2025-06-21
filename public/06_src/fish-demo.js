import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3, Vector3 } from 'three';

/* 0 · Grab the div you already have in projects/index.html */
const container = document.getElementById('fish-container'); 

/* 1 · Scene setup */
const scene    = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,              //  ← use div’s aspect
  0.1,
  100
);
camera.position.set(0, 0, 3);
let fish;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.domElement.style.width  = '100%';   // make the canvas fill the div
renderer.domElement.style.height = '100%';
container.appendChild(renderer.domElement);

/* 2 · Basic lighting */
scene.add(new THREE.AmbientLight(0xffffff, 0.25)); // subtle base light

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);  // Key light (main)
keyLight.position.set(5, 6, 5);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.6); // Fill light (softer, opposite side)
fillLight.position.set(-6, 2, 4);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.8); // Rim / back light (adds a nice edge highlight)
rimLight.position.set(0, 5, -5);
scene.add(rimLight);

/* 2½ · Ocean backdrop */
scene.background = new THREE.Color(0x0e3b6f);       // rich blue-green
renderer.toneMapping = THREE.ACESFilmicToneMapping; // nicer color roll-off
renderer.outputEncoding = THREE.sRGBEncoding;       // correct gamma

/* 2.1 · Fit camera to object */
function fitCameraToObject(cam, obj, offset = 1.25) {
  const box   = new Box3().setFromObject(obj);
  const size  = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim   = Math.max(size.x, size.y, size.z);
  const fov      = cam.fov * (Math.PI / 180);   // in radians
  const distance = (maxDim / 2) / Math.tan(fov / 2);

  cam.position.copy(center);
  cam.position.z += distance * offset;          // pull back a bit
  cam.near = distance / 100;
  cam.far  = distance * 100;
  cam.updateProjectionMatrix();

  cam.lookAt(center);
}

/* 3 · Load the fish */
const loader = new GLTFLoader();
loader.load(
  '/05_assets/BarramundiFish.glb',   // ← absolute URL inside /public
  (gltf) => {
    fish = gltf.scene;
    scene.add(fish);

    fish.rotation.y = Math.PI;  // face the camera

    fitCameraToObject(camera, fish);
  },
  undefined,                               // skip onProgress for brevity
  (err) => console.error('GLB load error:', err)
);

/* 4 · Render loop */
function animate() {
    if (fish) {
    // 0.01 rad ≈ 0.57 deg per frame at 60 fps → ~34 rpm
    fish.rotation.y += 0.01;          // or fish.rotateY(0.01);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

/* 5 · Resize handler (optional but nice) */
window.addEventListener('resize', () => {
  const { clientWidth: w, clientHeight: h } = container;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});
