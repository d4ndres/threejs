import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer({
  // alpha: true,
});
const scene = new THREE.Scene();
// scene.background = new THREE.Color('green');
// scene.fog = new THREE.Fog(0xffffff, 0.1, 50);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const newCamera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 10);

let helper = new THREE.CameraHelper( newCamera );
scene.add( helper );

addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.updateProjectionMatrix();
  camera.aspect = innerWidth / innerHeight;
});

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.margin = 0;

// carga una textura por cara
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ 
    color: 0x00ff00,
    // wireframe: true
    map: new THREE.TextureLoader()
    .load('./img/sanaTexture.jpg')
  })
)
cube.position.z = -5;
scene.add(cube);
cube.rotation.set(0.4, 0.2, 0.1);


function animationLoop() {
    const animationId = requestAnimationFrame(animationLoop);
    renderer.render(scene, camera);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    camera.lookAt(newCamera.position);
    camera.position.x = Math.cos(animationId * 0.01) * 30;
    camera.position.z = Math.sin(animationId * 0.01) * 30;


}
animationLoop();