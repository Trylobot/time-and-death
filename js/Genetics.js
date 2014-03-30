
exports.Organism = function() {
	// constants
	this.size = 15.0; // radius, pixels
	// properties
	this.sprite = null; // PIXI.Sprite instance
	this.speed = 0.0; // pixels per millisecond
	this.turningSpeed = 0.0; // radians per millisecond

	this.updateInputs = function( elapsed_ms ) {
		this.speed = 50.0 / 1000.0; // one pixel per second
		this.turningSpeed = 1.0 / 1000.0; // one-tenth radians per second
	}

	this.updatePosition = function( elapsed_ms ) {
		this.sprite.position.x += elapsed_ms * this.speed * Math.cos( this.sprite.rotation );
		this.sprite.position.y += elapsed_ms * this.speed * Math.sin( this.sprite.rotation );
		this.sprite.rotation += elapsed_ms * this.turningSpeed;
	}
}

