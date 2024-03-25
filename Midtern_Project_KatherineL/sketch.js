let batteryLevel = 100;
let chargingRate = 1;
let drainingRate = 0.2;
let entityX, entityY;
let entities = [];
const roomWidth = 200;
const roomHeight = 400;
const livingRoomX = 200;
const livingRoomWidth = 400;
const livingRoomHeight = 400;
const movementSpeed = 3;
let interacting = false;
let interactionStartTime = 0;
let charging = false;

function setup() {
  createCanvas(600, 400);
  entityX = width / 2 - roomWidth / 2;
  entityY = height / 2;
  
  // Create three entities in the living room
  for (let i = 0; i < 3; i++) {
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
  }

  // Draw player entity
  fill(255, 0, 0);
  rect(entityX, entityY, 20, 20);

  // Draw battery indicator
  fill(0, 255, 0);
  rect(10, 10, batteryLevel * 2, 20);
  

  // Handle interaction
  if (!interacting && entityX >= livingRoomX && entityX <= livingRoomX + livingRoomWidth) {
    for (let entity of entities) {
      if (dist(entityX, entityY, entity.x, entity.y) < 30) {
        textSize(16);
        fill(0);
        text('Press "E" to interact', entityX - 50, entityY - 30);
        if (keyIsDown(69)) { // Check if "E" key is pressed
          interacting = true;
          interactionStartTime = millis(); // Record the time when the interaction started
          batteryLevel = max(0, batteryLevel - 10); // Decrease battery level upon interaction
          entity.talk();
        }
      }
    }
  }

  // Handle the duration of interaction
  if (interacting) {
    let elapsedTime = millis() - interactionStartTime;
    if (elapsedTime > 2000) { // Adjust the duration here (2000 milliseconds = 2 seconds)
      interacting = false;
    }
  }

  // Handle movement
  if (!charging) {
    if (batteryLevel <= 0) {
      // Move towards the charging room
      if (entityX < livingRoomX) {
        entityX += movementSpeed;
      } else if (entityX > livingRoomX) {
        entityX -= movementSpeed;
      }
      if (entityY < height / 2) {
        entityY += movementSpeed;
      } else if (entityY > height / 2) {
        entityY -= movementSpeed;
      }
      
      // Check if entity has reached the charging room
      if (entityX >= livingRoomX && entityX <= livingRoomX + livingRoomWidth && entityY >= height / 2) {
        charging = true;
      }
    } else {
      if (keyIsDown(LEFT_ARROW)) {
        entityX -= movementSpeed;
        entityX = constrain(entityX, 0, width - 20); // Allow entity to move freely in both rooms
      }
      if (keyIsDown(RIGHT_ARROW)) {
        entityX += movementSpeed;
        entityX = constrain(entityX, 0, width - 20); // Allow entity to move freely in both rooms
      }
      if (keyIsDown(UP_ARROW)) {
        entityY -= movementSpeed;
        entityY = constrain(entityY, 0, height - 20);
      }
      if (keyIsDown(DOWN_ARROW)) {
        entityY += movementSpeed;
        entityY = constrain(entityY, 0, height - 20);
      }
    }
  } else {
    // Entity is charging
    if (entityX < livingRoomX + livingRoomWidth / 2) {
      entityX += movementSpeed;
    } else {
      charging = false;
      batteryLevel = min(100, batteryLevel + chargingRate);
    }
  }

  // Draw speech bubble
  if (interacting) {
    textSize(16);
    fill(0);
    text('Hello!', entityX - 20, entityY - 30);
    text('Hi there!', entityX - 20, entityY - 50);
  }
}

function Entity(x, y) {
  this.x = x;
  this.y = y;

  this.display = function() {
    fill(0, 0, 255);
    rect(this.x, this.y, 20, 20);
  };

  this.talk = function() {
    // Speech bubble for interaction
    textSize(16);
    fill(0);
    text('Hello!', this.x - 20, this.y - 30);
    text('Hi there!', entityX - 20, entityY - 50);
  };


// Handle charging process
if (!charging && batteryLevel <= 0 && entityX < livingRoomX) {
  // If the battery is depleted and not already charging, and the entity is not in the living room, start charging process
  charging = true;
}

// Handle charging process
if (charging) {
  // Move entity to the center of the charging room
  if (entityX < livingRoomX + livingRoomWidth / 2) {
    entityX += movementSpeed;
  } else {
    // Stop charging once in the center
    charging = false;
    // Increase battery level until it reaches maximum
    batteryLevel = min(100, batteryLevel + chargingRate);
  }
}

// Charge battery when entity is in the room
if (entityX >= livingRoomX && entityX <= livingRoomX + livingRoomWidth) {
  batteryLevel = min(100, batteryLevel + chargingRate);
}


  
}
