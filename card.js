goog.provide('klondike.Card');

goog.require('lime.Sprite');
goog.require('lime.fill.Frame');

klondike.Card = function(image, width, height, suit, value) {
	goog.base(this);
	this.setAnchorPoint(0, 0);
	this.setSize(width, height);
	this.suit = suit;
	this.value = value;
	this.isFaceUp = true;
	
	// Create sprite from image
	this.frame = new lime.fill.Frame(
			image, 
			value * (klondike.CARD_WIDTH-1),
			suit * klondike.CARD_HEIGHT, 
			klondike.CARD_WIDTH, klondike.CARD_HEIGHT);
	// Create background sprite from image
	this.bgframe = new lime.fill.Frame(
			image,
			0 * (klondike.CARD_WIDTH-1),
			4 * klondike.CARD_HEIGHT, 
			klondike.CARD_WIDTH, klondike.CARD_HEIGHT);
	this.setFill(this.frame);
};
goog.inherits(klondike.Card, lime.Sprite);

klondike.Card.suits = new Array("C","H","S","D");
klondike.Card.values = new Array("A", "2", "3", "4", "5", "6", "7",
		"8", "9", "10", "J", "Q", "K");

klondike.Card.prototype.toString = function() {
	return klondike.Card.suits[this.suit] + klondike.Card.values[this.value];
};

klondike.Card.prototype.SetStack = function(stack) {
	this.stack = stack;
};

klondike.Card.prototype.flip = function(stack) {
	this.isFaceUp = this.isFaceUp ? false : true;
	if (this.isFaceUp) {
		this.setFill(this.frame);
	} else {
		this.setFill(this.bgframe);
	}
};

/**
 * Move the card to a given stack with animation.
 * @param {klondike.Stack} stack The stack to move to.
 */
klondike.Card.prototype.MoveToStack = function(stack) {
	// Calculate new place and move
	this.runAction(new lime.animation
		.MoveTo(goog.math.Coordinate.sum(
				stack.getPosition(),
				new goog.math.Coordinate(10, 10 + stack.Size() * klondike.STACK_GAP)
			)
		)
		.setDuration(0.3));

	// Store the relation
	stack.AddCard(this);
	this.SetStack(stack);
};

/**
 * Return a new card.
 * @param suit Suit of the card.
 * @param value Value of the card.
 * @returns {klondike.Card}
 */
klondike.Card.MakeCard = function(suit, value) {
	var card = new klondike.Card(
			klondike.CARD_IMAGE,
			100,
			140, 
			suit,
			value);
	goog.events.listen(card, ['mousedown','touchstart'], function(e){
		e.event.stopPropagation();
		
		// Is substack valid solitaire stack?
		if (!card.stack.CanMove(card)) {
			console.log("Cant move substack!");
			return;
		}
		
		// Get dragged cards
		var draggedCards = new Array();
		if (card.stack != null) {
			draggedCards = card.stack.SubStack(card);
		} else {
			draggedCards[0] = card;
		}

		// Start dragging them
		var drags = new Array();
		for(var i = 0; i < draggedCards.length; i ++) {
			drags[i] = e.startDrag(false, null, draggedCards[i]);
			// Draw the lowest card on top
			klondike.layer.setChildIndex(draggedCards[i],klondike.layer.getNumberOfChildren()-1);
		}

		// Every stack is a target:
		for (var i = 0; i < klondike.STACK_COUNT; i ++) {
			drags[0].addDropTarget(klondike.stacks[i]);
		}
		for (var i = 0; i < klondike.FOUNDATION_COUNT; i ++) {
			drags[0].addDropTarget(klondike.foundations[i]);
		}

		// Drop into target stack
		goog.events.listen(drags[0], lime.events.Drag.Event.DROP, function(e){
			// Disable default move animation
			e.stopPropagation();
			
			// Get the target stack
			var dropTarget = e.activeDropTarget;
			
			if (! dropTarget.IsValid(draggedCards)) {
				console.log("Invalid!");
				dropTarget = draggedCards[0].stack;
				console.log(klondike.log);
			} else {
				klondike.log.push(
					new klondike.LogEntry(draggedCards[0].stack,
						dropTarget,
						draggedCards[0])
				);
				console.log("Valid: "+draggedCards[0].stack.getName()+", "+draggedCards[0].toString()+" > "+dropTarget.getName());
			}
			
			// Move the cards!
			for (var i = 0; i < draggedCards.length; i ++) {
				draggedCards[i].MoveToStack(dropTarget);
			}
			
			// If a stack's top card is facing down, flip that card!
			for (var i = 0; i < klondike.STACK_COUNT; i ++) {
				if (klondike.stacks[i].Size() == 0)
					continue;
				if (!klondike.stacks[i].TopCard().isFaceUp) {
					klondike.stacks[i].TopCard().flip();
				}
			}
			
		}); // End of dropping to target stack
		
		// If not over stack
		goog.events.listen(drags[0], lime.events.Drag.Event.CANCEL, function(e){
			// Disable default move animation
			e.stopPropagation();
			
			if (draggedCards[0].stack == null)
				return;
			
			// Target is the old stack
			var dropTarget = draggedCards[0].stack;
			
			// Calculate old place and move
			for (var i = 0; i < draggedCards.length; i ++) {
				draggedCards[i].MoveToStack(dropTarget);
			}
		});
	});

	return card;
};
