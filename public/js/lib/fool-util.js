initEditor = function(id) {
	// Init ace editor
	var editor = ace.edit(id);
	editor.setTheme("ace/theme/tomorrow");
	editor.session.setMode("ace/mode/javascript");
	editor.renderer.setScrollMargin(10, 10);
	editor.setOptions({
	    // "scrollPastEnd": 0.8,
	    autoScrollEditorIntoView: true,
	    vScrollBarAlwaysVisible: false,
	    highlightSelectedWord: true

	});

	// Control buttons
	$('#' + id).parent().append(
	'<div class="editor-control">' +
		'<div class="editor-run ' + id + '">' +
			'<span class="el el-caret-right"></span> Run' +
		'</div>' +
		'<div class="editor-expand ' + id + '">' +
			'Resize <span class="el el-resize-full"></span>' +
		'</div>' +
	'</div>');

	// Connect buttons
	$( "." + id + ".editor-expand" ).click(function() {
	  	$( "#" + id ).toggleClass( "editor-big", 500, "easeOutSine" )
	  	.promise().done(function(){
	  		var dom = ace.require("ace/lib/dom");
	  		editor.resize();
	  	});
	});

	$( "." + id + ".editor-run" ).click(function() {
		eval(editor.getValue());
	});


	// Hack around wierd firefox bug.
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
	{
	     editor.on("focus", function() {
			window.scrollTo(0, $("#"+id).offset().top);
		});
	}
	
}

loadContent = function(id, contentUrl, lineNumber, initFn) {

	var editor = ace.edit(id);

	// Load content
	$.ajax({
		url: contentUrl,
		processData: false,
		cache: false
	})
	.done(function( js ) {
		editor.setValue(js);
		editor.clearSelection();
		editor.gotoLine(lineNumber);
		if (initFn) {
			initFn(); // This is a hack :(
		}
	});

}

initThree = function(id){
	var exp = {};
	container = document.getElementById(id);

	// scene

	exp.scene = new THREE.Scene();

	exp.scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

	// camera

	exp.camera = new THREE.PerspectiveCamera( 30, $('#' + id).width() / $('#' + id).height(), 1, 10000 );
	exp.camera.position.y = 50;
	exp.camera.position.z = 1500;
	exp.scene.add( exp.camera );

	// controls 
	exp.controls = new THREE.OrbitControls( exp.camera, container );

	// lights

	var light, materials;

	exp.scene.add( new THREE.AmbientLight( 0x666666 ) );

	light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
	light.position.set( 50, 200, 100 );
	light.position.multiplyScalar( 1.3 );

	light.castShadow = true;
//	light.shadowCameraVisible = true;

	light.shadowMapWidth = 1024;
	light.shadowMapHeight = 1024;

	var d = 300;

	light.shadowCameraLeft = -d;
	light.shadowCameraRight = d;
	light.shadowCameraTop = d;
	light.shadowCameraBottom = -d;

	light.shadowCameraFar = 1000;
	light.shadowDarkness = 0.5;

	exp.scene.add( light );

	exp.renderer = new THREE.WebGLRenderer( { antialias: true } );
	exp.renderer.setPixelRatio( window.devicePixelRatio );
	exp.renderer.setSize( $('#' + id).width(), $('#' + id).height() );
	exp.renderer.setClearColor( exp.scene.fog.color );

	container.appendChild( exp.renderer.domElement );

	exp.renderer.gammaInput = true;
	exp.renderer.gammaOutput = true;

	exp.renderer.shadowMapEnabled = true;

	//

	// stats = new Stats();
	// container.appendChild( stats.domElement );

	//

	var onWindowResize = function() {

				exp.camera.aspect = $('#' + id).width() / $('#' + id).height();
				exp.camera.updateProjectionMatrix();

				exp.renderer.setSize( $('#' + id).width(), $('#' + id).height() );

			}


	window.addEventListener( 'resize', onWindowResize, false );

	return exp;
}


// not awesome.
assert = function (condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
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
