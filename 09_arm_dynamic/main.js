// Importamos las bibliotecas necesarias
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ArmRobot } from './js/ArmRobot.js';
import * as dat from 'dat.gui';



// Configuración básica de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.margin = 0;

//axis helper
const axisHelper = new THREE.AxesHelper(1);
scene.add(axisHelper);

// Agrega una neblina en el horizonte. esta se expande desde el punto 0,0,0
scene.fog = new THREE.Fog(0x000000, 100, 200);

// Añadimos una cuadrícula a la escena
// scene.add(new THREE.GridHelper(1000, 1000));

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
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

const gui = new dat.GUI();
const angles = {
  j0: 0,
  j1: 0,
  j2: 0,
  j3: 0,
  j4: 0,
};
gui.add(angles, 'j0', -Math.PI, Math.PI).name('Base').step(0.01);
gui.add(angles, 'j1', -Math.PI/2, Math.PI/2).name('joint 1').step(0.01);
gui.add(angles, 'j2', -Math.PI, Math.PI).name('joint 2').step(0.01);
gui.add(angles, 'j3', -Math.PI, Math.PI).name('joint 3').step(0.01);

const robot = new ArmRobot({
  scene,
  origin: [0,0,0],
  markers: true,
  morphology: [
    { angle: angles.j0, type: 'rotational', axisEnd: 'z', geometry: [0,1,0] },
    { angle: angles.j1, type: 'rotational', axisEnd: 'z', geometry: [0,1,0] },
    { angle: angles.j2, type: 'rotational', axisEnd: 'z', geometry: [0,1,0] },
    { angle: angles.j3, type: 'rotational', axisEnd: 'z', geometry: [0,1,0] },
    { angle: angles.j4, type: 'rotational', axisEnd: 'z', geometry: [0,1,0] },
    
  ]
});

function animation() {
  requestAnimationFrame(animation);
  
  robot.update({
    angles: [angles.j0, angles.j1, angles.j2, angles.j3, angles.j4],
  });
  // console.log(robot.morphology.map(bone => bone.angle));

  renderer.render(scene, camera);
}
animation();




