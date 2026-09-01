import * as THREE from 'three';
import VanillaTilt from 'vanilla-tilt';

// 1. Initialize Vanilla-tilt
const tiltElements = document.querySelectorAll("[data-tilt]");
VanillaTilt.init(tiltElements, {
  max: 15,
  speed: 400,
  glare: true,
  "max-glare": 0.2,
});

// 2. Scroll Reveal Animations
const revealElements = document.querySelectorAll('.section');
const revealOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

revealElements.forEach(el => {
  el.classList.add('reveal');
  revealOnScroll.observe(el);
});

// 3. Three.js Cool 3D Particles Background
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Add Particles
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 2500;
const posArray = new Float32Array(particleCount * 3);

for(let i = 0; i < particleCount * 3; i++) {
  // Random range -50 to 50
  posArray[i] = (Math.random() - 0.5) * 100;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Create materials for a cool tech feel
const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  color: 0x00f0ff,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});

const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleMesh);

// Optional: Add some larger glowing shapes/stars
const starGeometry = new THREE.BufferGeometry();
const starCount = 200;
const starPosArray = new Float32Array(starCount * 3);
for(let i = 0; i < starCount * 3; i++) {
  starPosArray[i] = (Math.random() - 0.5) * 120;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPosArray, 3));
const starMaterial = new THREE.PointsMaterial({
  size: 0.4,
  color: 0x7000ff,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});
const starMesh = new THREE.Points(starGeometry, starMaterial);
scene.add(starMesh);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
});

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;
  
  // Rotate slowly over time
  particleMesh.rotation.y = elapsedTime * 0.05;
  particleMesh.rotation.x = elapsedTime * 0.02;
  
  starMesh.rotation.y = elapsedTime * 0.08;

  // Parallax effect with mouse
  particleMesh.rotation.y += 0.05 * (targetX - particleMesh.rotation.y);
  particleMesh.rotation.x += 0.05 * (targetY - particleMesh.rotation.x);

  renderer.render(scene, camera);
}

animate();
