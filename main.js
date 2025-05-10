// Setup scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshLambertMaterial({ color: 0x77dd77 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Cow Geometry
const cowGeometry = new THREE.BoxGeometry(1, 1, 2);

// Player Cow
const playerMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaee });
const playerCow = new THREE.Mesh(cowGeometry, playerMaterial);
playerCow.position.y = 0.5;
scene.add(playerCow);

// Camera behind cow
camera.position.set(0, 2, -5);
camera.lookAt(playerCow.position);

// Controls
const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function updateMovement() {
  let speed = 0.1;
  if (keys["w"]) playerCow.position.z -= speed;
  if (keys["s"]) playerCow.position.z += speed;
  if (keys["a"]) playerCow.position.x -= speed;
  if (keys["d"]) playerCow.position.x += speed;

  camera.position.x = playerCow.position.x;
  camera.position.z = playerCow.position.z - 5;
  camera.position.y = playerCow.position.y + 2;
  camera.lookAt(playerCow.position);
}

// AI Cows
const aiCows = [];
const aiCount = 5;

for (let i = 0; i < aiCount; i++) {
  const ai = new THREE.Mesh(cowGeometry, new THREE.MeshLambertMaterial({ color: 0xff9999 }));
  ai.position.set(Math.random() * 40 - 20, 0.5, Math.random() * 40 - 20);
  ai.userData = {
    direction: new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize(),
    velocity: new THREE.Vector3()
  };
  scene.add(ai);
  aiCows.push(ai);
}

function updateAICows() {
  aiCows.forEach((cow, i) => {
    // Move
    cow.position.addScaledVector(cow.userData.direction, 0.05);

    // Bounce on edge
    if (Math.abs(cow.position.x) > 50 || Math.abs(cow.position.z) > 50) {
      cow.userData.direction.multiplyScalar(-1);
    }

    // Random turn
    if (Math.random() < 0.01) {
      cow.userData.direction = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
    }

    // Check for other cows
    for (let j = 0; j < aiCows.length; j++) {
      if (i === j) continue;
      const other = aiCows[j];
      const dist = cow.position.distanceTo(other.position);
      if (dist < 1.5) {
        // Knockback each other
        const knock = cow.position.clone().sub(other.position).normalize();
        cow.position.add(knock.multiplyScalar(0.1));
      }
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  updateMovement();
  updateAICows();
  renderer.render(scene, camera);
}

animate();
