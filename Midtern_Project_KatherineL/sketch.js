let batteryLevel = 100;
let chargingRate = 1;
let drainingRate = 0.01;
let initialEntityX = 50; // Store initial X coordinate
let initialEntityY = 200; // Store initial Y coordinate
let entityX = initialEntityX; // Set initial X coordinate
let entityY = initialEntityY; // Set initial Y coordinate
let entities = [];
const roomWidth = 200;
const roomHeight = 400;
const livingRoomX = 200;
const livingRoomWidth = 400;
const livingRoomHeight = 400;
const movementSpeed = 3;
const collisionDelay = 60; // Number of frames to delay movement after collision
let interacting = false;
let interactionStartTime = 0;
let charging = false;
let runningToCharge = false;
let dots = []; // Array to store the position of dots
let batteryDecreased = false; // Flag to track if battery has been decreased

function setup() {
  createCanvas(600, 400);
  
  // Create three entities in the living room
  for (let i = 0; i < 7; i++) {
    let x = random(livingRoomX, livingRoomX + livingRoomWidth - 20);
    let y = random(0, height - 20);
    entities.push(new Entity(x, y));
  }
}

function draw() {
  background(220);

  // Draw rooms
  fill(150);
  rect(0, 0, roomWidth, height); // Your room
  rect(livingRoomX, 0, livingRoomWidth, height); // Living room

  // Draw entities
  for (let entity of entities) {
    entity.display();
    entity.move();
    // Check collision with red entity
    if (entity.intersects(entityX, entityY)) {
      interacting = true;
      entity.stopMoving(); // Stop moving when colliding with the red entity
      // Set position of dots above the blue entity
      dots.push({x: entity.x + 5, y: entity.y - 10});
      dots.push({x: entity.x + 15, y: entity.y - 10});
      dots.push({x: entity.x + 25, y: entity.y - 10});

      if (!batteryDecreased) {
        batteryLevel -= 0.05;
        batteryLevel = max(0, batteryLevel); // Ensure battery level doesn't go below 0
        batteryDecreased = true; // Set the flag to true
      }
    } else {
      // Reset the flag if no longer colliding
      batteryDecreased = false;
    }
  }

  // Draw player entity
  fill(255, 0, 0);
  rect(entityX, entityY, 20, 20);
  

  // Check collision with blue entities and set position of dots accordingly
  for (let entity of entities) {
    if (entity.intersects(entityX, entityY)) {
      interacting = true;
      // Set position of dots above the red entity
      dots.push({x: entityX + 5, y: entityY - 10});
      dots.push({x: entityX + 15, y: entityY - 10});
      dots.push({x: entityX + 25, y: entityY - 10});
    }
  }

  // Draw dots when interacting
  if (interacting) {
    fill(0); // Black color
    for (let dot of dots) {
      ellipse(dot.x, dot.y, 5, 5); // Draw tiny black dots
    }
    interacting = false; // Reset interacting flag
    dots = []; // Clear the dots array
  }

  // Draw battery indicator
  fill(0, 255, 0);
  rect(10, 10, batteryLevel * 2, 20);

  // Update battery level based on entity's location
  if (entityX < livingRoomX) {
    // Entity is in room 1, increase battery level
    batteryLevel = min(100, batteryLevel + chargingRate);
  } else {
    // Entity is in the living room, decrease battery level
    batteryLevel = max(0, batteryLevel - drainingRate);
  }

  // Handle running to charge
  if (batteryLevel <= 0 && !charging && !runningToCharge) {
    runningToCharge = true;
  }

  // Handle movement
  if (!charging && !runningToCharge) {
    // Allow arrow key movement only when not charging or running to charge
    if (keyIsDown(LEFT_ARROW)) {
      entityX -= movementSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      entityX += movementSpeed;
    }
    if (keyIsDown(UP_ARROW)) {
      entityY -= movementSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      entityY += movementSpeed;
    }
  } else if (runningToCharge) {
    // Entity is running back to charge
    // Move towards (50, 200)
    let deltaX = 50 - entityX;
    let deltaY = 200 - entityY;
    let distance = dist(entityX, entityY, 50, 200);
    entityX += deltaX / distance * movementSpeed;
    entityY += deltaY / distance * movementSpeed;
    
    // If reached (50, 200), stop running and start charging
    if (distance < movementSpeed) {
      runningToCharge = false;
      charging = true;
    
    }

  } 
  // Handle recharging and enable movement when battery level reaches 100
  if (charging && batteryLevel >= 100) {
    charging = false; // Stop charging
    runningToCharge = false; // Stop running to charge
  }

  // Ensure entity stays at its initial position after reaching it
  entityX = constrain(entityX, 0, width - 20);
  entityY = constrain(entityY, 0, height - 20);
}

function Entity(x, y) {
  this.x = x;
  this.y = y;
  this.speedX = random(-2, 2); // Random initial speed for movement
  this.speedY = random(-2, 2);
  this.movementDelay = 0; // Frames to delay movement after collision

  this.display = function() {
    fill(0, 0, 255);
    rect(this.x, this.y, 20, 20);
  };

  this.move = function() {
    if (this.movementDelay > 0) {
      this.movementDelay--; // Decrement the delay counter
      return; // Exit move function without moving
    }
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off walls
    if (this.x < livingRoomX || this.x > livingRoomX + livingRoomWidth - 20) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > height - 20) {
      this.speedY *= -1;
    }
  };

  this.intersects = function(x, y) {
    return (
      x < this.x + 20 &&
      x + 20 > this.x &&
      y < this.y + 20 &&
      y + 20 > this.y
    );
  };

  this.stopMoving = function() {
    this.movementDelay = collisionDelay; // Set the movement delay after collision
  };
}
