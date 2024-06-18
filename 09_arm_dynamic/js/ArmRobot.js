// Importamos la biblioteca Three.js
import * as THREE from 'three';

export class ArmRobot {
  constructor({morphology, scene, markers = false, origin = [0,0,0]}) {
    this.morphology = morphology;
    this.scene = scene;
    this.markers = markers;
    this.origin = origin;
    this.clock = new THREE.Clock();

    this.bones = [];
    this.jointMarkers = [];
    this.group = new THREE.Group();
    this.skeletonHelper = null;

    this.createBones();
    this.createSkeletonHelper();
    if (markers) this.createArticulationMarker();
  }

  createBones() {
    let prevBone = null;

    this.morphology.forEach((boneData, index) => {
      let newBone = new THREE.Bone();
      newBone.position.set(...boneData.geometry);

      if (prevBone) {
        prevBone.add(newBone);
      } else {
        let rootBone = new THREE.Bone();
        rootBone.position.set(...this.origin);
        rootBone.add(newBone);
        this.group.add(rootBone);
      }
      
      this.bones.push(newBone);
      prevBone = newBone;
    })

    this.scene.add(this.group);
  }

  createSkeletonHelper() {
    this.skeletonHelper = new THREE.SkeletonHelper(this.group);
    this.scene.add(this.skeletonHelper);
  }

  createArticulationMarker() {
    this.bones.forEach((bone, index) => {
      if (index === this.bones.length - 1) return;
      const geometry = new THREE.SphereGeometry(0.1);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const marker = new THREE.Mesh(geometry, material);
      marker.position.copy(bone.getWorldPosition(new THREE.Vector3()));
      
      
      //axishelper
      // const axisHelper = new THREE.AxesHelper(1);

      // // Matriz de rotacion en relación al bones[index-1]
      
      // marker.add(axisHelper);
      
      
      this.jointMarkers.push(marker);
      this.scene.add(marker);
    })
  }

  updateMarkers() {
    this.jointMarkers.forEach((marker, index) => {
      marker.position.copy(this.bones[index].getWorldPosition(new THREE.Vector3()));
    })
  }

  setAngles(angles) {
    this.bones.forEach((boneData, index) => {
      // this.bones[index].rotation.y += 0.01;
      const angle = angles[index];
      switch (this.morphology[index].axisEnd) 
      {
        case 'x':
          boneData.rotation.x = angle;
          break;
        case 'y':
          boneData.rotation.y = angle;
          break;
        case 'z':
          boneData.rotation.z = angle;
          break;
      }
      this.morphology[index].angle = angle;
    })
  }

  update({ angles = [] }) {
    if(this.markers) this.updateMarkers();
    if( angles.length > 0 ) this.setAngles(angles);
  }
}