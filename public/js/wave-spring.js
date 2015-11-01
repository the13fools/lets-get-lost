waveEx = (function () {
	var exp = {};

	exp.n = 34; // number of nodes

	exp.MASS = 1; // kg
	exp.springRestDistance = 1 / (exp.n + 1); // m
	exp.springConstant = 100; // Newton / meter

	exp.DAMPING = 0;

	exp.TIMESTEP = 1 / 10000;
	exp.lowerBound = .05 / exp.n;
	exp.upperBound = 1.2 / exp.n;

	// changing this in console won't work b/c of slider
	exp.initP1 = 1;
	exp.initP2 = 1.5;

	var ss = SpringSystem;
	ss.DAMPING = exp.DAMPING;

	function InitSystem() {
		var particles = [];
		var fixedPoints = [];
		var springs = [];

	//	fixedPoints.push(new ss.Particle(0, 0, 0, exp.MASS));
		fixedPoints.push(new ss.Particle(1, 0, 0, exp.MASS));

		for (i = 1; i <= exp.n; i ++) {
			particles.push(new ss.Particle(i / (exp.n + 1) + .01, 0, 0, exp.MASS));
		}

		// springs.push(new ss.Spring(
		// 	fixedPoints[0],
		// 	particles[0],
		// 	exp.springRestDistance, 
		// 	exp.springConstant,
		// 	exp.lowerBound,
		// 	exp.upperBound));


		// wire up the wave
		for (i = 0; i < exp.n - 1; i ++) {
			springs.push(new ss.Spring(
				particles[i],
				particles[i + 1],
				exp.springRestDistance, 
				exp.springConstant,
				exp.lowerBound,
				exp.upperBound));
		}

		springs.push(new ss.Spring(
			particles[exp.n - 1],
			fixedPoints[0],
			exp.springRestDistance, 
			exp.springConstant,
			exp.lowerBound,
			exp.upperBound));

		return [particles, fixedPoints, springs];
	}

	var init = InitSystem();
	// This is down here because function calls need to come after definitions.
	var system = new ss.System(init[0], init[1], init[2]);
	var driveTime = 0;
	system.addSpringForces();

	var lastTime;

	var drivingPosition = 0; 

	var xShift = 50;
	var yShift = 150;
	var scale = 550;

	var massSize = 15;

	exp.reset = function () {
		init = InitSystem();
		system = new ss.System(init[0], init[1], init[2]);
		system.addSpringForces();
	}

	var step = 0;
	// Render loop, called by https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
	exp.simulate = function (time) {
		if (!lastTime) {
			lastTime = time;
			return;
		}

		system.particles[0].position.setY(Math.sin(step / 10) / 10);
		system.particles[0].position.setX(0);
	//	system.fixedPoints[1].position.setY(Math.sin(-step / 100) / 10);

		// improve accuracy by doing multiple simulation steps per render step
		for (i = 0; i < 2; i++) {
			system.removePreviousSpringForces();
			system.addSpringForces();

			for (i = 0; i < system.particles.length; i++) {
				system.particles[i].stepForward(exp.TIMESTEP);
			}

	//		system.particles[0].position.setY(Math.sin(step / 100) / 100);
			system.enforceConstraints(step);
			step++;
		}

		// Draw the data to canvas https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

		var canvas = document.getElementById("waveex-canvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (i = 0; i < system.springs.length; i++) {
			drawSpring(system.springs[i], ctx);
		}

		
		for (i = 0; i < system.particles.length; i++) {
			ctx.fillStyle = colors[i % 3 + 1];
			var part = system.particles[i];
			ctx.fillRect(part.position.x * scale + xShift - massSize / 2, 
						 part.position.y * scale + yShift - massSize / 2, 
						 massSize, massSize);
		}

		ctx.fillStyle = colors[7];
		var point = system.fixedPoints[0];
		ctx.fillRect(point.position.x * scale + xShift - massSize / 2, 
					 point.position.y * scale + yShift - massSize / 2, 
					 massSize, massSize);

	}

	var coilCount = 4;
	function drawSpring(spring, ctx) {
		var p1 = spring.p1;
		var p2 = spring.p2;
		console.log(spring)
		ctx.beginPath();
		ctx.moveTo(p1.position.x * scale + xShift + massSize / 2, p1.position.y * scale + yShift);
		for (j = 1; j <= coilCount; j++) {
			var shift = j % 2 == 0 ?  massSize / 2 : - massSize / 2;
			if (j == coilCount) { shift = 0; }
			ctx.lineTo(((coilCount - j) * (p1.position.x + massSize / 2 / scale) + 
						          j * (p2.position.x -  massSize / 2 / scale) ) / coilCount * scale + xShift, 
				       ((coilCount - j) * p1.position.y + j * p2.position.y) / coilCount * scale + shift + yShift);
		} 

		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.closePath()
	}

	return exp;
}());
