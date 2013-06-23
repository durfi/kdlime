goog.provide('klondike.Deck');

goog.require('lime.Sprite');
/**
 * Create and init the deck.
 * @param {klondike} fc The klondike object that creates the deck.
 * @returns {klondike.Deck}
 */
klondike.Deck = function(fc, color, width, height) {
	goog.base(this);
	
	/*
	 * Set background color, siza and draw on table
	 */
	this.setAnchorPoint(0, 0);
	this.setSize(width, height);
	this.setFill(color);
	
	/*
	 * This inidicates that this is the deck stack
	 */
	this.number = -1;
	
	this.fc = fc;
	
	/*
	 * Cards currently in the deck
	 */
	this.cards = new Array();
	
	/*
	 * All cards on the table
	 */
	this.allcards = new Array();
	
	/*
	 * Listen for clicks when cards ran out
	 */
	goog.events.listen(this, ['mousedown','touchstart'], function(e){
		e.event.stopPropagation();
		console.log("Cards in deck: " + this.cards);
		console.log(fc.revealed.cards.length);
		if (this.cards.length == 0) {
			while(fc.revealed.cards.length > 0) {
				var card = fc.revealed.cards.pop();
				card.flip();
				klondike.layer.setChildIndex(card,klondike.layer.getNumberOfChildren()-1);
				card.MoveToStack(this);
			}
		}
	});
};
goog.inherits(klondike.Deck, lime.Sprite);

/**
 * Create the cards. This method doesn't draw anything
 */
klondike.Deck.prototype.CreateCards = function() {
	this.cards = new Array();
	var i = 0;
	for (var suit = 0; suit < 4; suit ++) {
		for (var value = 0; value < 13; value ++) {
			var card = new klondike.Card.MakeCard(suit, value);
			card.SetStack(this);
			this.cards[i] = card;
			this.allcards[i++] = card;
		}
	}
};

/**
 * Shuffle the deck with the given random seed;
 * @param seed
 */
klondike.Deck.prototype.Shuffle = function(seed) {
	this.cards = shuffle(this.cards);
	// TODO: seeding!!!
};

klondike.Deck.prototype.Size = function() {
	return 0;
};

klondike.Deck.prototype.AddCard = function(card) {
	this.cards[this.cards.length] = card;
};
/**
 * Removes a given cards from the deck;
 * @param {klondike.Card} card
 */
klondike.Deck.prototype.RemoveCard = function(card) {
	if (this.cards.indexOf(card) < 0)
		return;
	
	this.cards.splice(this.cards.indexOf(card), 1);
};

/**
 * Return the top card of the stack. This doesn't remove the top card.
 * @returns {klondike.Card}
 */
klondike.Deck.prototype.TopCard = function() {
	return this.cards[this.cards.length-1];
};

/**
 * Deal the cards to the table stacks.
 */
klondike.Deck.prototype.Deal = function() {
	for (var i = 0; i < klondike.STACK_COUNT; i ++) {
		for (var j = 0; j <= i; j ++) {
			var card = this.cards.pop();
			if (i != j) {
				card.flip();
			}
			card.setPosition(10, 20);
			this.fc.layer.appendChild(card);
			card.MoveToStack(this.fc.stacks[i]);
		}
	}
	console.log("Cards after table: " + this.cards);
	for (var cardNum = 0; cardNum < this.cards.length; cardNum ++) {
		this.cards[cardNum].setFaceUp(false);
		this.cards[cardNum].setPosition(10, 20);
		this.fc.layer.appendChild(this.cards[cardNum]);
	}

};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x){};
  return o;
};