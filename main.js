// main.js

// Setup basic scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the ground
const geometry = new THREE.PlaneGeometry(200, 200, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const ground = new THREE.Mesh(geometry, material);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Fence setup (we'll make it as a boundary for death)
const fenceMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
const fenceGeometry = new THREE.Geometry();
fenceGeometry.vertices.push(new THREE.Vector3(-100, 0, -100));
fenceGeometry.vertices.push(new THREE.Vector3(100, 0, -100));
fenceGeometry.vertices.push(new THREE.Vector3(100, 0, 100));
fenceGeometry.vertices.push(new THREE.Vector3(-100, 0, 100));
fenceGeometry.vertices.push(new THREE.Vector3(-100, 0, -100));
const fence = new THREE.LineLoop(fenceGeometry, fenceMaterial);
scene.add(fence);

// Camera position
camera.position.z = 50;
camera.position.y = 10;
camera.lookAt(0, 0, 0);

// Movement controls
let moveForward = false;
let moveBackward = false;
let rotateLeft = false;
let rotateRight = false;

// Key listener for WASD movement
document.addEventListener("keydown", (event) => {
    if (event.key === "w") moveForward = true;
    if (event.key === "s") moveBackward = true;
    if (event.key === "a") rotateLeft = true;
    if (event.key === "d") rotateRight = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "w") moveForward = false;
    if (event.key === "s") moveBackward = false;
    if (event.key === "a") rotateLeft = false;
    if (event.key === "d") rotateRight = false;
});

// AI cow object
const cows = [];
function createCow() {
    const cowGeometry = new THREE.BoxGeometry(5, 5, 5);
    const cowMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    const cow = new THREE.Mesh(cowGeometry, cowMaterial);
    cow.position.set(Math.random() * 100 - 50, 5, Math.random() * 100 - 50);
    cows.push(cow);
    scene.add(cow);
}

// AI cow movement logic
function moveCows() {
    cows.forEach((cow) => {
        cow.position.x += (Math.random() - 0.5) * 2;
        cow.position.z += (Math.random() - 0.5) * 2;
    });
}

// Collision detection (check if player or cows are near the fence or each other)
function checkCollisions(player) {
    cows.forEach((cow) => {
        const distance = player.position.distanceTo(cow.position);
        if (distance < 5) {
            playerDie();
            cowDie(cow);
        }
    });

    // Check if player or cows touch the fence boundary
    if (
        player.position.x > 100 || player.position.x < -100 ||
        player.position.z > 100 || player.position.z < -100
    ) {
        playerDie();
    }
}

// Player death handling
function playerDie() {
    console.log("Player hit the fence or cow!");
    // Restart or reset player position here
}

// Cow death handling
function cowDie(cow) {
    console.log("Cow died!");
    scene.remove(cow);
}

// Player movement logic
const player = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
player.position.set(0, 5, 0);
scene.add(player);

function movePlayer() {
    if (moveForward) player.position.z -= 0.5;
    if (moveBackward) player.position.z += 0.5;
    if (rotateLeft) player.rotation.y += 0.05;
    if (rotateRight) player.rotation.y -= 0.05;
}

// Render loop
function animate() {
    requestAnimationFrame(animate);

    moveCows();
    movePlayer();
    checkCollisions(player);

    renderer.render(scene, camera);
}

createCow();  // Create an initial cow
animate();
