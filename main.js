import * as THREE from './libs/three.module.js';
import * as CANNON from './libs/cannon-es.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Physics world
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });

// Floor
const floorMat = new THREE.MeshBasicMaterial({ color: 0x228B22 });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), floorMat);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const floorBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(floorBody);

// Player cow
function createCow(color = 0xffffff) {
  const geometry = new THREE.BoxGeometry(1, 1, 2);
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 1));
  const body = new CANNON.Body({ mass: 1, shape });
  body.position.set(Math.random() * 10 - 5, 1, Math.random() * 10 - 5);
  world.addBody(body);

  return { mesh, body };
}

const player = createCow(0xffff00);
camera.position.set(0, 5, -8);
camera.lookAt(player.mesh.position);

// Bots
const bots = [];
for (let i = 0; i < 5; i++) {
  bots.push(createCow(Math.random() * 0xffffff));
}

// Movement
const keys = {};
window.addEventListener('keydown', e => (keys[e.key] = true));
window.addEventListener('keyup', e => (keys[e.key] = false));

function applyPlayerControl() {
  const force = 30;
  if (keys['w']) player.body.applyForce(new CANNON.Vec3(0, 0, -force), player.body.position);
  if (keys['s']) player.body.applyForce(new CANNON.Vec3(0, 0, force), player.body.position);
  if (keys['a']) player.body.applyForce(new CANNON.Vec3(-force, 0, 0), player.body.position);
  if (keys['d']) player.body.applyForce(new CANNON.Vec3(force, 0, 0), player.body.position);
}

function moveBots() {
  bots.forEach(bot => {
    const dir = new CANNON.Vec3(
      Math.random() * 2 - 1,
      0,
      Math.random() * 2 - 1
    ).unit().scale(20);
    bot.body.applyForce(dir, bot.body.position);
  });
}

// Game loop
function animate() {
  requestAnimationFrame(animate);
  world.step(1 / 60);

  applyPlayerControl();

  [player, ...bots].forEach(obj => {
    obj.mesh.position.copy(obj.body.position);
    obj.mesh.quaternion.copy(obj.body.quaternion);
  });

  camera.position.set(
    player.mesh.position.x,
    player.mesh.position.y + 5,
    player.mesh.position.z - 8
  );
  camera.lookAt(player.mesh.position);

  renderer.render(scene, camera);
}

animate();
moveBots();
setInterval(moveBots, 2000);
