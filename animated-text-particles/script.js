// how far can the particles be to be joined
const FARTHEST_CONNECT_DISTANCE = 50
const CONNECT_LINE_COLOR = 'rgba(129, 235, 87,'
const PARTICLE_COLOR = 'rgba(255, 255, 255, 0.75)'
//how big the area for interaction is
const MOUSE_RADIUS = 100
// moves the text around the canvas
const SHIFT_Y = 10;
const SHIFT_X = -20;
// changes size of letters / pixel distance between particles
// (decreases particle density and proximity in letters thus lowering letter detail)
const SIZE_X = 15;
const SIZE_Y = 15;



const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

const mouse ={
    x:null,
    y:null,
    radius:MOUSE_RADIUS
}

window.addEventListener('mousemove', function(event){
    mouse.x =event.x;
    mouse.y =event.y;
})

//setup text
ctx.fillStyle = 'white';
ctx.font = '30px Verdana';
ctx.fillText('Hello', 50, 30)
ctx.strokeStyle = 'white';

const textCoordinates = ctx.getImageData(0,0, 500, 500);


class Particle{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        //adds randomness to the speed of a particle's movement
        this.density = (Math.random() * 40) + 5
    }
    draw(){
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 3.14)
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let distanceX = mouse.x - this.x;
        let distanceY = mouse.y - this.y;
        let distance = Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY, 2));
        let maxDistance = mouse.radius
        let forceDirectionX = distanceX / distance;
        let forceDirectionY = distanceY / distance;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
 
        if (distance < mouse.radius){
            this.x -= directionX;
            this.y -= directionY;
        }else{
            if(this.x !== this.baseX){
                let diffX = this.x - this.baseX;
                this.x -= diffX / 10 
            }
            if(this.y !== this.baseX){
                let diffY = this.y - this.baseY;
                this.y -= diffY / 10 
            }
        }
    }
}


function init() {
    particles = [];
    for(let y = 0, y2 = textCoordinates.height; y < y2; y++ ){
      for(let x = 1, x2 = textCoordinates.width; x < x2; x++){
        //the 128 represents opacity, so the if is true when it's opacity is at least >50% 
        //and we're checking every 4th element in the clamped(0-255) array
        //since it's the element that represents the opacity for a single pixel
        if(textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
          // magic numbers to increase the size, should be converted to constant
          let positionX = x + SHIFT_X;
          let positionY = y + SHIFT_Y;
          particles.push(new Particle(positionX * SIZE_X, positionY * SIZE_Y))
        }     
      }
    }

    // for(let i=0; i < 1000; i++ ){

    //     let x = Math.random() * canvas.width;
    //     let y = Math.random() * canvas.height;

    //     particles.push(new Particle(x, y));
    // }
}
init();
console.log(particles);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i< particles.length; i++){
        particles[i].draw()
        particles[i].update()
    }
    connectParticles()
    requestAnimationFrame(animate);
}
animate();


function connectParticles(){
  let opacity = 1;
  for(let i = 0; i < particles.length; i++){
    for(let j = i; j < particles.length; j++){
      const distanceX =  particles[i].x - particles[j].x;
      const distanceY =  particles[i].y - particles[j].y;
      const distance = Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY, 2));
      if(distance < FARTHEST_CONNECT_DISTANCE){
        opacity = 1 -  (distance/FARTHEST_CONNECT_DISTANCE);
        ctx.strokeStyle = `${CONNECT_LINE_COLOR} ${opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke();
      }
    }
  }
}

//might not work, util to center the 'text' dynamically
function getTextSize(){
  //distanceX doesnt work as intended
  const distanceX = particles[particles.length-1].x - particles[0].x; 
  const distanceY = particles[particles.length-1].y - particles[0].y;
  const dimensions = {
    width:distanceX,
    height:distanceY
  } 
  return dimensions
}
console.log(getTextSize())