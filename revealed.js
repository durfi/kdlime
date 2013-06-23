goog.provide('klondike.Revealed');

goog.require('lime.Sprite');

/**
 * Creates a new revealed cards stack.
 * @param width 
 * @param height
 * @param color The color of the stack element in #00aaff format.
 * @returns {klondike.Foundation}
 */
klondike.Revealed = function(width, height, color) {
	goog.base(this);
	this.setAnchorPoint(0, 0);
	this.setSize(width, height);
	this.setFill(color);
	this.cards = new Array();
	
	this.showDropHighlight = function(){
		this.runAction(new lime.animation.FadeTo(.2).setDuration(.3));
	};
	this.hideDropHighlight = function(){
		this.runAction(new lime.animation.FadeTo(1).setDuration(.1));
	};
		  
};
goog.inherits(klondike.Revealed, lime.Sprite);

klondike.Revealed.prototype.CanMove = function(card) {
	return true;
};

/**
 * Get name of this stack.
 * @returns {String} 
 */
klondike.Revealed.prototype.getName = function() {
	return "r";
};

/**
 * Return the top card of the stack. This doesn't remove the top card.
 * @returns {klondike.Card}
 */
klondike.Revealed.prototype.TopCard = function() {
	return this.cards[this.cards.length-1];
};

/**
 * Add card to the stack.
 * @param {klondike.Card} card
 */
klondike.Revealed.prototype.AddCard = function(card) {
	this.cards[this.cards.length] = card;
};

/**
 * Removes a given cards from the stack;
 * @param {klondike.Card} card
 */
klondike.Revealed.prototype.RemoveCard = function(card) {
	return;
};

/**
 * Return the size of the stack (the number of cards in the stack).
 * @returns
 */
klondike.Revealed.prototype.Size = function() {
	return 0;
};

klondike.Revealed.prototype.SubStack = function(card) {
	return new Array(this.cards.pop());
};