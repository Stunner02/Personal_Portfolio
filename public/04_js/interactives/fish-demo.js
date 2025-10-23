// /04_js/interactives/fish-demo.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3, Vector3 } from 'three';
import fishUrl from '/05_assets/BarramundiFish.glb?url';

export function mount(el, props = {}, ctx) {
  // 0) Use the mount target the hydrator passes in
  const container = el;

  // If your container has no height yet, give it a sane default so the canvas shows up.
  if (container.clientHeight === 0) {
    Object.assign(container.style, {
      aspectRatio: '16 / 9',
      width: 'min(96vw, 960px)',
      minHeight: '360px',
      margin: '1rem auto',
      display: 'block'
    });
  }

  // 1) Scene setup
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.width  = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  // 2) Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));

  const keyLight  = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(5, 6, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
  fillLight.position.set(-6, 2, 4);
  scene.add(fillLight);

  const rimLight  = new THREE.DirectionalLight(0xffffff, 0.8);
  rimLight.position.set(0, 5, -5);
  scene.add(rimLight);

  // Backdrop / tone mapping
  scene.background = new THREE.Color(0x0e3b6f);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;

  // 2.1) Fit camera util
  function fitCameraToObject(cam, obj, offset = 1.25) {
    const box    = new Box3().setFromObject(obj);
    const size   = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim   = Math.max(size.x, size.y, size.z);
    const fov      = cam.fov * (Math.PI / 180);
    const distance = (maxDim / 2) / Math.tan(fov / 2);

    cam.position.copy(center);
    cam.position.z += distance * offset;
    cam.near = Math.max(0.01, distance / 100);
    cam.far  = distance * 100;
    cam.updateProjectionMatrix();
    cam.lookAt(center);
  }

  // 3) Load the fish
  const loader = new GLTFLoader();
  const assetUrl = props.asset || '/05_assets/BarramundiFish.glb'; // fallback path
  let fish = null;

  loader.load(
    assetUrl,
    (gltf) => {
      fish = gltf.scene;
      fish.rotation.y = Math.PI; // face camera
      scene.add(fish);
      fitCameraToObject(camera, fish);
    },
    undefined,
    (err) => console.error('GLB load error:', err)
  );

  // 4) RAF
  let rafId = 0;
  function animate() {
    if (fish) fish.rotation.y += 0.01;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }
  animate();

  // 5) Resize handler
  function onResize() {
    const w = container.clientWidth || container.getBoundingClientRect().width || 640;
    const h = container.clientHeight || container.getBoundingClientRect().height || 360;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // Return a cleanup so the hydrator can unmount safely
  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    // Dispose scene
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose?.();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose?.());
          else obj.material.dispose?.();
        }
      }
    });
    renderer.dispose();
    if (renderer.domElement?.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };
}
