import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.domElement.style.width  = '100%';   // make the canvas fill the div
renderer.domElement.style.height = '100%';
container.appendChild(renderer.domElement);

/* 2 · Basic lighting */
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 2);
scene.add(dirLight);

/* 3 · Load the fish */
const loader = new GLTFLoader();
loader.load(
  '/05_assets/BarramundiFish.glb',   // ← absolute URL inside /public
  (gltf) => {
    scene.add(gltf.scene);
  },
  undefined,                               // skip onProgress for brevity
  (err) => console.error('GLB load error:', err)
);

/* 4 · Render loop */
function animate() {
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
