// Set up the scene, camera, and renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up the physics world
let world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Add a floor to the world
let groundMaterial = new CANNON.Material('ground');
let groundBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, -1, 0)
});
let groundShape = new CANNON.Plane();
groundBody.addShape(groundShape);
world.addBody(groundBody);

// Create a basic cow model
function createCow() {
    let cowGeometry = new THREE.BoxGeometry(1, 1, 2);  // Simple box geometry for the cow
    let cowMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let cow = new THREE.Mesh(cowGeometry, cowMaterial);

    // Physics body for the cow
    let cowBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(Math.random() * 10, 0.5, Math.random() * 10)
    });
    let cowShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 1));
    cowBody.addShape(cowShape);
    world.addBody(cowBody);

    cow.userData = { body: cowBody };

    scene.add(cow);
    return cow;
}

// Add cows to the scene
let cows = [];
for (let i = 0; i < 5; i++) {
    cows.push(createCow());
}

// Set up the camera position
camera.position.z = 10;

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // Update the physics world
    world.step(1 / 60);

    // Update the cow positions
    cows.forEach(cow => {
        cow.position.copy(cow.userData.body.position);
        cow.rotation.set(cow.userData.body.rotation.x, cow.userData.body.rotation.y, cow.userData.body.rotation.z);
    });

    // Render the scene
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

animate();
