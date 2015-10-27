// reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
iface = new Object();

var MASS = 1; // kg
var springRestDistance = 1; // m
var springConstant = 100; // Newton / meter

var DAMPING = 0.0001;

var TIMESTEP = 1 / 100000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;


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

function Rope(nodes) {
	springRestDistance = 1 / ((nodes - 1) * 1.1);

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
		1, 
		springConstant));

	this.particles = particles;
	this.fixedPoints = fixedPoints;
	this.springs = springs;
}

var diff = new THREE.Vector3();
Rope.prototype.removePreviousSpringForces = function() {
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

Rope.prototype.addSpringForces = function() {
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


// This is down here because function calls need to come after definitions.
var rope = new Rope();
var driveTime = 0;
rope.addSpringForces();

var lastTime;

var drivingPosition = 0; 

var xShift = 250;
var yShift = 100;

iface.reset = function () {
	rope = new Rope();
	rope.addSpringForces();
}

iface.simulate = function (time) {
	if (!lastTime) {
		lastTime = time;
		return;
	}

	rope.removePreviousSpringForces();
	rope.addSpringForces();

	rope.particles[0].stepForward(TIMESTEP);

	var canvas = document.getElementById("rope-canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var part = rope.particles[0];
	var wall = rope.fixedPoints[0];

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
