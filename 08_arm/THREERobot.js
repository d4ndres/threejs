// Importamos la biblioteca Three.js
import * as THREE from 'three';

// Definimos la clase THREERobot, que representa un robot en la escena de Three.js
export class THREERobot {
  constructor(V_initial, limits, scene) {
    // Creamos un grupo que contendrá todas las partes del robot
    this.THREE = new THREE.Group();
    this.robotBones = []; // Array para almacenar las partes del robot (huesos)
    this.joints = []; // Array para almacenar las articulaciones del robot
    this.angles = [0, 0, 0, 0, 0, 0]; // Array para almacenar los ángulos de las articulaciones
    this.scene = scene; // Guardamos la escena en la que se añadirá el robot
    scene.add(this.THREE); // Añadimos el grupo del robot a la escena

    const colors = ['blue', 'green', 'salmon', 'hotpink', 'cyan', 0x0]; // Colores para las diferentes partes del robot
    let parentObject = this.THREE; // Referencia al objeto padre para jerarquía de transformaciones

    V_initial.push([0, 0, 0]); // Añadimos un pseudo enlace para tener 6 ejes

    // Variables para posición inicial de los enlaces
    let x = 0, y = 0, z = 0;

    // Iteramos sobre los enlaces iniciales para crear las partes del robot
    for (let i = 0; i < V_initial.length; i++) {
      const link = V_initial[i];
      const linkLimit = limits[i] || [-Infinity, Infinity]; // Definimos los límites de los enlaces
      const linkGeo = this.createCube(x, y, z, link[0], link[1], link[2], linkLimit[0], linkLimit[1], i, colors); // Creamos la geometría del enlace
      x = link[0]; // Actualizamos la posición x para el siguiente enlace
      y = link[1]; // Actualizamos la posición y para el siguiente enlace
      z = link[2]; // Actualizamos la posición z para el siguiente enlace
      parentObject.add(linkGeo); // Añadimos el enlace al objeto padre
      parentObject = linkGeo; // El enlace actual se convierte en el nuevo objeto padre
      this.robotBones.push(linkGeo); // Añadimos el enlace a la lista de huesos del robot
    }
  }

  // Método para crear un cubo (parte del robot) y añadirle una articulación
  createCube(x, y, z, w, h, d, min, max, jointNumber, colors) {
    const thicken = 1; // Engrosar el tamaño del cubo
    const w_thickened = Math.abs(w) + thicken;
    const h_thickened = Math.abs(h) + thicken;
    const d_thickened = Math.abs(d) + thicken;

    const material = new THREE.MeshLambertMaterial({ color: colors[jointNumber] }); // Material del cubo con color específico
    const geometry = new THREE.BoxGeometry(w_thickened, h_thickened, d_thickened); // Geometría del cubo
    const mesh = new THREE.Mesh(geometry, material); // Creamos el cubo con la geometría y el material

    mesh.position.set(w / 2, h / 2, d / 2); // Posicionamos el cubo
    const group = new THREE.Object3D(); // Creamos un objeto grupo para contener el cubo y la articulación
    group.position.set(x, y, z); // Posicionamos el grupo
    group.add(mesh); // Añadimos el cubo al grupo

    // Creamos la geometría y el mesh de la articulación
    const jointGeo1 = new THREE.CylinderGeometry(0.8, 0.8, 1.6, 32);
    const jointMesh1 = new THREE.Mesh(jointGeo1, new THREE.MeshBasicMaterial({ color: 0xffbb00 }));
    const joint = new THREE.Group(); // Creamos un grupo para la articulación
    joint.add(jointMesh1); // Añadimos la geometría de la articulación al grupo
    this.joints.push(joint); // Añadimos la articulación a la lista de articulaciones

    // Configuramos la rotación de la articulación según su número
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
        this.addArrows(group); // Añadimos flechas de dirección en el último enlace
        break;
    }

    group.add(joint); // Añadimos la articulación al grupo
    return group; // Devolvemos el grupo que contiene el cubo y la articulación
  }

  // Método para añadir flechas de dirección (ejes) al grupo
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

  // Método para establecer los ángulos de las articulaciones del robot
  setAngles(angles) {
    this.angles = angles;
    this.robotBones[0].rotation.z = angles[0];
    this.robotBones[1].rotation.y = angles[1];
    this.robotBones[2].rotation.y = angles[2];
    this.robotBones[3].rotation.x = angles[3];
    this.robotBones[4].rotation.y = angles[4];
    this.robotBones[5].rotation.z = angles[5];
  }

  // Método para establecer el ángulo de una articulación específica
  setAngle(index, angle) {
    this.angles[index] = angle;
    this.setAngles(this.angles);
  }

  // Método para resaltar una articulación específica
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

  // Método para cambiar el color de un objeto y sus hijos
  colorObjectAndChildren(object, hexColor) {
    object.traverse((node) => {
      this.colorObject(node, hexColor);
    });
  }

  // Método para cambiar el color de un objeto
  colorObject(object, hexColor) {
    if (object.material) {
      if (!object.initalMaterial) {
        object.initalMaterial = object.material;
      }
      object.material = object.material.clone();
      object.material.color.setHex(hexColor);
    }
  }

  // Método para restablecer el color de un objeto y sus hijos
  resetObjectAndChildrenColor(object) {
    object.traverse((node) => {
      this.resetObjectColor(node);
    });
  }

  // Método para restablecer el color de un objeto
  resetObjectColor(object) {
    if (object.initalMaterial) {
      object.material = object.initalMaterial;
    }
  }
}
