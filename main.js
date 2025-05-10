// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Fence bounds
const BOUND = 40;

// Cow player
const cow = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 2),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
cow.position.y = 0.5;
scene.add(cow);

// Controls
let speed = 0.1;
let turnSpeed = 0.05;
let keys = {};

document.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

// Game loop
function animate() {
  requestAnimationFrame(animate);

  // Movement
  if (keys['w']) cow.position.z -= Math.cos(cow.rotation.y) * speed;
  if (keys['s']) cow.position.z += Math.cos(cow.rotation.y) * speed;
  if (keys['a']) cow.rotation.y += turnSpeed;
  if (keys['d']) cow.rotation.y -= turnSpeed;

  // Camera follow
  camera.position.x = cow.position.x - Math.sin(cow.rotation.y) * 5;
  camera.position.y = 3;
  camera.position.z = cow.position.z + Math.cos(cow.rotation.y) * 5;
  camera.lookAt(cow.position);

  // Death condition (outside bounds)
  if (Math.abs(cow.position.x) > BOUND || Math.abs(cow.position.z) > BOUND) {
    alert("You hit the fence and died!");
    cow.position.set(0, 0.5, 0);
    cow.rotation.set(0, 0, 0);
  }

  renderer.render(scene, camera);
}

animate();
