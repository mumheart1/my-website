// Setup scene, camera, renderer const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); const renderer = new THREE.WebGLRenderer(); renderer.setSize(window.innerWidth, window.innerHeight); document.body.appendChild(renderer.domElement);

// Lighting const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(10, 10, 10); scene.add(light);

const ambient = new THREE.AmbientLight(0x404040); scene.add(ambient);

// Ground const ground = new THREE.Mesh( new THREE.PlaneGeometry(100, 100), new THREE.MeshLambertMaterial({ color: 0x77dd77 }) ); ground.rotation.x = -Math.PI / 2; scene.add(ground);

// Fence boundaries (invisible walls with death trigger) const bounds = 50;

// Cow Geometry const cowGeometry = new THREE.BoxGeometry(1, 1, 2);

// Player Cow const playerMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaee }); const playerCow = new THREE.Mesh(cowGeometry, playerMaterial); playerCow.position.y = 0.5; playerCow.rotation.order = "YXZ"; scene.add(playerCow);

let isDead = false;

// Camera behind cow camera.position.set(0, 2, -5); camera.lookAt(playerCow.position);

// Controls const keys = {}; document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true); document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function updateMovement() { if (isDead) return; let rotSpeed = 0.05; let moveSpeed = 0.1;

if (keys["a"]) playerCow.rotation.y += rotSpeed; if (keys["d"]) playerCow.rotation.y -= rotSpeed;

let dir = new THREE.Vector3(Math.sin(playerCow.rotation.y), 0, Math.cos(playerCow.rotation.y));

if (keys["w"]) playerCow.position.addScaledVector(dir, moveSpeed); if (keys["s"]) playerCow.position.addScaledVector(dir, -moveSpeed);

// Death if leaving bounds if (Math.abs(playerCow.position.x) > bounds || Math.abs(playerCow.position.z) > bounds) { die("You ran into the fence and exploded"); }

camera.position.copy(playerCow.position.clone().add(new THREE.Vector3(-dir.x * 5, 2, -dir.z * 5))); camera.lookAt(playerCow.position); }

function die(reason) { isDead = true; alert(reason); }

// AI Cows const aiCows = []; const aiCount = 5;

for (let i = 0; i < aiCount; i++) { const ai = new THREE.Mesh(cowGeometry, new THREE.MeshLambertMaterial({ color: 0xff9999 })); ai.position.set(Math.random() * 40 - 20, 0.5, Math.random() * 40 - 20); ai.userData = { direction: new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize(), velocity: new THREE.Vector3() }; scene.add(ai); aiCows.push(ai); }

function updateAICows() { aiCows.forEach((cow, i) => { cow.position.addScaledVector(cow.userData.direction, 0.05); if (Math.abs(cow.position.x) > bounds || Math.abs(cow.position.z) > bounds) { cow.userData.direction.multiplyScalar(-1); }

if (Math.random() < 0.01) {
  cow.userData.direction = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
}

for (let j = 0; j < aiCows.length; j++) {
  if (i === j) continue;
  const other = aiCows[j];
  const dist = cow.position.distanceTo(other.position);
  if (dist < 1.5) {
    const knock = cow.position.clone().sub(other.position).normalize();
    cow.position.add(knock.multiplyScalar(0.1));
  }
}

const distToPlayer = cow.position.distanceTo(playerCow.position);
if (distToPlayer < 1.5 && !isDead) {
  die("You got headbutted by a psycho cow");
}

}); }

function animate() { requestAnimationFrame(animate); updateMovement(); updateAICows(); renderer.render(scene, camera); }

animate();

