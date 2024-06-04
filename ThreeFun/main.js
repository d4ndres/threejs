import * as THREE from 'three';
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

//Elementos necesarios
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const render = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();

//render canvas
render.setSize(window.innerWidth, window.innerHeight);
render.setPixelRatio(window.devicePixelRatio);
const body = document.body;
body.appendChild(render.domElement);
body.style.margin = 0;


const gui = new dat.GUI()
const world = {
  plane: {
    width: 46,
    widthSegments: 50,
    heightSegments: 50
  }
}
gui.add(world.plane, 'width', 1, 50)
  .onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 50)
  .onChange(generatePlane)
gui.add(world.plane, 'heightSegments', 1, 50)
  .onChange(generatePlane)

// const boxGeometry = new THREE.BoxGeometry(1,1,1);
// const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
// const cube = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(cube);


// Geo plana sensible a la luz
const planeGeometry = new THREE.PlaneGeometry(
  world.width, 
  world.width, 
  world.widthSegments, 
  world.heightSegments
);
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: true,
  vertexColors: true,
  // color: 0xff0000
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);



function generatePlane() {
  plane.geometry.dispose()
  plane.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.width,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  const position = plane.geometry.attributes.position;
  position.originalPosition = position.array

  const randomValues = []
  const { array } = position;

  for (let i = 0; i < array.length; i++) {
    if(i % 3 === 0) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];
      array[i + 2] = z + (Math.random() - .5);
    }
    randomValues.push(Math.random() - Math.PI * 2)
  }
  position.randomValues = randomValues

  const count = plane.geometry.attributes.position.count
  const colors = []
  for(let i = 0; i < count; i++) {
    colors.push(0,0.19,0.4)
  }
  plane.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
}
generatePlane()


//Luz
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0.5, 1);
scene.add(light);
const lightBack = new THREE.DirectionalLight(0xffffff, 1);
lightBack.position.set(0, 0, -1);
scene.add(lightBack);


// orbit controls
const controls = new OrbitControls(camera, render.domElement);

const mouse = {
  x: undefined,
  y: undefined
}

camera.position.z = 5;


let frame = 0
const animate = function () {
  requestAnimationFrame(animate);
  // plane.rotation.x += 0.01;
  // plane.rotation.z += 0.01;
  render.render(scene, camera);
  raycaster.setFromCamera(mouse, camera)

  frame += 0.01
  const { array, originalPosition, randomValues } = plane.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.0004 ;
    array[i+1] = originalPosition[i+1] + Math.sin(frame + randomValues[i]) * 0.0004 ;
    
  
  }

  plane.geometry.attributes.position.needsUpdate = true;
  



  const intersects = raycaster.intersectObject(plane)
  
  if (intersects.length > 0) {
    const face = intersects[0].face;
    const {color} = intersects[0].object.geometry.attributes;


    color.setX(face.a,0.1)
    color.setY(face.a,0.5)
    color.setZ(face.a,1)

    color.setX(face.b,0.1)
    color.setY(face.b,0.5)
    color.setZ(face.b,1)

    color.setX(face.c,0.1)
    color.setY(face.c,0.5)
    color.setZ(face.c,1)
  
    color.needsUpdate = true
    
    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4
    }

    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1
    }

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration: 1,
      onUpdate: () => {
        color.setX(face.a, hoverColor.r)
        color.setY(face.a, hoverColor.g)
        color.setZ(face.a, hoverColor.b)

        color.setX(face.b, hoverColor.r)
        color.setY(face.b, hoverColor.g)
        color.setZ(face.b, hoverColor.b)

        color.setX(face.c, hoverColor.r)
        color.setY(face.c, hoverColor.g)
        color.setZ(face.c, hoverColor.b)
        color.needsUpdate = true
      }
    })

  }
}
animate();





// mouse event
addEventListener('mousemove', (ev) => {
  mouse.x = ev.clientX / innerWidth * 2 - 1
  mouse.y = -(ev.clientY / innerHeight * 2 - 1)

  // console.log(mouse);
})
