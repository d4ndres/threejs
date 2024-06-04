document.body.style.margin = 0

import gsap from 'gsap'
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

import atmosphereVertexShader from './shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,innerWidth/innerHeight,0.1,1000
)

const render = new THREE.WebGLRenderer({
  antialias:true
})

render.setSize(innerWidth,innerHeight)
render.setPixelRatio(devicePixelRatio)
document.body.appendChild(render.domElement)


// Earth
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(2.5,32,32),
  // new THREE.MeshBasicMaterial({
  //   map: new THREE.TextureLoader().load('./img/globe.jpg')
  // })
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
      globeTexture:{
        value: new THREE.TextureLoader().load('./img/globe.jpg')
      }
    },

  })
)



//atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(2.5,32,32),
  // new THREE.MeshBasicMaterial({
  //   map: new THREE.TextureLoader().load('./img/globe.jpg')
  // })
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    side: THREE.BackSide,
  })
)
atmosphere.scale.set(1.1,1.1,1.1)
scene.add(atmosphere)


const group = new THREE.Group()
group.add(sphere)
scene.add(group)


const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
})

const starVertices = []
for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 2000
  const y = (Math.random() - 0.5) * 2000
  const z = -Math.random() * 2000
  starVertices.push(x,y,z)
}

starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starVertices,3))
const stars = new THREE.Points(starGeometry,starMaterial)
scene.add(stars)





camera.position.z = 5

const mouse = {
  x: 0,
  y: 0
}

function animate() {
  requestAnimationFrame(animate)

  sphere.rotation.y += 0.003
  // group.rotation.y += (mouse.x - group.rotation.y ) * 0.05
  gsap.to(group.rotation, {
    y: mouse.x * 0.5,
    duration: 2,
    x: -mouse.y * 0.5,
  })

  render.render(scene,camera)
}
animate()



window.addEventListener('mousemove',(e)=>{
  mouse.x = (e.clientX / innerWidth) * 2 - 1
  mouse.y = -(e.clientY / innerHeight) * 2 + 1
  console.log(mouse);
})