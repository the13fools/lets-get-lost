// reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
iface = new Object();

var nodes = 10;

var MASS = .01;
var springRestDistance;
var springConstant = 100;

var DAMPING = 0.0001;

var TIMESTEP = 10 / 100000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;

var lastTime;


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

function Constraint(p1, p2, restLength, allowedStretch) {
	this.p1 = p1;
	this.p2 = p2;
	this.restLength = restLength;
	this.allowedStretch = allowedStretch;
}

function Spring(p1, p2, restLength, springConstant) {
	this.p1 = p1;
	this.p2 = p2;
	this.restLength = restLength;
	this.springConstant = springConstant;
}


// make this fixed.  Should be a better way of doing this.
var center = new Particle(0, 0, 0, MASS, -1);
function Rope(nodes) {
	nodes = nodes || 10;
	this.nodes = nodes;
	var tension = .1;
	springRestDistance = 1 / ((nodes - 1) * 1.1);

	var particles = [];
	var springs = [];
	var constraints = [];

	// nodes
	for (i = 0; i < nodes; i++) {
		particles.push(
			new Particle(Math.sin(2 * Math.PI / nodes * i), 
						 Math.cos(2 * Math.PI / nodes * i), 0, MASS, i)
		);
	}

//	springs
	for (i = 0; i < nodes; i++) {
		springs.push(new Spring(
				center,
				particles[i],
				1,
				springConstant));
	}

	restDistance = Math.sin(Math.PI * 2 / nodes) ;
	for (i = 0; i < nodes; i++) {
		springs.push(new Spring(
				particles[i],
				particles[(i + 1) % nodes],
				restDistance,
				10000));
	}


	// constraints (to model connections as inf strength springs beyond certain point)
	stretchPercentage = 0;
	restDistance = Math.sin(Math.PI * 2 / nodes) * 2;
	for (i = 0; i < nodes; i++) {
		constraints.push(new Constraint(
				particles[i],
				particles[(i + 1) % nodes],
				restDistance,
				stretchPercentage));
	}


	this.particles = particles;
	this.springs = springs;
	this.constraints = constraints;

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

		// hacky :(
		if(spring.p1.idx >= 0) {
			spring.p1.forces.sub(diff);
		}
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

		if(spring.p1.idx >= 0) {
			spring.p1.forces.add(diff);
		}
		spring.p2.forces.sub(diff);

	}

};

var steps = 0;
Rope.prototype.enforceConstraints = function() {
	function enforce(i, rope) {
		var con = rope.constraints[i];
		diff.subVectors(con.p1.position, 
						con.p2.position);
		var len = diff.length();
		var targetDist = con.restLength * (1 + con.allowedStretch / 100);

		if (len > targetDist || len < con.restLength) {
			var correction = diff.multiplyScalar(1 - targetDist / len);
			var correctionHalf = correction.multiplyScalar(0.5);
			con.p1.position.sub(correctionHalf);
			con.p2.position.add(correctionHalf);
		}
	};

	// tighten from both ends 
	var len = this.constraints.length;
	if (steps % 2 == 0) {
		for (i = 0; i < len; i++) {
			enforce( (~~(steps / 2) + i) % len, this);
		}
	}
	else {
		for (i = len - 1; i >= 0; i--) {
			enforce( (~~(steps / 2) + i) % len, this);
		}
	}
	steps++;
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


// This is down here because function calls need to come after definitions.  
// Should really exist across a few files.
var rope = new Rope(100);
var driveTime = 0;
rope.addSpringForces();

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

iface.frequencyMultiplier = 1;
var drivingPosition = 0; 

iface.simulate = function (time) {
	if (!lastTime) {
		lastTime = time;
		return;
	}

	// Step through the simulation several times per animation
	for (step = 0; step < 5; step++) {

		driveTime += TIMESTEP * iface.frequencyMultiplier / 5;
		rope.removePreviousSpringForces();
		rope.addSpringForces();

		for (i = 0; i < rope.nodes; i++) {
	//		console.log("node #"+ i + " : Force " + rope.particles[i].forces.x + "   Pos " + rope.particles[i].position.x);
			rope.particles[i].stepForward(TIMESTEP_SQ);
		}

	//	  rope.enforceConstraints();
	//	  rope.particles[0].position.set(0, 0, 0);
		  rope.particles[0].position.set(0, Math.sin(driveTime) / 5 + 1, 0);
	//	  rope.particles[~~(rope.nodes / 2)].position.set(0, -Math.sin(driveTime) / 3 - 1, 0);
//		  rope.particles[1].position.set(0, 0, .1);
	//	  rope.particles[rope.nodes - 1].position.set(1, 0, 0);
	}

	var canvas = document.getElementById("rope-canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (i = 0; i < rope.nodes; i++) {
		var part = rope.particles[i];
		ctx.fillStyle = colors[i % colors.length];
		ctx.fillRect(part.position.x * 100 + 350, part.position.y * 100 + 150, 10, 10);
	}

}