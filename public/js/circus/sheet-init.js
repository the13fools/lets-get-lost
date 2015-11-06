sheetInit = (function () {
	var exp = {};

	exp.n = 10; // number of nodes

	exp.MASS = .1; // kg
	exp.springRestDistance = 1 / (exp.n); // m
	exp.springConstant = 10000; // Newton / meter

	exp.DAMPING = 0.000;

	exp.lowerBound = .05;
	exp.upperBound = 10; 

	var ss = SpringSystem;

	function InitSystem() {
		var particles = [];
		var fixedPoints = [];
		var springs = [];

		// fixedPoints.push(new ss.Particle(0, 0, 0, exp.MASS));
		// fixedPoints.push(new ss.Particle(0, 1, 0, exp.MASS));
		// fixedPoints.push(new ss.Particle(1, 0, 0, exp.MASS));
		// fixedPoints.push(new ss.Particle(1, 1, 0, exp.MASS));

		for (var i = 1; i <= exp.n; i ++) {
				fixedPoints.push(new ss.Particle(i / (exp.n + 1), 0, 0, exp.MASS));
				fixedPoints.push(new ss.Particle(0, i / (exp.n + 1), 0, exp.MASS));
				fixedPoints.push(new ss.Particle(i / (exp.n + 1), 1, 0, exp.MASS));
				fixedPoints.push(new ss.Particle(1, i / (exp.n + 1), 0, exp.MASS));
		}

		for (var i = 1; i <= exp.n; i ++) {
			for (var j = 1; j <= exp.n; j ++) {
				particles.push(new ss.Particle(
					i / (exp.n + 1), 
					j / (exp.n + 1), 
					0, 
					exp.MASS));
			}
		}

		// wire up the wave
		for (var i = 0; i < exp.n; i ++) {
			for (var j = 0; j < exp.n; j ++) {
				if (i < exp.n - 1) {
					springs.push(new ss.Spring(
					particles[i + exp.n * j],
					particles[i + 1 + exp.n * j],
					exp.springRestDistance, 
					exp.springConstant,
					exp.lowerBound,
					exp.upperBound));
				}

				if (j < exp.n - 1) {
					springs.push(new ss.Spring(
					particles[i + exp.n * j],
					particles[i + exp.n * (j + 1)],
					exp.springRestDistance, 
					exp.springConstant,
					exp.lowerBound,
					exp.upperBound));
				}
			}
		}

		// wire up the wave
		// for (var i = 0; i < exp.n; i ++) {

		// 	springs.push(new ss.Spring(
		// 		particles[i],
		// 		particles[(i + 1) % exp.n],
		// 		exp.springRestDistance, 
		// 		exp.springConstant,
		// 		exp.lowerBound,
		// 		exp.upperBound));

		// 	springs.push(new ss.Spring(
		// 		particles[i],
		// 		fixedPoints[0],
		// 		1, 
		// 		exp.springConstant / 1000,
		// 		.001,
		// 		1.3));
		// }

		console.log(springs);

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