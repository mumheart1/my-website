// Basic THREE.js + CANNON.js setup

// Scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Ground
const groundBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

const groundGeo = new THREE.PlaneGeometry(100, 100);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x00cc00 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);

// Cow (simple box)
const cowBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  position: new CANNON.Vec3(0, 5, 0)
});
world.addBody(cowBody);

const cowGeo = new THREE.BoxGeometry(2, 2, 2);
const cowMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const cowMesh = new THREE.Mesh(cowGeo, cowMat);
scene.add(cowMesh);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Camera starting position
camera.position.set(0, 5, -10);
camera.lookAt(cowMesh.position);

// Controls
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

function handleInput() {
  if (keys['w']) cowBody.velocity.z = -5;
  if (keys['s']) cowBody.velocity.z = 5;
  if (keys['a']) cowBody.velocity.x = -5;
  if (keys['d']) cowBody.velocity.x = 5;
}

// Animate
function animate() {
  requestAnimationFrame(animate);

  handleInput();
  world.step(1 / 60);

  // Update cow mesh
  cowMesh.position.copy(cowBody.position);
  cowMesh.quaternion.copy(cowBody.quaternion);

  // Camera follows cow
  camera.position.lerp(
    new THREE.Vector3(
      cowMesh.position.x,
      cowMesh.position.y + 5,
      cowMesh.position.z - 10
    ), 0.1
  );
  camera.lookAt(cowMesh.position);

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
