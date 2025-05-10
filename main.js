const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const BOUND = 40;

const cow = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 2),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);
cow.position.y = 0.5;
scene.add(cow);

const aiCows = [];
const aiCowMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

for (let i = 0; i < 5; i++) {
  const aiCow = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 2),
    aiCowMaterial
  );
  aiCow.position.set(Math.random() * BOUND * 2 - BOUND, 0.5, Math.random() * BOUND * 2 - BOUND);
  aiCows.push(aiCow);
  scene.add(aiCow);
}

const fences = [];
const fenceMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

for (let x = -BOUND; x <= BOUND; x += 2) {
  for (let z of [-BOUND, BOUND]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.2), fenceMaterial);
    post.position.set(x, 1, z);
    scene.add(post);
    fences.push(post);
  }
}
for (let z = -BOUND; z <= BOUND; z += 2) {
  for (let x of [-BOUND, BOUND]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 1), fenceMaterial);
    post.position.set(x, 1, z);
    scene.add(post);
    fences.push(post);
  }
}

let speed = 0.1;
let turnSpeed = 0.05;
let gravity = -0.02;
let velocityY = 0;
let keys = {};

document.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
}

function animate() {
  requestAnimationFrame(animate);

  if (keys['a']) cow.rotation.y += turnSpeed;
  if (keys['d']) cow.rotation.y -= turnSpeed;
  if (keys['w']) {
    cow.position.x -= Math.sin(cow.rotation.y) * speed;
    cow.position.z -= Math.cos(cow.rotation.y) * speed;
  }
  if (keys['s']) {
    cow.position.x += Math.sin(cow.rotation.y) * speed;
    cow.position.z += Math.cos(cow.rotation.y) * speed;
  }

  velocityY += gravity;
  cow.position.y += velocityY;
  if (cow.position.y <= 0.5) {
    cow.position.y = 0.5;
    velocityY = 0;
  }

  cow.rotation.z = keys['a'] ? 0.2 : keys['d'] ? -0.2 : 0;

  camera.position.x = cow.position.x - Math.sin(cow.rotation.y) * 5;
  camera.position.y = cow.position.y + 3;
  camera.position.z = cow.position.z + Math.cos(cow.rotation.y) * 5;
  camera.lookAt(cow.position);

  aiCows.forEach(aiCow => {
    const target = Math.random() < 0.5 ? cow : aiCows[Math.floor(Math.random() * aiCows.length)];
    const dirX = target.position.x - aiCow.position.x;
    const dirZ = target.position.z - aiCow.position.z;
    const angle = Math.atan2(dirZ, dirX);
    aiCow.rotation.y = angle;
    aiCow.position.x += Math.sin(angle) * speed;
    aiCow.position.z += Math.cos(angle) * speed;
  });

  for (let fence of fences) {
    const dx = cow.position.x - fence.position.x;
    const dy = cow.position.y - fence.position.y;
    const dz = cow.position.z - fence.position.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < 1.2) {
      alert("You hit the fence and died!");
      cow.position.set(0, 0.5, 0);
      cow.rotation.set(0, 0, 0);
      velocityY = 0;
    }
  }

  renderer.render(scene, camera);
}

animate();
