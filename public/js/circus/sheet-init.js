sheetInit = (function () {
	var exp = {};

	exp.n = 10; // number of nodes

	exp.MASS = .1; // kg
	exp.springRestDistance = 1 / (exp.n + 1); // m
	exp.springConstant = 10000; // Newton / meter

	exp.DAMPING = 0.000;

	exp.lowerBound = .05;
	exp.upperBound = 10; 

	exp.three;
	exp.texturePath;

	var ss = SpringSystem;

	var sheetFunction = plane(25 * exp.n, 25 * exp.n);

	function plane(width, height) {

		return function(u, v) {
			var x = (u - 0.5) * width;
			var y = (v + 0.5) * height;
			var z = 0;

			return new THREE.Vector3(x, y, z);
		};
	}

	function InitThreeGeometry() {
		// cloth material
		var clothTexture = THREE.ImageUtils.loadTexture( exp.texturePath + 'circuit_pattern.png' );
		clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
		clothTexture.anisotropy = 16;

		var clothMaterial = new THREE.MeshPhongMaterial( { alphaTest: 0.5, color: 0xffffff, specular: 0x030303, emissive: 0x111111, shiness: 10, map: clothTexture, side: THREE.DoubleSide } );

		// cloth geometry
		exp.sheetGeometry = new THREE.ParametricGeometry( sheetFunction, exp.n, exp.n );
		exp.sheetGeometry.dynamic = true;
		exp.sheetGeometry.computeFaceNormals();
		
		var uniforms = { texture:  { type: "t", value: clothTexture } };
		var vertexShader = document.getElementById( 'vertexShaderDepth' ).textContent;
		var fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

		// cloth mesh

		var object = new THREE.Mesh( exp.sheetGeometry, clothMaterial );
		object.position.set( 0, 0, 0 );
		object.castShadow = true;
		object.receiveShadow = true;
		exp.three.scene.add( object );

		object.customDepthMaterial = new THREE.ShaderMaterial( { uniforms: uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader } );
	}

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

		return [particles, fixedPoints, springs];
	}

	var init = InitSystem();
	// This is down here because function calls need to come after definitions.
	exp.system = new ss.System(init[0], init[1], init[2], exp.DAMPING);
	var driveTime = 0;
	exp.system.addSpringForces();

	exp.reset = function () {
		init = InitSystem();
		InitThreeGeometry();
		exp.system = new ss.System(init[0], init[1], init[2], exp.DAMPING);
		exp.system.addSpringForces();
	}

	return exp;
}());