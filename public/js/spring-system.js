// http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
SpringSystem = (function () {
	var exp = {};

	// Data structure for physics
	function Particle(x, y, z, mass) {
		// read/write
		this.position = new THREE.Vector3(x, y, z); // current 
		this.forces = new THREE.Vector3(0, 0, 0); // F = ma -> F * 1/m = a

		// read only
		this.previousPosition = new THREE.Vector3(x, y, z); 
		this.original = new THREE.Vector3(x, y, z);
		this.invMass = 1 / mass;
		this.isFixed = false;

		// private 
		this.a = new THREE.Vector3(0, 0, 0); // acceleration
		this.tmp = new THREE.Vector3();
	}

	// F = ma -> F * 1/m = a
	Particle.prototype.getAcceleration = function() {
			this.a.copy(this.forces).multiplyScalar(this.invMass);
			return this.a;
	}

	function Spring(p1, p2, restLength, springConstant, minLength, maxLength) {
		this.p1 = p1;
		this.p2 = p2;
		this.restLength = restLength;
		this.springConstant = springConstant;
		this.minLength = minLength;
		this.maxLength = maxLength;
	}

	function System(particles, fixedPoints, springs, damping) {
		this.particles = particles;
		this.fixedPoints = fixedPoints;
		this.springs = springs;
		this.damping = damping;
		if ( damping === null || damping === "" ) {
			this.damping = .0001;
		}

		for (var i = 0; i < this.fixedPoints.length; i++) {
			this.fixedPoints[i].isFixed = true;
		}

		// For sanity, ensure constrained points are free to move.
		for (var i = 0; i < this.springs.length; i++) {
			assert(!this.springs[i].p1.isFixed || 
				!this.springs[i].p2.isFixed);
		}

		// Pass the damping term into the particles 
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].damping = this.particles[i].damping || this.damping;
		}


	}

	var diff = new THREE.Vector3();
	System.prototype.removePreviousSpringForces = function() {
		// We are modelling connections using Hooke's law: 
		// F = kX, where X is declenation from the "natural" length
		for (var i = 0; i < this.springs.length; i++) {
			var spring = this.springs[i];
			diff.subVectors(spring.p1.previousPosition, 
							spring.p2.previousPosition);
			var len = diff.length();

			// be careful with the signs here
			diff.multiplyScalar((spring.restLength - len) *
				spring.springConstant);

			spring.p1.forces.sub(diff);
			spring.p2.forces.add(diff);
		}
	};

	System.prototype.addSpringForces = function() {
		for (var i = 0; i < this.springs.length; i++) {
			var spring = this.springs[i];
			diff.subVectors(spring.p1.position, 
							spring.p2.position);
			var len = diff.length();

			// be careful with the signs here
			diff.multiplyScalar((spring.restLength - len) *
				spring.springConstant);

			spring.p1.forces.add(diff);
			spring.p2.forces.sub(diff);

		}

	};

	System.prototype.enforceConstraints = function(step) {
		function enforce(i, system) {
			var con = system.springs[i];
			diff.subVectors(con.p1.position, 
							con.p2.position);
			var len = diff.length();
			var targetDist = -1;
			if (con.maxLength < len) { 
				targetDist = con.maxLength;
			}
			else if (con.minLength > len) { 
				targetDist = con.minLength;
			}

			if (targetDist != -1) { 
				var correction = diff.multiplyScalar(1 - targetDist / len);
				if (con.p1.isFixed) {
					con.p2.position.add(correction);
				}
				else if (con.p2.isFixed) {
					con.p1.position.sub(correction);
				}
				else { 
					var correctionHalf = correction.multiplyScalar(0.5);
					con.p1.position.sub(correctionHalf);
					con.p2.position.add(correctionHalf);
				}
			}
		};

		// tighten from both ends 
		var len = this.springs.length;
		if (step % 2 == 0) {
			for (var i = 0; i < len; i++) {
				enforce( (~~(step / 2) + i) % len, this);
			}
		}
		else {
			for (var i = len - 1; i >= 0; i--) {
				enforce( (~~(step / 2) + i) % len, this);
			}
		}
		step++;
	};


	// Perform verlet integration.  
	// x_n+1 = x_n + v(x_n)dt + a(x_n) dt^2
	// x_n+1 = x_n + (x_n - x_n-1) + a(x_n) dt^2
	// But actually, we want to have a damping term on the velocity approximation, so we do
	// x_n+1 = x_n + (1 - damping) * (x_n - x_n-1) + a(x_n) dt^2
	// x_n+1 = (2 - damping) * x_n - x_n-1 + a(x_n) dt^2
	Particle.prototype.stepForward = function(timesq) {
		this.tmp.copy(this.position);
		this.tmp.multiplyScalar(2 - this.damping);
		this.tmp.sub(this.previousPosition.multiplyScalar(1 - this.damping));
		this.tmp.add(this.getAcceleration().multiplyScalar(timesq));

		this.previousPosition.copy(this.position);
		this.position.copy(this.tmp);
	}

	exp.Particle = Particle;
	exp.Spring = Spring;
	exp.System = System;

	return exp;
}());


