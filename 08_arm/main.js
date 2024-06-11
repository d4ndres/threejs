import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

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


// Clase THREERobot
class THREERobot {
  constructor(V_initial, limits, scene) {
    this.THREE = new THREE.Group();
    this.robotBones = [];
    this.joints = [];
    this.angles = [0, 0, 0, 0, 0, 0];
    this.scene = scene;
    scene.add(this.THREE);

    const colors = ['blue', 'green', 'salmon', 'hotpink', 'cyan', 0x0];
    let parentObject = this.THREE;

    V_initial.push([0, 0, 0]); // Agregar un sexto pseudo enlace para 6 ejes

    let x = 0, y = 0, z = 0;
    for (let i = 0; i < V_initial.length; i++) {
      const link = V_initial[i];
      const linkLimit = limits[i] || [-Infinity, Infinity]; // Manejar el caso donde limits[i] sea undefined
      const linkGeo = this.createCube(x, y, z, link[0], link[1], link[2], linkLimit[0], linkLimit[1], i, colors);
      x = link[0];
      y = link[1];
      z = link[2];
      parentObject.add(linkGeo);
      parentObject = linkGeo;
      this.robotBones.push(linkGeo);
    }
  }

  createCube(x, y, z, w, h, d, min, max, jointNumber, colors) {
    const thicken = 1;
    const w_thickened = Math.abs(w) + thicken;
    const h_thickened = Math.abs(h) + thicken;
    const d_thickened = Math.abs(d) + thicken;

    const material = new THREE.MeshLambertMaterial({ color: colors[jointNumber] });
    const geometry = new THREE.BoxGeometry(w_thickened, h_thickened, d_thickened);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(w / 2, h / 2, d / 2);
    const group = new THREE.Object3D();
    group.position.set(x, y, z);
    group.add(mesh);

    const jointGeo1 = new THREE.CylinderGeometry(0.8, 0.8, 1.6, 32);
    const jointMesh1 = new THREE.Mesh(jointGeo1, new THREE.MeshBasicMaterial({ color: 0xffbb00 }));
    const joint = new THREE.Group();
    joint.add(jointMesh1);
    this.joints.push(joint);

    switch (jointNumber) {
      case 0:
        joint.rotation.x = Math.PI / 2;
        break;
      case 3:
        joint.rotation.z = Math.PI / 2;
        break;
      case 4:
        joint.rotation.y = Math.PI / 2;
        break;
      case 5:
        joint.rotation.x = Math.PI / 2;
        group.rotation.y = Math.PI / 2;
        this.addArrows(group);
        break;
    }

    group.add(joint);
    return group;
  }

  addArrows(group) {
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 3, 0x0000ff);
    arrowZ.line.material.linewidth = 4;
    group.add(arrowZ);
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 3, 0x00ff00);
    arrowY.line.material.linewidth = 4;
    group.add(arrowY);
    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 3, 0xff0000);
    arrowX.line.material.linewidth = 4;
    group.add(arrowX);
  }

  setAngles(angles) {
    this.angles = angles;
    this.robotBones[0].rotation.z = angles[0];
    this.robotBones[1].rotation.y = angles[1];
    this.robotBones[2].rotation.y = angles[2];
    this.robotBones[3].rotation.x = angles[3];
    this.robotBones[4].rotation.y = angles[4];
    this.robotBones[5].rotation.z = angles[5];
  }

  setAngle(index, angle) {
    this.angles[index] = angle;
    this.setAngles(this.angles);
  }

  highlightJoint(jointIndex, hexColor) {
    if (jointIndex >= this.joints.length) {
      console.warn(`cannot highlight joint: ${jointIndex} (out of index: ${this.joints.length})`);
    }
    if (hexColor) {
      this.colorObjectAndChildren(this.joints[jointIndex], hexColor);
    } else {
      this.resetObjectAndChildrenColor(this.joints[jointIndex]);
    }
  }

  colorObjectAndChildren(object, hexColor) {
    object.traverse((node) => {
      this.colorObject(node, hexColor);
    });
  }

  colorObject(object, hexColor) {
    if (object.material) {
      if (!object.initalMaterial) {
        object.initalMaterial = object.material;
      }
      object.material = object.material.clone();
      object.material.color.setHex(hexColor);
    }
  }

  resetObjectAndChildrenColor(object) {
    object.traverse((node) => {
      this.resetObjectColor(node);
    });
  }

  resetObjectColor(object) {
    if (object.initalMaterial) {
      object.material = object.initalMaterial;
    }
  }
}

// Clase para gestionar el estado del robot
class RobotState {
  constructor() {
    this.state = {
      angles: { j0: 0, j1: 0, j2: 0, j3: 0, j4: 0, j5: 0 },
      jointLimits: {
        j0: [-Infinity, Infinity],
        j1: [-Infinity, Infinity],
        j2: [-Infinity, Infinity],
        j3: [-Infinity, Infinity],
        j4: [-Infinity, Infinity],
        j5: [-Infinity, Infinity]
      },
      jointOutOfBound: [false, false, false, false, false, false],
      geometry: {
        V1: { x: 4.8, y: 0, z: 7.3 },
        V2: { x: 0, y: 0, z: 13.0 },
        V3: { x: 1, y: 0, z: 2 },
        V4: { x: 12.6, y: 0, z: 0 },
        V5: { x: 3.6, y: 0, z: 0 },
        V6: { x: 0, y: 0, z: 0 }
      }
    };
  }

  setAngles(angles) {
    this.state.angles = angles;
    this.checkJointLimits();
  }

  checkJointLimits() {
    const angles = Object.values(this.state.angles);
    const jointLimits = Object.values(this.state.jointLimits);

    for (let i = 0; i < jointLimits.length; i++) {
      const jointLimit = jointLimits[i];
      const jointAngle = angles[i];
      this.state.jointOutOfBound[i] = jointAngle < jointLimit[0] || jointAngle > jointLimit[1];
    }
  }

  getState() {
    return this.state;
  }
}

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
