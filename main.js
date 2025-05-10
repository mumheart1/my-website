// --- THREE.js scene setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0e0ff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Ground ---
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228833 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// --- Lighting ---
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// --- Cow placeholder (a box) ---
const cowGeometry = new THREE.BoxGeometry(1, 1, 2);
const cowMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const cow = new THREE.Mesh(cowGeometry, cowMaterial);
cow.position.y = 0.5;
scene.add(cow);

// --- Camera settings ---
camera.position.set(0, 2, -5);
camera.lookAt(cow.position);

// --- Movement controls ---
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

function updateMovement() {
  const speed = 0.1;
  if (keys['w']) cow.position.z -= speed;
  if (keys['s']) cow.position.z += speed;
  if (keys['a']) cow.position.x -= speed;
  if (keys['d']) cow.position.x += speed;

  // Update camera to follow cow
  const camOffset = new THREE.Vector3(0, 2, -5);
  const camTarget = cow.position.clone().add(camOffset);
  camera.position.lerp(camTarget, 0.1);
  camera.lookAt(cow.position);
}

// --- Game loop ---
function animate() {
  requestAnimationFrame(animate);
  updateMovement();
  renderer.render(scene, camera);
}

animate();
