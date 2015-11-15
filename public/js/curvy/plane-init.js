planeInit = (function () {

	var exp = {};

	exp.n = 200; // number of nodes

	exp.MASS = 1; // kg
	exp.springRestDistance = Math.sin(Math.PI * 2 / (exp.n)); // m
	exp.springConstant = 10000; // Newton / meter

	exp.DAMPING = 0.01;

	exp.lowerBound = .00001;
	exp.upperBound = 3; 
	exp.controlPoints = [[.5, .5], [.1, .1]] // can add points here if you want extra control points to play with.  Just be sure to add a corresponding entry to exp.lengthMultiplier
	exp.lengthMultiplier = [.1, 2];
	exp.controlRadius = .1;
	exp.controlCount = 100;
 

	exp.planeGeometry;

	var ss = SpringSystem;
	var triangulation = [];
	var particles = [];

	function InitSystem() {
		particles = [];
		var fixedPoints = [];
		var springs = [];

		fixedPoints.push(new ss.Particle(0, 0, 0, exp.MASS));
		var coordinates = [];
		var restLenCorrection_Idx = [];

		for (var i = 1; i <= exp.n; i++) {
			var coord = [Math.random(), Math.random()];
			coordinates.push(coord);
			restLenCorrection_Idx.push(-1);
		}



		for (var i = 0; i < exp.controlPoints.length; i++) {

			// remove stray points
			for (var j = coordinates.length - 1; j >= 0; j-- ) {
				var xDist = exp.controlPoints[i][0] - coordinates[j][0];
				var yDist = exp.controlPoints[i][1] - coordinates[j][1];
				var dist = Math.sqrt(xDist * xDist + yDist * yDist);
				if (dist < exp.controlRadius) { 
					coordinates.splice(j, 1);
					restLenCorrection_Idx.splice(j, 1);
				}
			}
			coordinates.push(exp.controlPoints[i]);
			restLenCorrection_Idx.push(-1);

			// draw circle around control point
			for (var k = 0; k < exp.controlCount; k++) {
				var center = exp.controlPoints[i];
				coordinates.push(
					[Math.sin(2 * Math.PI * k / exp.controlCount) * exp.controlRadius + center[0], 
					 Math.cos(2 * Math.PI * k / exp.controlCount) * exp.controlRadius + center[1]]);
			    coordinates.push(
					[Math.sin(2 * Math.PI * k / exp.controlCount) * exp.controlRadius * 2 + center[0], 
					 Math.cos(2 * Math.PI * k / exp.controlCount) * exp.controlRadius * 2 + center[1]]);
				restLenCorrection_Idx.push(i);
				restLenCorrection_Idx.push(i);
			}
		}

		for (var i = 0; i < coordinates.length; i++) {
			var coord = coordinates[i];
			particles.push(new ss.Particle(
				coord[0], 
				coord[1], 
				Math.sin(i) / 100, 
				exp.MASS));
		}

		triangulation = Delaunay.triangulate(coordinates);

		var getRestLength = function (co1, co2) {
			var xDist = coordinates[co1][0] - coordinates[co2][0];
			var yDist = coordinates[co1][1] - coordinates[co2][1];
			var dist = Math.sqrt(xDist * xDist + yDist * yDist);
			if (restLenCorrection_Idx[co1] === restLenCorrection_Idx[co2] && 
				restLenCorrection_Idx[co1] > -1) {
				var cor_idx = restLenCorrection_Idx[co1];
				return dist * exp.lengthMultiplier[cor_idx];
			}
			return dist;
		}

		for (var i = 0; i < triangulation.length / 3; i++) {
			var triangle = [triangulation[i * 3], 
							triangulation[i * 3 + 1], 
							triangulation[i * 3 + 2]] ;

			for (var j = 0; j < 3; j++) {
				springs.push(new ss.Spring(
					particles[triangle[j]],
					particles[triangle[(j + 1) % 3]],
					getRestLength(triangle[j], triangle[(j + 1) % 3]), 
					exp.springConstant,
					exp.lowerBound,
					exp.upperBound));
			}
		}

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
		var clothTexture = THREE.ImageUtils.loadTexture( planeTexturePath + 'leaf.png' );
		var kaleTexture = THREE.ImageUtils.loadTexture( planeTexturePath + 'kale.jpg' );
		clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
		clothTexture.anisotropy = 16;

		// map:kaleTexture, 
		var clothMaterial = new THREE.MeshPhongMaterial( { alphaTest: 0.5, color: colors[0], specular: 0x030303, emissive: 0x111111, shiness: 10, alphaMap: clothTexture, side: THREE.DoubleSide } );

		// geometry


		exp.planeGeometry = new THREE.Geometry();
		for (var i = 0; i < particles.length; i++) {
			exp.planeGeometry.vertices.push(particles[i].position.clone());
		}
		for (var i = 0; i < triangulation.length / 3; i++) {
			var tri = [triangulation[i * 3], triangulation[i * 3 + 1], triangulation[i * 3 + 2]];
			exp.planeGeometry.faces.push( new THREE.Face3( tri[0], tri[1], tri[2] ) );
			exp.planeGeometry.faceVertexUvs[0].push(
					[new THREE.Vector2(particles[tri[0]].position.x % 1, particles[tri[0]].position.y % 1), 
					 new THREE.Vector2(particles[tri[1]].position.x % 1, particles[tri[1]].position.y % 1), 
					 new THREE.Vector2(particles[tri[2]].position.x % 1, particles[tri[2]].position.y % 1)]);
		}

		////////

		exp.planeGeometry.dynamic = true;
		exp.planeGeometry.computeFaceNormals();
		exp.planeGeometry.computeVertexNormals();

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