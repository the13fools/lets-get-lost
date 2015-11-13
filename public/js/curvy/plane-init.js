planeInit = (function () {

	var exp = {};
	exp.curvature = 1.5;

	exp.n = 10; // number of nodes

	exp.MASS = 1; // kg
	exp.springRestDistance = Math.sin(Math.PI * 2 / (exp.n)); // m
	exp.springConstant = 10000; // Newton / meter

	exp.DAMPING = 0.01;

	exp.lowerBound = .05;
	exp.upperBound = 10; 


	exp.planeGeometry;

	var ss = SpringSystem;

	function InitSystem() {
		var particles = [];
		var fixedPoints = [];
		var springs = [];

		fixedPoints.push(new ss.Particle(0, 0, 0, exp.MASS));
		var coordinates = [];

		for (i = 1; i <= exp.n; i++) {
			var coord = [Math.random(), Math.random()];
			coordinates.push(coord);
			particles.push(new ss.Particle(
				coord[0], 
				coord[1], 
				0, 
				exp.MASS));
		}

		var triangulation = Delaunay.triangulate(coordinates);
		var distance = function(a, b) {
			var xDist = coordinates[a][0] - coordinates[b][0];
			var yDist = coordinates[a][1] - coordinates[b][1];
			return Math.sqrt(xDist * xDist + yDist * yDist);
		}

		for (var i = 0; i < triangulation.length / 3; i++) {
			var triangle = [triangulation[i * 3], 
							triangulation[i * 3 + 1], 
							triangulation[i * 3 + 2]] ;

			for (var j = 0; j < 3; j++) {
				springs.push(new ss.Spring(
					particles[triangle[j]],
					particles[triangle[(j + 1) % 3]],
					distance(triangle[j], triangle[(j + 1) % 3]) * 1.1, 
					exp.springConstant,
					exp.lowerBound,
					exp.upperBound));
			}
		}

		// Delaunay

		// // wire up the wave
		// for (i = 0; i < exp.n; i ++) {
		// 	springs.push(new ss.Spring(
		// 		particles[i],
		// 		particles[(i + 1) % exp.n],
		// 		exp.springRestDistance * exp.curvature, 
		// 		exp.springConstant,
		// 		exp.lowerBound,
		// 		exp.upperBound));

		// 	springs.push(new ss.Spring(
		// 		particles[i],
		// 		fixedPoints[0],
		// 		1, 
		// 		exp.springConstant * 10,
		// 		.001,
		// 		1.3));
		// }

		return [particles, fixedPoints, springs];
	}

	exp.reset = function () {
		init = InitSystem();

		exp.system = new ss.System(init[0], init[1], init[2], exp.DAMPING);
		planeSim.system = exp.system;
		exp.system.addSpringForces();
		if (planeThree) {
			var plane = planeThree.scene.getObjectByName("plane")
			planeThree.scene.remove( plane );
			InitThreeGeometry();
		}
	}

	function InitThreeGeometry() {
		// cloth material
		var clothTexture = THREE.ImageUtils.loadTexture( planeTexturePath + 'circuit_pattern.png' );
		clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
		clothTexture.anisotropy = 16;

			var clothMaterial = new THREE.MeshPhongMaterial( { alphaTest: 0.5, color: colors[1], specular: 0x030303, emissive: 0x111111, shiness: 10, map: clothTexture, side: THREE.DoubleSide } );

		// cloth geometry

		var radius = 50;
		var segments = 32;

//		exp.planeGeometry = new THREE.ParametricGeometry( planeFunction, exp.n - 1, exp.n -1 );
		exp.planeGeometry = new THREE.CircleGeometry( radius, exp.n );
		exp.planeGeometry.dynamic = true;
		exp.planeGeometry.computeFaceNormals();

		var uniforms = { texture:  { type: "t", value: clothTexture } };
		var vertexShader = document.getElementById( 'vertexShaderDepth' ).textContent;
		var fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

		// cloth mesh

		var obj = new THREE.Mesh( exp.planeGeometry, clothMaterial );
		obj.position.set( 0, 0, 0 );
		obj.castShadow = true;
		obj.receiveShadow = true;
		this.planeThree.scene.add( obj );

		obj.customDepthMaterial = new THREE.ShaderMaterial( { uniforms: uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader } );
		obj.name = "plane";
	}

	return exp;
}());