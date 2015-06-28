//Declare the global GameEngine helper
var gEngine = new GameEngine();

var gameState;
var gameTimer;
var messageTimer;
// Hierboven zijn algemene timers, niks aan doen.

// State 1 variables
var searchGameWordTries = 0; //search random word tries om infinite loop te voorkomen.
var gameSeconds_State1 = 0; // Hoeveel seconden zijn er momenteel verstreken
var gameWordToFind_State1 = ""; // Het woord dat de speler op 'dit' moment aan het zoeken is.
var gameWordToFind_State2 = ""; // Het woord dat de speler op 'dit' moment aan het zoeken is.
var gameWordsCorrect_State1 = 0; // Hoeveel woorden zijn er correct geraden
var gameWordsCorrect_State2 = 0; // Hoeveel woorden zijn er correct geraden
var gameWordsWrong_State2 = 0; // Hoeveel woorden zijn er correct geraden
var correctWordsBeforeStateChange_State1 = 5; // Woorden die goed moeten worden geraden voordat state 2 begint
var wordArray_State1 = new Array(); // Array bevat alle 'geraden' woorden
var guessCounter = 0;
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
	word = word.replace('#', '');
	word = word.replace('&', '');
	word = word.replace('%', '');
	word = word.replace('(', '');
	word = word.replace(')', '');
	
	return $.trim(word).toLowerCase();		
	
}

function putWordInScoreboard(word){
	console.log("random word = " +word)
	$('#score-board .left .wordButton').text(word);
}

function getRandomWord() {
	
	var wordSelector = $('.isGameWord'); 	
	var randomInt = Math.floor(Math.random() * wordSelector.length);	
	var getWordElement = wordSelector.eq(randomInt);
	var wordToPlay = getWordElement.attr('data-word');
	console.log("word to check: "+wordToPlay)
	
	gEngine.run([wordToPlay], function(data){
		
		$('#score-board .left .wordButton').text('Woord laden..');
		clearInterval(gameTimer);
		
		var result = "";
		$.each(data, function(i, value){
  			//console.log('index: ' + i + ',value: ' + value);
  			if(value.hasSynonyms == true){
  				console.log("hasSynonyms == true");
  				//console.log("synonyms.length = "+value.synonyms.length);
  				if (value.synonyms.length > 1) {
  					console.log("2 or more synonyms. Continue.");
  					if ($.inArray(wordToPlay, wordArray_State1) == -1)
					{
						searchGameWordTries = 0;
						gameWordToFind_State1 = wordToPlay;
						//console.log("Word to play in arraycheck: "+wordToPlay);
						result = wordToPlay;
				 	}else{
				 		if(searchGameWordTries > 50){
				 			console.log("Cant find new word :(");
				 			alert('Helaas, dit artikel is niet speelbaar...');
				 			//result = false;
				 		}else{
							searchGameWordTries += 1;
							result = "retryOnceAgain";
				 		}
				 	}
  				}else{
  					console.log("not 2 or more synonyms. Retry.");
  					result = "retryOnceAgain";
  				}
  			}else if(value.hasSynonyms == false){
  				console.log("hasSynonyms == false");
  				result = "retryOnceAgain";
  			}
		});
		console.log("reslt = "+result);
		//wordToPlay = result;
		if(result == false){
			//stuff should break here
			console.log("Word =="+result);
			//alert('Er is iets mis gegaan, probeer het later nog eens..');
			getRandomWord();
		} else if(result == "retryOnceAgain"){
			console.log("word should be retryOnceAgain, is: "+result);
			getRandomWord();
		} else{
			
			gameTimer = setInterval(extraSecond, 1000);
			
			putWordInScoreboard(result);
			
		}
	});

//	return word;
}

function getRandomWord_State1() {
	var word = getRandomWord();

	if(word == false){
		//stuff should break here
		console.log("Word =="+word);
	}else if(word == "retryOnceAgain"){
		console.log("word should be retryOnceAgain, is: "+word);
		getRandomWord_State1();
	}
	else{
		console.log("random word = " +word)
		$('#score-board .left .wordButton').text(word);
		return word;
	}		
}



function wordClicked(event, element, word) {
	
	// State 1
	if (gameState == 1) {
		if (word == gameWordToFind_State1) {
		
			element.addClass("goodGuess");
			
			// Yes! You clicked the right word.		
			gameWordsCorrect_State1 += 1;
			
			// Get a new word to play		
			wordArray_State1.push(word);
			
			if (correctWordsBeforeStateChange_State1 == gameWordsCorrect_State1) {
				// Go to the next game state
				startGame(2);		
			}else{
				getRandomWord();
			}
			
			showMessage("Goed gedaan!", "green");
			
		} else {
			
			element.addClass("wrongGuess");
			
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
			showMessage("Fout! +10 seconden", "#970306")
			
		}	// End of state 1
	}else if(gameState == 2){
		//check if word is playable
		console.log(element);
		console.log(word);
		if (element.hasClass('goodGuess')){
			console.log('Has goodGuess class!');

			//TODO onderstaande ombouwen naar array die checkt of woord al gebruikt is ;)

			if(element.hasClass('s2goodGuess') || element.hasClass('s2wrongGuess')){
				console.log("Already guessed this word");
			}else{
				if ($.inArray(word, wordArray_State1) != -1){
					console.log("word in click: "+word)
					newTurn(word);
				}
			}
		}else if (element.hasClass('option')) {
			if(element.text() == gameWordToFind_State2){
				console.log("corrent :)");
				showMessage("Correct!", "green");
				gameWordsCorrect_State2 += 1;

				$('.goodGuess').each(function(index) {
					var ggElement = $(this);
					var word = ggElement.attr('data-word');
					console.log("Word to be edited: "+word);		
					
					if (word == gameWordToFind_State2) {
						ggElement.addClass('s2goodGuess');
						ggElement.css("color", "#FFFFFF");
//						ggElement.removeClass('.goodGuess');
					}
				});
				//element.addClass('s2goodGuess');
			}else{
				showMessage("Helaas... fout!", "#970306");
				$('.goodGuess').each(function(index) {
					var ggElement = $(this);
					var word = ggElement.attr('data-word');
					console.log("Word to be edited: "+word);		
					
					if (word == gameWordToFind_State2) {
						ggElement.addClass('s2wrongGuess');
						ggElement.css("color", "#FFFFFF");
					}
				});
				gameWordsWrong_State2 += 1;
			}
			$('#state2').fadeOut();
			console.log(gameWordsCorrect_State2);
			console.log(gameWordsWrong_State2);
			if((gameWordsCorrect_State2 + gameWordsWrong_State2) >= correctWordsBeforeStateChange_State1){
				startGame(3);
			} 
		} 
	}	// End of state 2
}


