goog.provide('klondike.Deck');

/**
 * Create and init the deck.
 * @param {klondike} fc The klondike object that creates the deck.
 * @returns {klondike.Deck}
 */
klondike.Deck = function(fc) {
	this.fc = fc;
	this.cards = new Array();
	
	this.CreateCards();
};

/**
 * Create the cards. This method doesn't draw anything
 */
klondike.Deck.prototype.CreateCards = function() {
	var i = 0;
	for (var suit = 0; suit < 4; suit ++) {
		for (var value = 0; value < 13; value ++) {
			this.cards[i++] = new klondike.Card.MakeCard(suit, value);
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

/**
 * Deal the cards to the table stacks.
 */
klondike.Deck.prototype.Deal = function() {
	for (var i = 0; i < this.cards.length; i ++) {
		this.cards[i].setPosition(10, 10);
		this.fc.layer.appendChild(this.cards[i]);
		
		this.cards[i].MoveToStack(this.fc.stacks[i%this.fc.stacks.length]);
	}
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x){};
  return o;
};