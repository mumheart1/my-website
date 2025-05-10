import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.21.0/dist/cannon-es.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Physics world
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
});

// Ground body
const groundBody = new CANNON.Body({
  shape: new CANNON.Plane(),
  type: CANNON.Body.STATIC
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Ground mesh
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);

// Player (cow)
const cowShape = new CANNON.Sphere(1);
const cowBody = new CANNON.Body({
  mass: 5,
  shape: cowShape,
  position: new CANNON.Vec3(0, 5, 0)
});
world.addBody(cowBody);

// Cow mesh
const cowGeometry = new THREE.SphereGeometry(1, 32, 32);
const cowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cowMesh = new THREE.Mesh(cowGeometry, cowMaterial);
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

window.addEventListener('keydown', (e) => {
  if (e.key in keys) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key in keys) keys[e.key] = false;
});

const moveSpeed = 10;
scene.add(cowMesh);

// Camera position
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  world.step(1 / 60);

  // Sync cow mesh with physics body
  cowMesh.position.copy(cowBody.position);
  cowMesh.quaternion.copy(cowBody.quaternion);

  renderer.render(scene, camera);
}function animate() {
  requestAnimationFrame(animate);

  // Movement force
  const force = new CANNON.Vec3(0, 0, 0);
  if (keys.w) force.z -= moveSpeed;
  if (keys.s) force.z += moveSpeed;
  if (keys.a) force.x -= moveSpeed;
  if (keys.d) force.x += moveSpeed;

  cowBody.velocity.x = force.x;
  cowBody.velocity.z = force.z;

  world.step(1 / 60);

  // Sync cow mesh
  cowMesh.position.copy(cowBody.position);
  cowMesh.quaternion.copy(cowBody.quaternion);

  // Camera follow
  camera.position.x = cowBody.position.x - 5;
  camera.position.y = cowBody.position.y + 5;
  camera.position.z = cowBody.position.z + 10;
  camera.lookAt(cowBody.position);

  renderer.render(scene, camera);
}
