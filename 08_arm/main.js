// Importamos las bibliotecas necesarias
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { THREERobot } from './THREERobot.js';
import { RobotState } from './RobotState.js';
import * as dat from 'dat.gui';



// Configuración básica de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.margin = 0;

// Añadimos controles de órbita para la cámara
const controls = new OrbitControls(camera, renderer.domElement);

// Añadimos luz ambiental a la escena
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Agrega una neblina en el horizonte. esta se expande desde el punto 0,0,0
scene.fog = new THREE.Fog(0x000000, 100, 200);

// Añadimos una cuadrícula a la escena
scene.add(new THREE.GridHelper(1000, 1000));


// Objeto angulos del robot en dat.GUI
const gui = new dat.GUI();
const angles = {
  j0: 0,
  j1: 0,
  j2: 0,
  j3: 0,
  j4: 0,
  j5: 0,
};
gui.add(angles, 'j0', -Math.PI, Math.PI).name('Base').step(0.01);
gui.add(angles, 'j1', 0, Math.PI/2).name('Shoulder').step(0.01);
gui.add(angles, 'j2', -Math.PI, Math.PI).name('Elbow').step(0.01);
gui.add(angles, 'j3', -Math.PI, Math.PI).name('Wrist 1').step(0.01);
gui.add(angles, 'j4', -Math.PI, Math.PI).name('Wrist 2').step(0.01);
gui.add(angles, 'j5', -Math.PI, Math.PI).name('Wrist 3').step(0.01);



// Inicialización del estado del robot
const robotState = new RobotState();
const geometry = Object.values(robotState.getState().geometry).map(val => [val.x, val.y, val.z]);
const jointLimits = Object.values(robotState.getState().jointLimits);

// Inicialización del robot visual en la escena
const visualRobot = new THREERobot(geometry, jointLimits, scene);
visualRobot.THREE.rotation.x = -Math.PI / 2;
// Variables para animación
let clock = new THREE.Clock(); // Reloj para medir el tiempo transcurrido
let speed = 0.5; // Velocidad de la animación

// Función para actualizar los ángulos del robot en base al estado
function updateRobot() {
  const angles = Object.values(robotState.getState().angles);
  visualRobot.setAngles(angles);

  // Verificamos si las articulaciones están fuera de los límites y las resaltamos si es necesario
  for (let i = 0; i < 6; i++) {
    if (!robotState.getState().jointOutOfBound[i] && robotState.getState().jointOutOfBound[i]) {
      visualRobot.highlightJoint(i, 0xff0000);
    } else if (robotState.getState().jointOutOfBound[i] && !robotState.getState().jointOutOfBound[i]) {
      visualRobot.highlightJoint(i);
    }
  }
}

// Función para animar los ángulos del robot
function animateAngles() {
  //Variable definida para crear animación
  // const elapsed = clock.getElapsedTime() * speed;
  // angles.j0 = Math.sin(elapsed) * Math.PI / 2;

  robotState.setAngles(angles);
}

// Añadimos una caja simple a la escena para referencia
const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 'salmon' })
);
scene.add(box);

// Función de animación
function animation() {
  requestAnimationFrame(animation);
  animateAngles(); // Actualizamos los ángulos de las articulaciones
  updateRobot(); // Actualizamos la visualización del robot
  renderer.render(scene, camera);
}
animation();

// Configuramos la posición inicial de la cámara
camera.position.set(30, 25, 30);
camera.lookAt(0, 0, 0);

// Añadimos una luz direccional a la escena
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1).normalize();
scene.add(light);
