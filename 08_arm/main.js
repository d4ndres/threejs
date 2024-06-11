// main.js

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { THREERobot } from './THREERobot.js';
import { RobotState } from './RobotState.js';

// Configuración básica de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.margin = 0;
const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
scene.add(new THREE.GridHelper(100, 100));

// Inicialización del robot y el estado
const robotState = new RobotState();
const geometry = Object.values(robotState.getState().geometry).map(val => [val.x, val.y, val.z]);
const jointLimits = Object.values(robotState.getState().jointLimits);
const visualRobot = new THREERobot(geometry, jointLimits, scene);

// Actualización de ángulos en base al estado del robot
function updateRobot() {
  const angles = Object.values(robotState.getState().angles);
  visualRobot.setAngles(angles);

  for (let i = 0; i < 6; i++) {
    if (!robotState.getState().jointOutOfBound[i] && robotState.getState().jointOutOfBound[i]) {
      visualRobot.highlightJoint(i, 0xff0000);
    } else if (robotState.getState().jointOutOfBound[i] && !robotState.getState().jointOutOfBound[i]) {
      visualRobot.highlightJoint(i);
    }
  }
}

// Añadir una caja simple para referencia
const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 'salmon' })
);
scene.add(box);

// Animación
function animation() {
  requestAnimationFrame(animation);
  renderer.render(scene, camera);
  updateRobot();
}
animation();

// Configuración de la posición inicial de la cámara
camera.position.set(0, -40, 0);
camera.lookAt(0, 0, 0);

// Añadir luces a la escena
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1).normalize();
scene.add(light);
