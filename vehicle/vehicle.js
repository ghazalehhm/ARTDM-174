// Vehicle Constructor Function
function Vehicle(vehicle_type, weight, current_speed, fuel_amount) {
  this.vehicle_type = vehicle_type;
  this.weight = weight;
  this.current_speed = current_speed;
  this.fuel_amount = fuel_amount;

  // Methods
  this.getSpeed = function() {
    return this.current_speed;
  };

  this.setSpeed = function(newSpeed) {
    this.current_speed = newSpeed;
  };

  this.speedUp = function(amount) {
    this.current_speed += amount;
    console.log(`${this.vehicle_type} speeds up to ${this.current_speed} km/h`);
  };

  this.slowDown = function(amount) {
    this.current_speed -= amount;
    if (this.current_speed < 0) this.current_speed = 0;
    console.log(`${this.vehicle_type} slows down to ${this.current_speed} km/h`);
  };
}

// Create two different vehicles
let car = new Vehicle("Car", 1600, 80, 45);
let motorcycle = new Vehicle("Motorcycle", 180, 50, 8);

// Test Car
console.log("=== Car ===");
console.log("Current Speed:", car.getSpeed()); // 80
car.speedUp(30); // Car speeds up to 110 km/h
car.slowDown(40); // Car slows down to 70 km/h

// Test Motorcycle
console.log("=== Motorcycle ===");
console.log("Current Speed:", motorcycle.getSpeed()); // 50
motorcycle.speedUp(60); // Motorcycle speeds up to 110 km/h
motorcycle.slowDown(90); // Motorcycle slows down to 20 km/h
