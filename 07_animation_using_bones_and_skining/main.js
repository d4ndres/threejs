import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);;
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.margin = 0;

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({
    color: 'cyan'
  })
);
scene.add(box);


camera.position.z = 10;

function animation(){
  requestAnimationFrame(animation);
  renderer.render(scene, camera);

  box.rotation.z += 0.01;
  box.rotation.y += 0.01;
}
animation()