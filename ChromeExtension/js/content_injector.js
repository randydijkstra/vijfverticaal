var app = window.app = {};

(function() {
	
	app.gameStarted = false;
	
	app.gameInterval;
	app.fastGameInterval;
	
	app.timeCounter = 0;
	
	app.playingWord;
	app.wordsPlayed = [];
	
	var fn = {
		injectPlayButton: function() {
			
			var introElement = $('p.intro');	
			if (introElement.length > 0) {
				
				var elementToAdd = $('<div id="playTheGameButton">Ben je altijd op de hoogte van het laatste nieuws?<span>Speel ons nieuwe spel en test je snelheid!</span></div>');
					
				introElement.before(elementToAdd);
				elementToAdd.on('click', function() {
					
					if (!app.gameStarted) {
						fn.startTheGame();
						app.gameStarted = true;
					}
					
				});
				
			}
			
		},
		addWord: function(element, word) {
			
			if (fn.filterWord(word).length > 2) {
			
				var elementToAdd = $("<span class=\"gameWord\">");
				element.append(elementToAdd.text(word));
				elementToAdd.after("<span> </span>");
				
				elementToAdd.attr('data-word', fn.filterWord(word).toLowerCase());
				
			} else {
				
				var elementToAdd = $("<span>");
				element.append(elementToAdd.text(word));
				elementToAdd.after("<span> </span>");				
				
			}
				
		},
		filterWord: function(word) {
			
			word = word.replace('.', '');
			word = word.replace(',', '');
			word = word.replace(':', '');
			//word = word.replace('\'', '');
			//word = word.replace('\'', '');
			word = word.replace('"', '');
			word = word.replace('"', '');
			word = word.replace('*', '');
		
			return $.trim(word);	
			
		},
		randomFrom: function(array) {
			
			return Math.floor(Math.random() * array.length);
			
		},
		fastGameInterval: function() {
			
			var allWords = $('.gameWord');			
			allWords.removeClass('fastSelected');
			
			for(var i = 0; i < parseInt(allWords.length / 3); i++) {
				
				allWords.eq(fn.randomFrom(allWords)).addClass('fastSelected');
				
			}
			
		},
		gameInterval: function() {
			
			app.timeCounter += 1;	
			
			if (app.timeCounter > 1) {
			
				$('#gameOverlay').find('.left .seconds').text('Verstreken tijd: ' + app.timeCounter + ' seconden');	
				
			} else {
				
				$('#gameOverlay').find('.left .seconds').text('Verstreken tijd: ' + app.timeCounter + ' seconde');	
				
			}
			
		},
		getRandomWordFromText: function() {
			
			var allWords = $('.gameWord');			
			
			return allWords.eq(fn.randomFrom(allWords)).text();
								
		},
		playNewWord: function(word) {
			
			app.timeCounter = 0;			
			app.playingWord = word;
			
			$('#gameOverlay').find('.left .wordButton').text(fn.filterWord(word).toLowerCase());
			
			var allWords = $('.gameWord');	
			allWords.removeClass('goodAnswer');
			allWords.off('click');
			
			allWords.each(function(index) {
				
				var thisWord = $(this).attr('data-word');
				
				if (thisWord == fn.filterWord(word).toLowerCase()) {				
					$(this).addClass('goodAnswer');					
				}
				
			});
			
			$('body').find('.gameWord.goodAnswer').on('click', function() {
				
				app.wordsPlayed.push([app.playingWord, app.timeCounter]);

				var countWords = app.wordsPlayed.length;
				var countTotalScore = 0;
				
				$.each(app.wordsPlayed, function(i, v) {
	
					countTotalScore += v[1];
				
				});
				
				var countScore = (countTotalScore / countWords).toFixed(2);				
				$('.yourScore').text(countScore + ' seconden per woord. (' + countWords + ' woorden)');
				
				if (countWords < 10) {
				
					fn.playNewWord(fn.getRandomWordFromText());
				
				} else {
					
					var allWords = $('.gameWord');	
					allWords.removeClass('goodAnswer');
					allWords.off('click');
					
					allWords.removeClass('fastSelected');
					
					clearInterval(app.fastGameInterval);
					clearInterval(app.gameInterval);
					
					$('#gameOverlay').find('.left').html('');
					
					alert('Je hebt het spel uitgespeeld!\nScore: ' + countScore);
					
				}
				
			});
			
		},
		replaceAll: function(find, replace, str) {
			
			return str.split(find).join(replace);
			
		},
		startTheGame: function() {
			
			var articleTitleElement = $('h1#articleDetailTitle');
			var detailContentElement = $('#detail_content');
			
			// Wrap all title words in a span
			var words = articleTitleElement.text().split(" ");
			articleTitleElement.empty();
			$.each(words, function(i, v) {
				fn.addWord(articleTitleElement, v);
			});

			// Wrap all articale words in a span
			detailContentElement.find('p').each(function(index) {
				var articleElement = $(this);
				articleElement.find('strong').remove();
				var text = fn.replaceAll('.', '. ', articleElement.text());		
				var words = text.split(" ");	
				articleElement.empty();
				$.each(words, function(i, v) {
					fn.addWord(articleElement, v);
				});
			});
			
			$('body').prepend('<div id="gameOverlay"><div class="holder"><div class="left"><div class="text">Zoek het woord:</div><div class="wordButton"></div><div class="text seconds"></div></div><div class="right"><div class="text">Huidige score:</div><div class="wordButton yourScore"><i>Nog geen</i></div></div></div></div>')
			
			fn.gameInterval();
			fn.fastGameInterval()
			
			app.gameInterval = setInterval(fn.gameInterval, 1000);
			app.fastGameInterval = setInterval(fn.fastGameInterval, 100);
			
			fn.playNewWord(fn.getRandomWordFromText());
						
		},
		init: function() {

			app.articleElement = $('.article.art_detail');
			if (app.articleElement.length > 0) {		
				fn.injectPlayButton();				
			}
					
		}
	};	
	
	$(document).on('ready', fn.init);

})();