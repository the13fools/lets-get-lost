rippleInit = (function () {

	var exp = {};
	exp.curvature = 1.5;

	exp.n = 100; // number of nodes

	exp.MASS = 1; // kg
	exp.springRestDistance = Math.sin(Math.PI * 2 / (exp.n)); // m
	exp.springConstant = 10000; // Newton / meter

	exp.DAMPING = 0.01;

	exp.lowerBound = .05;
	exp.upperBound = 10; 


	exp.rippleGeometry;

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
				Math.sin(i) / 1000 + .1, 
				exp.MASS));
		}

		// wire up the wave
		for (i = 0; i < exp.n; i ++) {
			springs.push(new ss.Spring(
				particles[i],
				particles[(i + 1) % exp.n],
				exp.springRestDistance * exp.curvature, 
				exp.springConstant,
				exp.lowerBound,
				exp.upperBound));

			springs.push(new ss.Spring(
				particles[i],
				fixedPoints[0],
				1, 
				exp.springConstant * 10,
				.001,
				1.3));
		}

		return [particles, fixedPoints, springs];
	}

	exp.reset = function () {
		init = InitSystem();

		exp.system = new ss.System(init[0], init[1], init[2], exp.DAMPING);
		rippleSim.system = exp.system;
		exp.system.addSpringForces();
		if (rippleThree) {
			var ripple = rippleThree.scene.getObjectByName("ripple")
			rippleThree.scene.remove( ripple );
			InitThreeGeometry();
		}
	}

	function InitThreeGeometry() {
		// cloth material
		var clothTexture = THREE.ImageUtils.loadTexture( rippleTexturePath + 'circuit_pattern.png' );
		clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
		clothTexture.anisotropy = 16;

			var clothMaterial = new THREE.MeshPhongMaterial( { alphaTest: 0.5, color: colors[1], specular: 0x030303, emissive: 0x111111, shiness: 10, map: clothTexture, side: THREE.DoubleSide } );

		// cloth geometry

		var radius = 50;
		var segments = 32;

//		exp.rippleGeometry = new THREE.ParametricGeometry( rippleFunction, exp.n - 1, exp.n -1 );
		exp.rippleGeometry = new THREE.CircleGeometry( radius, exp.n );
		exp.rippleGeometry.dynamic = true;
		exp.rippleGeometry.computeFaceNormals();

		var uniforms = { texture:  { type: "t", value: clothTexture } };
		var vertexShader = document.getElementById( 'vertexShaderDepth' ).textContent;
		var fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

		// cloth mesh

		var obj = new THREE.Mesh( exp.rippleGeometry, clothMaterial );
		obj.position.set( 0, 0, 0 );
		obj.castShadow = true;
		obj.receiveShadow = true;
		this.rippleThree.scene.add( obj );

		obj.customDepthMaterial = new THREE.ShaderMaterial( { uniforms: uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader } );
		obj.name = "ripple";
	}

	return exp;
}());