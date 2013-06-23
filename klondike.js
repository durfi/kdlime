//set main namespace
goog.provide('klondike');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Label');
goog.require('lime.GlossyButton');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('klondike.Stack');
goog.require('klondike.Card');
goog.require('klondike.Deck');
goog.require('klondike.Foundation');
goog.require('klondike.LogEntry');

klondike.WIDTH = 1280;
klondike.HEIGHT = 768;

klondike.STACK_COUNT = 8;
klondike.STACK_COLOR = '#007000';
klondike.STACK_GAP = 30;

klondike.FOUNDATION_COUNT = 4;
klondike.FOUNDATION_COLOR = '#00b000';

klondike.CARD_WIDTH = 224;
klondike.CARD_HEIGHT = 313;

klondike.CARD_SUITS = {
		CLUBS 	: 	0,
		DIAMONDS:	1,
		HEARTS	:	2,
		SPADES	:	3
};

klondike.CARD_IMAGE = 'assets/cards2.png';

klondike.callNewGame = function() {
	klondike.newGame();
};

klondike.log = new Array();

// entry point
klondike.start = function(){
	// M3W
	var director;
	if (typeof m3w === 'object') {
		// Running in framework environment
		m3w.events.setCallback('start',klondike.callNewGame);
		director = new lime.Director(m3w.container, klondike.WIDTH, klondike.HEIGHT);
		$(m3w.container).css('background-color', '#008300');
	} else {
		// Standalone version -- without framework
		director = new lime.Director(document.body, klondike.WIDTH, klondike.HEIGHT);
	}
	
	director.makeMobileWebAppCapable();
	// director.setDisplayFPS(false);
	
	// Create loading scene
	var loadingScene = new lime.Scene;
	var loadingLabel = new lime.Label().setSize(klondike.WIDTH, 80)
		.setText('Loading game...')
		.setFontSize(80)
		.setFontColor("#fff")
		.setAlign("center")
		.setPosition(klondike.WIDTH / 2, klondike.HEIGHT / 2);
	loadingScene.appendChild(loadingLabel);
	

	// Create game scene
	var gameScene = new lime.Scene;
	this.layer = new lime.Layer().setPosition(10, 0);
	gameScene.appendChild(this.layer);
	
	// Create the buttons
	this.btnNewGame = new lime.GlossyButton("Új játék").setSize(120, 40).setPosition(1180, 740);
	goog.events.listen(this.btnNewGame,'click',function(e){
	    klondike.newGame();
	});
	this.layer.appendChild(this.btnNewGame);
	this.btnUndo = new lime.GlossyButton("Visszavonás").setSize(120, 40).setPosition(1040, 740);
	goog.events.listen(this.btnUndo,'click',function(e){
	    klondike.undo();
	});
	this.layer.appendChild(this.btnUndo);
	
	// Create the stacks
	this.stacks = new Array();
	for (var i = 0; i < klondike.STACK_COUNT; i ++) {
		this.stacks[i] = new klondike.Stack(i, 120, 500, klondike.STACK_COLOR)
			.setPosition(i * 150, 200);
		this.layer.appendChild(this.stacks[i]);
	}
	
	// Create the foundations
	this.foundations = new Array();
	for (var i = 0; i < klondike.FOUNDATION_COUNT; i ++) {
		this.foundations[i] = new klondike.Foundation(i, 120, 160, klondike.FOUNDATION_COLOR)
			.setPosition((i+4)*150, 10);
		this.layer.appendChild(this.foundations[i]);
	}
	
	// Start a new game
	klondike.newGame();
	
	// Loading scene while loading image
	var img = new lime.fill.Image(klondike.CARD_IMAGE);
	if (! img.isLoaded) {
		director.replaceScene(loadingScene);
		goog.events.listen(img, goog.events.EventType.LOAD, function() {
			console.log("Image loaded.");
			director.replaceScene(gameScene);
		});
	} else {
		director.replaceScene(gameScene);
	}

};

/**
 * Undo last move
 */
klondike.undo = function () {
	if (this.undoLog == null) 
		return;
	if (this.undoLog.length == 0)
		return;
	
	var lastMove = this.undoLog.pop();
	var cards = lastMove.to.SubStack(lastMove.card);
	
	// Move the cards!
	for (var i = 0; i < cards.length; i ++) {
		this.layer.setChildIndex(cards[i],this.layer.getNumberOfChildren()-1);
		cards[i].MoveToStack(lastMove.from);
	}
};

/**
 * Start new game.
 */
klondike.newGame = function () {
	// Create the log
	this.undoLog = new Array();
	
	// Create the stacks
	for (var i = 0; i < klondike.STACK_COUNT; i ++) {
		this.stacks[i].cards = new Array();
	}
	
	// Create the foundations
	for (var i = 0; i < klondike.FOUNDATION_COUNT; i ++) {
		this.foundations[i].cards = new Array();
	}
	
	// If this isn't the first game, delete the previous cards.
	if (this.deck != null) {
		for (var i = 0; i < this.deck.cards.length; i ++) {
			this.layer.removeChild(this.deck.cards[i]);
		}
	}
	
	// Create, shuffle and deal the deck
	this.deck = new klondike.Deck(this);
	this.deck.Shuffle();
	this.deck.Deal();
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('klondike.start', klondike.start);
