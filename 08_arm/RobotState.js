// Definimos la clase RobotState, que gestiona el estado del robot
export class RobotState {
  constructor() {
    // Definimos el estado inicial del robot
    this.state = {
      angles: { j0: 0, j1: 0, j2: 0, j3: 0, j4: 0, j5: 0 }, // Ángulos iniciales de las articulaciones
      jointLimits: {
        j0: [-Infinity, Infinity], // Límites de la articulación j0
        j1: [-Infinity, Infinity], // Límites de la articulación j1
        j2: [-Infinity, Infinity], // Límites de la articulación j2
        j3: [-Infinity, Infinity], // Límites de la articulación j3
        j4: [-Infinity, Infinity], // Límites de la articulación j4
        j5: [-Infinity, Infinity]  // Límites de la articulación j5
      },
      jointOutOfBound: [false, false, false, false, false, false], // Indicadores de si las articulaciones están fuera de los límites
      geometry: {
        V1: { x: 3, y: 0, z: 3 }, // Geometría de la articulación V1
        V2: { x: 0, y: 0, z: 13.0 }, // Geometría de la articulación V2
        V3: { x: 0, y: 2, z: 0 }, // Geometría de la articulación V3
        V4: { x: 12.6, y: 0, z: 0 }, // Geometría de la articulación V4
        V5: { x: 3.6, y: 0, z: 0 }, // Geometría de la articulación V5
        V6: { x: 0, y: 2, z: 0 } // Geometría de la articulación V6
      }
    };
  }

  // Método para establecer los ángulos de las articulaciones
  setAngles(angles) {
    this.state.angles = angles;
    this.checkJointLimits(); // Verificamos si los ángulos están dentro de los límites
  }

  // Método para verificar si los ángulos de las articulaciones están dentro de los límites
  checkJointLimits() {
    const angles = Object.values(this.state.angles); // Obtenemos los ángulos de las articulaciones
    const jointLimits = Object.values(this.state.jointLimits); // Obtenemos los límites de las articulaciones

    // Iteramos sobre las articulaciones para verificar sus ángulos
    for (let i = 0; i < jointLimits.length; i++) {
      const jointLimit = jointLimits[i];
      const jointAngle = angles[i];
      this.state.jointOutOfBound[i] = jointAngle < jointLimit[0] || jointAngle > jointLimit[1]; // Actualizamos el estado si el ángulo está fuera de los límites
    }
  }

  // Método para obtener el estado actual del robot
  getState() {
    return this.state;
  }
}
