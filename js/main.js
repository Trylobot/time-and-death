// library imports (npm)
var fs = require("fs"),
	mersennetwister = require("mersennetwister"),
	gui = require("nw.gui"), win,
	Genetics = require("./js/Genetics.js"),
	// settings
	package_json, settings_json,
	// GUI (Node-Webkit gui module)
	menu, file_menu, test_menu,
	// Pixi.js
	stage, renderer, last_render_ts,
	// Textures
	textures,
	// Organisms
	organisms;

// system
Math.TAU = 2.0*Math.PI;
win = gui.Window.get();

// settings
package_json = JSON.parse( fs.readFileSync( "package.json" ));

// textures
textures = {};
textures.organism = PIXI.Texture.fromImage( "img/organism.png" );

// menus, gui
menubar = new gui.Menu({ 
	type: "menubar"
});
//----
test_menu = new gui.Menu();
test_menu.append( new gui.MenuItem({ 
	label: "Start Test", 
	click: start_test 
}));
menubar.append( new gui.MenuItem({ 
	label: "Test", 
	submenu: test_menu
}));
//----
// debug_menu = new gui.Menu();
// debug_menu.append( new gui.MenuItem({ 
// 	label: "Show Developer Tools", 
// 	click: function(){ win.showDevTools(); } 
// }));
// menubar.append( new gui.MenuItem({ 
// 	label: "Debug", 
// 	submenu: debug_menu
// }));
//----
win.menu = menubar;

function random_float( low, high ) {
	return low + mersennetwister.random()*(high - low);
}

// [Test] / [Start Test]
function start_test() {
	// free memory
	stage = null;
	organisms = [];
	// re-initialize
	stage = new PIXI.Stage( 0xffffff );
	var organism_count = 10;
	for( var i = 0; i < organism_count; i++ ) {
		var organism = new Genetics.Organism();
		var sprite = new PIXI.Sprite( textures.organism );
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
		sprite.position.x = random_float( organism.size, package_json.window.width - organism.size );
		sprite.position.y = random_float( organism.size, package_json.window.height - organism.size );
		sprite.rotation = random_float( 0, Math.TAU );
		stage.addChild( sprite );
		organism.sprite = sprite;
		organisms.push( organism );
	}
}

renderer = new PIXI.autoDetectRenderer( package_json.renderer.width, package_json.renderer.height );
document.body.appendChild( renderer.view );

////////////////////////////////////////////////////////////

// render loop - initial state
stage = new PIXI.Stage( 0x808080 );
organisms = [];
last_render_ts = Date.now() - 16; // approx. 60 FPS (simulated)

// render loop
function animate() {
	var elapsed, organism, speed, turningSpeed;
	elapsed = Date.now() - last_render_ts;
	last_render_ts += elapsed;

	requestAnimFrame( animate );
	
	// update position of each organism based on its speed; facing direction is part of sprite
	for( var i = 0; i < organisms.length; i++ ) {
		organism = organisms[i];
		organism.updateInputs( elapsed ); // "controls" - these should come from a brain
		organism.updatePosition( elapsed );
	}

	// update position of each organism such that none are outside of the world boundaries
	for( var i = 0; i < organisms.length; i++ ) {
		organism = organisms[i];
		// left side
		if( organism.sprite.position.x - organism.size < 0 )
			organism.sprite.position.x = 0 + organism.size;
		// right side
		if( organism.sprite.position.x + organism.size > package_json.renderer.width )
			organism.sprite.position.x = package_json.renderer.width - organism.size;
		// top
		if( organism.sprite.position.y - organism.size < 0 )
			organism.sprite.position.y = 0 + organism.size;
		// bottom
		if( organism.sprite.position.y + organism.size > package_json.renderer.height )
			organism.sprite.position.y = package_json.renderer.height - organism.size;

	}

	renderer.render( stage );
}
animate();

