import * as THREE from 'three'
import { OrbitControls, TransformControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.margin = 0;

class Caja extends THREE.Mesh {
  constructor({color, position = {
    x: 0,
    y: 0,
    z: 0
  }}){
    super(
      new THREE.BoxGeometry(1,1,1),
      new THREE.MeshBasicMaterial({
        color
      })
    )
    this.position.set(position.x, position.y, position.z)

  }

  activeTransformControls() {
    if(!keyControls.someActive) return

    tControls.attach(this)
    scene.add(tControls)

    if(keyControls.r) tControls.setMode('rotate')
    else if(keyControls.s) tControls.setMode('scale')
    else if(keyControls.t) tControls.setMode('translate')
  
  }

  desactiveTransformControls() {
    tControls.detach(this)
    scene.remove(tControls)
  }
}

const oControls = new OrbitControls(camera, renderer.domElement);
const tControls = new TransformControls(camera, renderer.domElement);

tControls.addEventListener('dragging-changed', (event) => {
  oControls.enabled = !event.value;
})

const puntero = new THREE.Raycaster();



const box = new Caja({
  color: 0x00ff00,
  position: {
    x: -10,
    y: 1/2,
    z: 0
  }
})
scene.add(box);


const box1 = new Caja({
  color: 0xffffff,
  position: {
    x: 0,
    y: 1/2,
    z: 0
  }
})
scene.add(box1);


const box2 = new Caja({
  color: 0x00ffff,
  position: {
    x: 10,
    y: 1/2,
    z: 0
  }
})
scene.add(box2);


scene.add(new THREE.GridHelper(100, 100));

camera.position.set(5, 5, 10);
camera.lookAt(0, 0, 0);



const mouse = {
  x: undefined,
  y: undefined
}

addEventListener('mousemove', (ev) => {
  mouse.x = ev.clientX / innerWidth * 2 - 1
  mouse.y = -(ev.clientY / innerHeight * 2 - 1)
})


const keyControls = {
  someActive: false,
  r: false,
  t: false,
  s: false
}

addEventListener('keydown', (ev) => {
  if(ev.key === 'r') keyControls.r = true
  if(ev.key === 't') keyControls.t = true
  if(ev.key === 's') keyControls.s = true
  keyControls.someActive = true
  })
  
  addEventListener('keyup', (ev) => {
    if(ev.key === 'r') keyControls.r = false
    if(ev.key === 't') keyControls.t = false
    if(ev.key === 's') keyControls.s = false
    keyControls.someActive = false
})

function animation(){
  requestAnimationFrame(animation);
  renderer.render(scene, camera);
  puntero.setFromCamera(mouse, camera)

  
  const intersects = puntero.intersectObjects(scene.children.filter( c => c instanceof THREE.Mesh));
  
  if(intersects.length > 0){
    intersects[0].object.activeTransformControls()
  }
}
animation()