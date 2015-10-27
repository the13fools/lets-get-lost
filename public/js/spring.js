// reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
iface = new Object();

var MASS = 1; // kg
var springRestDistance = 1; // m
var springConstant = 100; // Newton / meter

var DAMPING = 0.0001;

var TIMESTEP = 1 / 100000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;


// Data structure for physics
function Particle(x, y, z, mass, index) {
	// read/write
	this.position = new THREE.Vector3(x, y, 0); // current 
	this.forces = new THREE.Vector3(0, 0, 0); // F = ma -> F * 1/m = a

	// read only
	this.previousPosition = new THREE.Vector3(x, y, 0); 
	this.original = new THREE.Vector3(x, y, 0);
	this.invMass = 1 / mass;
	this.idx = index;

	// private 
	this.a = new THREE.Vector3(0, 0, 0); // acceleration
	this.tmp = new THREE.Vector3();
}

// F = ma -> F * 1/m = a
Particle.prototype.getAcceleration = function() {
		this.a.copy(this.forces).multiplyScalar(this.invMass);
		return this.a;
}

function Spring(p1, p2, restLength, springConstant) {
	this.p1 = p1;
	this.p2 = p2;
	this.restLength = restLength;
	this.springConstant = springConstant;
}

iface.initialXposition = 1.1;

function System(particles, fixedPoints, springs) {
	this.particles = particles;
	this.fixedPoints = fixedPoints;
	this.springs = springs;
}

var diff = new THREE.Vector3();
System.prototype.removePreviousSpringForces = function() {
	// We are modelling connections using Hooke's law: 
	// F = kX, where X is declenation from the "natural" length
	for (i = 0; i < this.springs.length; i++) {
		var spring = this.springs[i];
		diff.subVectors(spring.p1.previousPosition, 
						spring.p2.previousPosition);
		var len = diff.length();

		// be careful with the signs here
		diff.multiplyScalar((spring.restLength - len) *
			spring.springConstant);

		spring.p2.forces.add(diff);
	}
};

System.prototype.addSpringForces = function() {
	for (i = 0; i < this.springs.length; i++) {
		var spring = this.springs[i];
		diff.subVectors(spring.p1.position, 
						spring.p2.position);
		var len = diff.length();

		// be careful with the signs here
		diff.multiplyScalar((spring.restLength - len) *
			spring.springConstant);

		spring.p2.forces.sub(diff);

	}

};


// Perform verlet integration.  
// x_n+1 = x_n + v(x_n)dt + a(x_n) dt^2
// x_n+1 = x_n + (x_n - x_n-1) + a(x_n) dt^2
// But actually, we want to have a damping term on the velocity approximation, so we do
// x_n+1 = x_n + (1 - damping) * (x_n - x_n-1) + a(x_n) dt^2
// x_n+1 = (2 - damping) * x_n - x_n-1 + a(x_n) dt^2
Particle.prototype.stepForward = function(timesq) {
	this.tmp.copy(this.position);
	this.tmp.multiplyScalar(2 - DAMPING);
	this.tmp.sub(this.previousPosition.multiplyScalar(1 - DAMPING));
	this.tmp.add(this.getAcceleration().multiplyScalar(timesq));

	this.previousPosition.copy(this.position);
	this.position.copy(this.tmp);
}

function InitSystem() {
		springRestDistance = 1;

	var particles = [];
	var fixedPoints = [];
	var springs = [];

	var center = new Particle(0, 0, 0, MASS, -1);
	fixedPoints.push(center);
	console.log(iface.initialXposition);
	particles.push(new Particle(iface.initialXposition, 0, 0, MASS, -1));

	springs.push(new Spring(
		fixedPoints[0],
		particles[0],
		springRestDistance, 
		springConstant));

	return [particles, fixedPoints, springs];
}

// Color array that we will be using to help perception.
// http://bl.ocks.org/mbostock/5577023
var colors = ["#a50026",
				"#d73027",
				"#f46d43",
				"#fdae61",
				"#fee090",
				"#ffffbf",
				"#e0f3f8",
				"#abd9e9",
				"#74add1",
				"#4575b4",
				"#313695"];

var init = InitSystem();
// This is down here because function calls need to come after definitions.
var system = new System(init[0], init[1], init[2]);
var driveTime = 0;
system.addSpringForces();

var lastTime;

var drivingPosition = 0; 

var xShift = 250;
var yShift = 100;

iface.reset = function () {
	init = InitSystem();
	system = new System(init[0], init[1], init[2]);
	system.addSpringForces();
}

// Render loop, called by https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
iface.simulate = function (time) {
	if (!lastTime) {
		lastTime = time;
		return;
	}

	system.removePreviousSpringForces();
	system.addSpringForces();

	system.particles[0].stepForward(TIMESTEP);

	// Draw the data to canvas https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

	var canvas = document.getElementById("system-canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var part = system.particles[0];
	var wall = system.fixedPoints[0];

	ctx.beginPath();
	ctx.moveTo(wall.position.x * 100 + xShift, wall.position.y * 100 + yShift);
	for (i = 1; i <= 10; i++) {
		var shift = i % 2 == 0 ? 20 : -20;
		ctx.lineTo(((10 - i) * wall.position.x + i * part.position.x) / 10 * 100 + xShift, 
			       ((10 - i) * wall.position.y + i * part.position.y) / 10 * 100 + shift + yShift);
	} 

	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.fillStyle = colors[1];
	ctx.fillRect(part.position.x * 100 + xShift, part.position.y * 100 + yShift - 25, 50, 50);

}
