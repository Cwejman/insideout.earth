import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

import { createMesh } from './boys.js';

document.addEventListener("DOMContentLoaded", () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(2, 2, 2);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(0, 0, 1);
  camera.add(directionalLight);
  scene.add(camera);
  scene.add(new THREE.AmbientLight(0x404040));

  const params = {
    u: 0,
    v: 0,
  };

  let loop1s = 0
  let mesh;
  (mesh = createMesh({ params, loop1s }));
  scene.add(mesh);

  const gui = new GUI();
  gui.add(params, 'u', 0, Math.PI, 0.01).name('U');
  gui.add(params, 'v', 0, Math.PI, Math.PI / 30).name('V');

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  function loop () {
    requestAnimationFrame(loop);
    scene.remove(mesh);
    (mesh = createMesh({ params, loop1s }));
    scene.add(mesh);
    loop1s = (Date.now() / 1000) % Math.PI;
    console.log(loop1s)
    controls.update();
    renderer.render(scene, camera);
  }

  loop();
})