/*
* 	----- State 2 stuff here -----
*/
function getWordFromWordArray(currentTurn){//DEPRECATED
	return wordArray_State1[(currentTurn-1)];
}

function shuffleArray(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function appendToOptions(word){
	var arrayOfWords = new Array();
	var arrayOfSynonyms = new Array();
	var wordToGuess = word;
	console.log("wordToGuess = " + wordToGuess);
	gameWordToFind_State2 = wordToGuess;

	if(typeof wordToGuess === "string"){//Check if word is actually a string
		//console.log("Running engine...");
		gEngine.run([wordToGuess], function(data){
			//console.log(data);
			$.each(data, function(i, value){
	  			console.log('index: ' + i + ',value: ' + value);
	  			if(value.hasSynonyms == true){
	  				console.log("hasSynonyms == true");
	  				$.each(value.synonyms, function(index, synonym){
	  					//console.log("Current synonym: "+synonym);
	  					arrayOfSynonyms.push(stripWord(synonym));
	  					console.log(arrayOfSynonyms);
	  				});
	  				shuffleArray(arrayOfSynonyms);
	  				arrayOfWords.push(wordToGuess);
	  				for (var i = 0; i < arrayOfSynonyms.length; i++) {
	  					if(arrayOfSynonyms[i] != undefined){
		  					arrayOfWords.push(arrayOfSynonyms[i]);
	  					}
	  					if(arrayOfWords.length == 3){break;}
	  				}
	  				console.log(arrayOfWords);
	  				if(arrayOfWords.length < 3){
	  					//newTurn();
	  				}else{
		  				shuffleArray(arrayOfWords);
	  					console.log(arrayOfWords);
	  					$('#option1').text(arrayOfWords[0]);
	  					$('#option2').text(arrayOfWords[1]);
	  					$('#option3').text(arrayOfWords[2]);
  						$('#state2').fadeIn();
	  				}
	  			}else if(value.hasSynonyms == false){
	  				console.log("hasSynonyms == false");
	  				//newTurn();
	  				//return false;
	  			}
			});
			//console.log("synonyms ="+synonyms);
			//return synonyms;
		});
	}else{
		console.log("This is no word :(");
		//newTurn();
	}
}

function newTurn(word){
	appendToOptions(word);
}

function startFaseTwo(){
	$('#score-board .left .wordButton').hide();
	$('.goodGuess').css('color', '#26b55f');
	
	$('.option').on('click', function(e) {	
		//console.log(e);	
		wordClicked(e, $(this), $(this).text());		
	});

	showMessage("Fase 2!","#970306");
}
/*
* 	----- End of State 2 stuff ---
*/


function showMessage(message, color) {
	
	clearTimeout(messageTimer);
	
	var messageElement = $('#messageHolder');
	
	messageElement.css('color', color);
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
		gameState = 1;
		gameTimer = setInterval(extraSecond, 1000);
		
		getRandomWord();
		
	} else if (state == 2) {
		gameState = 2;
		// TODO: STATE 2 VAN DE GAME, WOORDEN DOOR DE GAMEENGINE HALEN EN WOORDEN DIE OVERBLIJVEN REPLACEN MET SELECTIEVAKKEN
		
		// ALLE GERADEN WOORDEN STAAN IN: wordArray_State1
		// Strafseconden staan in: gameSeconds_State1
		
		//alert("Je bent in state 2 van de game beland!"); //TODO alert vervangen door sexy interface?
		startFaseTwo();
				
	} else if (state == 3){
		//alert("Gefeliciteerd! Spel uitgespeeld :)"); //TODO alert vervangen door sexy interface?
		showMessage("Gefeliciteerd! U heeft het spel uitgespeeld");
		console.log("End of game...");
		gameState = 3;
		//TODO: Laat eind scherm zien met scores
	}

	else {
		
		// Game state not found..
		console.log("Error occurred, game state not found!");
		
	}
}

function extraSecond() {
	
	if(gameState == 1){
		gameSeconds_State1 = (gameSeconds_State1 + 1);
	}
	
	var outputText = "";
	
	if (gameSeconds_State1 > 1) {
		outputText = gameSeconds_State1 + " seconden ";
	} else {
		outputText = gameSeconds_State1 + " seconde ";
	}
	
	outputText += "verstreken tijd";	
	outputText += "<br />";
	outputText += gameWordsCorrect_State1 + " woord(en) gevonden";
	
	if (gameState == 2) {
		outputText += "<br />";
		outputText += gameWordsCorrect_State2+ " woord(en) goed geraden";
	}
	
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