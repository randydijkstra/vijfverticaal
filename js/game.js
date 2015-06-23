var gameTimer;
var gameSeconds_State1 = 0;
var gameWordToFind_State1 = "";
var gameWordsCorrect_State1 = 0;
var correctWordsBeforeStateChange_State1 = 20;

$(document).on('ready', function() {
	
	if ($('#score-board').length > 0) {	
		initGame();
	}
	
});

function stripWord(word) {

	word = $.trim(word);

	word = word.replace("'", '');
	word = word.replace("'", '');
	word = word.replace('.', '');
	word = word.replace('.', '');
	word = word.replace(',', '');
	word = word.replace(',', '');
	word = word.replace(':', '');
	word = word.replace(':', '');
	word = word.replace('\'', '');
	word = word.replace('\'', '');
	word = word.replace('"', '');
	word = word.replace('"', '');
	word = word.replace('*', '');
	
	return $.trim(word).toLowerCase();		
	
}

function getRandomWord() {
	
	var wordSelector = $('.isGameWord'); 	
	var randomInt = Math.floor(Math.random() * wordSelector.length);	
	var getWordElement = wordSelector.eq(randomInt);
	
	var wordToPlay = getWordElement.attr('data-word');
	
	gameWordToFind_State1 = wordToPlay;
	
	return wordToPlay;
	
}

function getRandomWord_State1() {
	
	var word = getRandomWord();
		
	$('#score-board .left .wordButton').text(word);
	
	return word;
	
}

function wordClicked(word) {
	
	// State 1
	if (word == gameWordToFind_State1) {
		
		// Yes! You clicked the right word.		
		gameWordsCorrect_State1 += 1;
		
		// Get a new word to play		
		getRandomWord_State1();
		
		if (correctWordsBeforeStateChange_State1 == gameWordsCorrect_State1) {
			// Go to the next game state
			startGame(2);		
		}
		
	} else {
		
		// Wrong word clicked!
		gameSeconds_State1 = (gameSeconds_State1 + 10);
		
		// TODO: ER WORDT EEN POPUP GETOOND DAT HET WOORD FOUT IS GERADEN, ER KOMEN 10+ SECONDEN BIJ ALS STRAF.
		
	}
	// End of state 1
	
	
}

function startGame(state) {
	
	if (state == 1) {
		
		gameTimer = setInterval(extraSecond, 1000);
		
		getRandomWord_State1();
				
	} else {
		
		// Game state not found..
		console.log("Error occurred, game state not found!");
		
	}
	
}

function extraSecond() {
	
	gameSeconds_State1 = (gameSeconds_State1 + 1);
	
	var outputText = "";
	
	if (gameSeconds_State1 > 1) {
		outputText = gameSeconds_State1 + " seconden ";
	} else {
		outputText = gameSeconds_State1 + " seconde ";
	}
	
	outputText += "verstreken tijd.";
	
	$('#score-board .right .helpText').text(outputText);
	
}

function initGame() {
	
	// Add all words to a span
	$('.gameWords p, .gameWords h1').each(function( index ) {

    	var text = $(this).html().split(' '),
    	    len = text.length,
    	    result = []; 
		
    	for( var i = 0; i < len; i++ ) {
    	    result[i] = '<span class="isGameWord">' + text[i] + '</span>';
    	}
    	$(this).html(result.join(' '));		

	});
	
	// Strip all words to a good version.
	$('.isGameWord').each(function(index) {
	
		var word = $(this).text();
		var strippedWord = stripWord(word);
		
		var matches = strippedWord.match(/\d+/g);
		
		if (matches != null) {
			// Numbers in the string, don't add the word
			$(this).removeClass('isGameWord');
		} else {
			$(this).attr('data-word', strippedWord);
		}
	
	});
	
	$('.isGameWord').on('click', function(e) {		
		wordClicked($(this).attr('data-word'));		
	});
	
	// Start game state 1
	startGame(1);
	
}