// library imports (npm)
var fs = require("fs"),
	mersennetwister = require("mersennetwister"),
	gui = require("nw.gui"), win,
	// settings
	package_json, settings_json,
	// GUI (Node-Webkit gui module)
	menu, file_menu, test_menu,
	// Pixi.js
	stage, renderer,
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
debug_menu = new gui.Menu();
debug_menu.append( new gui.MenuItem({ 
	label: "Show Developer Tools", 
	click: function(){ win.showDevTools(); } 
}));
menubar.append( new gui.MenuItem({ 
	label: "Debug", 
	submenu: debug_menu
}));
//----
win.menu = menubar;

function random_float( low, high ) {
	return low + mersennetwister.random()*(high - low);
}

// classes
function Organism() {
	// constants
	this.size = 16;
	// properties
	this.sprite = null; // PIXI.Sprite
	this.speed = 0;
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
		var organism = new Organism();
		var sprite = new PIXI.Sprite( textures.organism );
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
		sprite.position.x = random_float( organism.size, package_json.window.width - organism.size );
		sprite.position.y = random_float( organism.size, package_json.window.height - organism.size );
		sprite.rotation = random_float( 0, Math.TAU );
		stage.addChild( sprite );
		organism.sprite = sprite;
		organism.speed = 1.0;
		organisms.push( organism );
	}
}

renderer = new PIXI.autoDetectRenderer( package_json.renderer.width, package_json.renderer.height );
document.body.appendChild( renderer.view );

////////////////////////////////////////////////////////////

// render loop - initial state
stage = new PIXI.Stage( 0x808080 );
organisms = [];

// render loop
function animate() {
	var organism;
	requestAnimFrame( animate );
	
	// update position of each organism based on its speed; facing direction is part of sprite
	for( var i = 0; i < organisms.length; i++ ) {
		organism = organisms[i];
		organism.sprite.position.x += organism.speed * Math.cos( organism.sprite.rotation );
		organism.sprite.position.y += organism.speed * Math.sin( organism.sprite.rotation );
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

