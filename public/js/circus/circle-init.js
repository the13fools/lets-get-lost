circleInit = (function () {
	var exp = {};

	exp.n = 100; // number of nodes

	exp.MASS = .1; // kg
	exp.springRestDistance = Math.sin(Math.PI * 2 / (exp.n)); // m
	exp.springConstant = 10000; // Newton / meter

	exp.DAMPING = 0.001;

	exp.lowerBound = .05;
	exp.upperBound = 10; 

	var ss = SpringSystem;

	function InitSystem() {
		var particles = [];
		var fixedPoints = [];
		var springs = [];

		fixedPoints.push(new ss.Particle(0, 0, 0, exp.MASS));

		for (i = 1; i <= exp.n; i ++) {
			particles.push(new ss.Particle(
				Math.sin(i / (exp.n) * 2 * Math.PI), 
				Math.cos(i / (exp.n) * 2 * Math.PI), 
				0, 
				exp.MASS));
		}

		// wire up the wave
		for (i = 0; i < exp.n; i ++) {
			springs.push(new ss.Spring(
				particles[i],
				particles[(i + 1) % exp.n],
				exp.springRestDistance, 
				exp.springConstant,
				exp.lowerBound,
				exp.upperBound));

			springs.push(new ss.Spring(
				particles[i],
				fixedPoints[0],
				1, 
				exp.springConstant / 1000,
				.001,
				1.3));
		}

		return [particles, fixedPoints, springs];
	}

	var init = InitSystem();
	// This is down here because function calls need to come after definitions.
	exp.system = new ss.System(init[0], init[1], init[2], exp.DAMPING);
	var driveTime = 0;
	exp.system.addSpringForces();

	exp.reset = function () {
		init = InitSystem();
		exp.system = new ss.System(init[0], init[1], init[2], exp.DAMPING);
		exp.system.addSpringForces();
	}

	return exp;
}());