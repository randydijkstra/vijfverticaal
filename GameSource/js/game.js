var gameTimer;
var messageTimer;
// Hierboven zijn algemene timers, niks aan doen.

// State 1 variables
var gameSeconds_State1 = 0; // Hoeveel seconden zijn er momenteel verstreken
var gameWordToFind_State1 = ""; // Het wordt dat de speler op 'dit' moment aan het zoeken is.
var gameWordsCorrect_State1 = 0; // Hoeveel woorden zijn er correct geraden
var correctWordsBeforeStateChange_State1 = 20; // Woorden die goed moeten worden geraden voordat state 2 begint
var wordArray_State1 = new Array(); // Array bevat alle 'geraden' woorden
var animationTimer_State1; // Niks aan doen, is een var om de timer later te cancelen

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
	word = word.replace('?', '');
	word = word.replace('!', '');

	word = word.replace('(', '');
	word = word.replace(')', '');
	
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

function wordClicked(event, element, word) {
	
	// State 1
	if (word == gameWordToFind_State1) {
		
		// Yes! You clicked the right word.		
		gameWordsCorrect_State1 += 1;
		
		// Get a new word to play		
		getRandomWord_State1();
		
		wordArray_State1.push(word);
		
		if (correctWordsBeforeStateChange_State1 == gameWordsCorrect_State1) {
			// Go to the next game state
			startGame(2);		
		}
		
	} else {
		
		clearTimeout(animationTimer_State1);
		
		$('#animationHolder').html('<img />');
		$('#animationHolder').show().css("top", (event.pageY - 35)).css("left", (event.pageX - 50));		
		$('#animationHolder img').attr('src', 'images/fireball.gif');
		
		animationTimer_State1 = setTimeout(function() {
			$('#animationHolder').hide().html('');
		}, 500);
		
		// Wrong word clicked!
		gameSeconds_State1 = (gameSeconds_State1 + 10);
		
		// TODO: ER WORDT EEN POPUP GETOOND DAT HET WOORD FOUT IS GERADEN, ER KOMEN 10+ SECONDEN BIJ ALS STRAF.
		showMessage("Fout! +10 seconden")
		
	}
	// End of state 1
	
	
	// TODO state 2 here?
	
}

function showMessage(message) {
	
	clearTimeout(messageTimer);
	
	var messageElement = $('#messageHolder');
	
	messageElement.removeClass('animation').text(message);
	
	var messageHeight = messageElement.height();
	messageElement.css('top', ((parseInt($(window).height()) / 2) - ((parseInt(messageHeight) + 40) / 2)));
	
	messageElement.show().addClass('animation');
	
	messageTimer = setTimeout(function() {
		messageElement.text('').hide();
	}, 2600);
	
}

function startGame(state) {
	
	if (state == 1) {
		
		gameTimer = setInterval(extraSecond, 1000);
		
		getRandomWord_State1();
		
	} else if (state == 2) {
		
		// TODO: STATE 2 VAN DE GAME, WOORDEN DOOR DE GAMEENGINE HALEN EN WOORDEN DIE OVERBLIJVEN REPLACEN MET SELECTIEVAKKEN
		
		// ALLE GERADEN WOORDEN STAAN IN: wordArray_State1
		// Strafseconden staan in: gameSeconds_State1
		
		alert("Je bent in state 2 van de game beland!");
				
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
	
	outputText += "verstreken tijd";	
	outputText += "<br />";
	outputText += gameWordsCorrect_State1 + " woord(en) goed geraden";
	
	$('#score-board .right .helpText').html(outputText);
	
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
		} else if (strippedWord.length < 4) {
			// Word is too short, don't add the word
			$(this).removeClass('isGameWord');
		} else if ($(this).html().indexOf('<br>') > -1) {
			// This word is on the end of a line, don't add the word
			$(this).removeClass('isGameWord');			
		} else {
			$(this).attr('data-word', strippedWord);
		}
	
	});
	
	// Kinda ugly code, but it will prevent users from searching the website for words.
	var items = [".", "#", "@", "%", "*", "ˆ"]
	$('.isGameWord').each(function(index) {	
			
		var word = $(this).text();	
		var wordToAdd = "";		
		
		for(var i = 0; i < word.length; i++) {
					
			var randomItem = items[Math.floor(Math.random()*items.length)]
			wordToAdd += word[i] + "<span style=\"position:absolute; left:-9999px;\">" + randomItem + "</span>";
					
		}		
		$(this).html(wordToAdd);		
	});
	
	$('.isGameWord').on('click', function(e) {		
		wordClicked(e, $(this), $(this).attr('data-word'));		
	});
	
	// Start game state 1
	startGame(1);
	
}