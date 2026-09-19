/* ==========================================================================
   Avdhoot Web Solutions - Interactive 3D Hero Scene (Three.js / WebGL)
   High-end 3D Visualizer showing SERP, SEO graphs, AI Search box, floating nodes
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Initialize Three.js Scene, Camera, Renderer
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    45, 
    canvas.clientWidth / canvas.clientHeight, 
    0.1, 
    1000
  );
  camera.position.set(0, 0, 15);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient Light & Directional Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x2563eb, 1.5);
  dirLight1.position.set(10, 10, 10);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x7c3aed, 1.2);
  dirLight2.position.set(-10, -10, 10);
  scene.add(dirLight2);

  // Group to contain floating 3D objects
  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  // 1. Central 3D Laptop / Browser Window Mesh
  const laptopGeo = new THREE.BoxGeometry(7, 4.5, 0.3);
  const laptopMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.2,
    metalness: 0.8
  });
  const laptopMesh = new THREE.Mesh(laptopGeo, laptopMat);
  heroGroup.add(laptopMesh);

  // Screen Face
  const screenGeo = new THREE.PlaneGeometry(6.6, 4.1);
  const screenMat = new THREE.MeshBasicMaterial({
    color: 0x1e293b
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.z = 0.16;
  laptopMesh.add(screenMesh);

  // 2. Floating 3D Bar Graph Pillars inside scene
  const barHeights = [1.2, 2.0, 1.6, 2.8, 3.5, 4.2];
  const barColors = [0x2563eb, 0x3b82f6, 0x60a5fa, 0x7c3aed, 0x8b5cf6, 0x10b981];

  barHeights.forEach((h, idx) => {
    const barGeo = new THREE.BoxGeometry(0.5, h, 0.5);
    const barMat = new THREE.MeshStandardMaterial({
      color: barColors[idx],
      roughness: 0.3,
      metalness: 0.5,
      emissive: barColors[idx],
      emissiveIntensity: 0.2
    });
    const barMesh = new THREE.Mesh(barGeo, barMat);
    barMesh.position.set(-2.5 + idx * 1.0, -1 + h / 2, 0.5);
    heroGroup.add(barMesh);
  });

  // 3. Floating 3D Orbs / Keyword Nodes around the laptop
  const nodeCount = 18;
  const nodes = [];
  const sphereGeo = new THREE.SphereGeometry(0.25, 16, 16);

  for (let i = 0; i < nodeCount; i++) {
    const nodeMat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0x2563eb : 0x10b981,
      roughness: 0.1,
      emissive: i % 2 === 0 ? 0x2563eb : 0x10b981,
      emissiveIntensity: 0.5
    });
    const nodeMesh = new THREE.Mesh(sphereGeo, nodeMat);

    // Random spherical coordinates
    const radius = 5 + Math.random() * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    nodeMesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
    nodeMesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
    nodeMesh.position.z = radius * Math.cos(phi);

    nodeMesh.userData = {
      speedX: (Math.random() - 0.5) * 0.008,
      speedY: (Math.random() - 0.5) * 0.008,
      initialY: nodeMesh.position.y
    };

    nodes.push(nodeMesh);
    heroGroup.add(nodeMesh);
  }

  // 4. Connecting Lines between nodes (Neural Network Effect for AI Search)
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.25
  });

  const lineGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(nodeCount * 3);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const lineMesh = new THREE.Line(lineGeo, lineMat);
  heroGroup.add(lineMesh);

  // Mouse Parallax Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    mouseX = (e.clientX - windowHalfX) / 100;
    mouseY = (e.clientY - windowHalfY) / 100;
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    if (!canvas) return;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth camera mouse follow
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    heroGroup.rotation.y = targetX * 0.2 + elapsedTime * 0.15;
    heroGroup.rotation.x = -targetY * 0.2;

    // Bobbing animation for laptop mesh
    laptopMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.2;
    laptopMesh.rotation.z = Math.sin(elapsedTime * 1.0) * 0.03;

    // Animate nodes and dynamic lines
    const linePositions = lineMesh.geometry.attributes.position.array;
    nodes.forEach((node, index) => {
      node.position.y = node.userData.initialY + Math.sin(elapsedTime * 2 + index) * 0.3;
      
      linePositions[index * 3] = node.position.x;
      linePositions[index * 3 + 1] = node.position.y;
      linePositions[index * 3 + 2] = node.position.z;
    });
    lineMesh.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
});
