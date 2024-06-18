// Importamos las bibliotecas necesarias
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import * as dat from 'dat.gui';



// Configuración básica de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.margin = 0;

// Agrega una neblina en el horizonte. esta se expande desde el punto 0,0,0
scene.fog = new THREE.Fog(0x000000, 100, 200);

// Añadimos una cuadrícula a la escena
scene.add(new THREE.GridHelper(1000, 1000));

// Añadimos controles de órbita para la cámara
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 100;
controls.minDistance = 10;


// Añadimos luz ambiental a la escena
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Añadimos una luz direccional a la escena
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1).normalize();
scene.add(light);

// Configuramos la posición inicial de la cámara
camera.position.set(14, 14, 20);
camera.lookAt(0, 0, 0);







// Función de animación
function animation() {
  requestAnimationFrame(animation);
  renderer.render(scene, camera);
}
animation();




