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
		console.log('run');
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

loadContent = function(id, contentUrl, lineNumber) {

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
	});

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
