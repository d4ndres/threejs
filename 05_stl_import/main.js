import * as THREE from 'three'
import { STLLoader, SelectionHelper } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  // alpha: true,
  antialias: true
})

const controls = new OrbitControls(camera, renderer.domElement);


renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)
document.body.style.margin = 0


let loader = new STLLoader()
loader.load('./stls/HexagonMovingRobot.stl', (model) => {
  const object = new THREE.Mesh(
    model,
    new THREE.MeshPhongMaterial({
      color: 0xff0000,
      wireframe: false
    }),
  )
  scene.add(object)
  object.scale.set(0.1, 0.1, 0.1)
  object.position.set(0, -2, 0)
})


const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(3, 2, 5);
scene.add(light);


scene.add(new THREE.AmbientLight(0xffffff, 0.6))
camera.position.z = 20

function animation(){
  requestAnimationFrame(animation)
  renderer.render(scene, camera)

  controls.update()
}
animation()