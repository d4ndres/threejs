import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// cread render
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.margin = 0;
document.body.style.backgroundColor = '#2663A7';

const controls = new OrbitControls(camera, renderer.domElement);

class Box extends THREE.Mesh {
  constructor({
    width,
    height,
    deep,
    color = 0x00ff00,
    velocity = { x: 0, y: 0, z: 0 },
    position = { x: 0, y: 0, z: 0 },
    zAcceleration = false,
  }) {
    super(
      new THREE.BoxGeometry(width, height, deep),
      new THREE.MeshStandardMaterial({ color })
    )
    this.height = height;
    this.width = width;
    this.deep = deep;

    this.position.set(position.x, position.y, position.z);
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.left = this.position.x - this.width / 2;
    this.right = this.position.x + this.width / 2;
    
    this.front = this.position.z - this.deep / 2;
    this.back = this.position.z + this.deep / 2;


    this.velocity = velocity
    this.gravity = -0.02;

    this.zAcceleration = zAcceleration;
  }

  updateSides(){
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    
    this.left = this.position.x - this.width / 2;
    this.right = this.position.x + this.width / 2;
    
    this.front = this.position.z - this.deep / 2;
    this.back = this.position.z + this.deep / 2;
  }

  update(ground, arr = []) {
    this.updateSides();

    if( this.zAcceleration ) {
      this.velocity.z += 0.0002;
    }

    this.position.x += this.velocity.x;
    this.position.z += this.velocity.z;
    this.applyGravity(ground)
    this.deleteSelf(ground, arr);
  }

  applyGravity(ground) {

    this.velocity.y += this.gravity;

    // if (this.bottom + this.velocity.y <= ground.top) {
    if ( boxCollision({ box1: this, box2: ground })) {
      this.velocity.y *= 0.8
      this.velocity.y = -this.velocity.y;
    } else {
      this.position.y += this.velocity.y;
    }
  }

  deleteSelf( ground, arr = [] ) {
    if( this.top < ground.bottom && this.zAcceleration ) {
      const index = arr.indexOf(this);
      if( index > -1) {
        arr.splice(index, 1);
        scene.remove(this);
      }
    }
  }
}

function boxCollision({ box1, box2}) {
  const zCollision = box1.front < box2.back && box1.back > box2.front
  const xCollision = box1.left < box2.right && box1.right > box2.left
  const yCollision = box1.bottom + box1.velocity.y < box2.top && box1.top > box2.bottom
  return zCollision && xCollision && yCollision
}




const ground = new Box({
  width: 10,
  height: 0.5,
  deep: 30,
  color: 0x479CD5,
  position: { x: 0, y: -2, z: 0 }
});

ground.receiveShadow = true;
scene.add(ground);


const cube = new Box({
  width: 1,
  height: 1,
  deep: 1,
  velocity: { x: 0, y: -0.05, z: 0 },
  position: { 
    x: 0, 
    y: 0, 
    z: ground.back - 1 
  },
});
cube.castShadow = true;
scene.add(cube);





const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.y = 3;
light.position.z = 2;
light.castShadow = true;
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 1));


camera.position.set(8, 5, 20);
camera.lookAt(0, 0, 0)

const keys = {
  left: {
    pressed: false
  },
  right: {
    pressed: false
  },
  toFrom: {
    pressed: false
  },
  toBack: {
    pressed: false
  }
}


window.addEventListener('keydown', e => {
  switch (e.keyCode) {
    case 32:
      cube.velocity.y = 0.3;
      break;
    case 37:
      keys.left.pressed = true;
      break;
    case 39:
      keys.right.pressed = true;
      break;
    case 38:
      keys.toFrom.pressed = true;
      break;
    case 40:
      keys.toBack.pressed = true;
      break;
  }
})

window.addEventListener('keyup', e => {
  switch (e.keyCode) {
    case 37:
      keys.left.pressed = false;
      break;
    case 39:
      keys.right.pressed = false;
      break;
    case 38:
      keys.toFrom.pressed = false;
      break;
    case 40:
      keys.toBack.pressed = false;
      break;
  }
})


const enemies = [];
let frame = 0
let spawnRate = 140;
function animationLoop() {
  const animationId = requestAnimationFrame(animationLoop);
  cube.velocity.x = 0;
  if (keys.left.pressed) cube.velocity.x = -0.05;
  else if (keys.right.pressed) cube.velocity.x = 0.05;
  
  cube.velocity.z = 0;
  if (keys.toFrom.pressed) cube.velocity.z = -0.05;
  else if (keys.toBack.pressed) cube.velocity.z = 0.05;

  cube.update(ground);

  enemies.forEach(enemy => {
    enemy.update(ground, enemies );
    if( boxCollision({ box1: cube, box2: enemy })) {
      cancelAnimationFrame(animationId)
    }
  })

  renderer.render(scene, camera);

  if( frame % spawnRate == 0) {
    if( spawnRate > 60) spawnRate -= 10;

    const enemy = new Box({
      width: 1,
      height: 1,
      deep: 1,
      velocity: { 
        x: 0,
        y: -0.05, 
        z: 0.02 
      },
      position: { 
        x: (Math.random() - 0.5) * ground.width / 2, 
        y: -0.05, 
        z: ground.front + 1
      },
      color: 0xff0000,
      zAcceleration: true
    });
    scene.add(enemy);
    enemies.push(enemy)
  }

  frame++;
}
animationLoop() 