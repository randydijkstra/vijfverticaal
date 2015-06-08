var app = window.app = {};

(function() {
	
	app.articleElement = undefined;
	app.title = undefined;
	app.article = undefined;
	
	app.titleElement = undefined;
	app.articleElement = undefined;
	
	app.gameEngine = undefined;
	app.HowManyWords = 3;
	
	app.wordObject = undefined;
	
	app.gameStarted = false;
	
	var fn = {
		injectPlayButton: function() {
			
			var introElement = $('p.intro');	
			if (introElement.length > 0) {
				
				var elementToAdd = $('<div id="playTheGameButton">Ben je altijd op de hoogte van het laatste nieuws?<span>Speel ons nieuwe spel en test je kennis!</span></div>');
					
				introElement.before(elementToAdd);
				elementToAdd.on('click', function() {
					
					if (!app.gameStarted) {
						fn.startTheGame();
						app.gameStarted = true;
					}
					
				});
				
				// debug
				//fn.startTheGame();
				
			}
			
		},
		startTheGame: function() {
			
			// Wrap all title words in a span
			var words = app.titleElement.text().split(" ");
			app.titleElement.empty();
			$.each(words, function(i, v) {
				var elementToAdd = $("<span class=\"gameWord\">");
				app.titleElement.append(elementToAdd.text(v));
				elementToAdd.after("<span> </span>");
			});

			// Wrap all articale words in a span
			app.articleElement.find('p').each(function(index) {
				var articleElement = $(this);
				var words = $(this).text().split(" ");	
				articleElement.empty();
				$.each(words, function(i, v) {
					var elementToAdd = $("<span class=\"gameWord\">");
				    articleElement.append(elementToAdd.text(v));
				    elementToAdd.after("<span> </span>");
				});
			});
			
			app.gameEngine = new GameEngine();			
			app.wordObject = app.gameEngine.run(app.titleElement, app.articleElement, app.HowManyWords);
	
			fn.addPlayables();
			
		},
		replaceWordInArticle: function(word, alternatives) {
			
			$('span.gameWord').each(function(index) {
				
				var wordInSpan = $(this).text().toLowerCase();
				
				if (wordInSpan == word) {

					$(this).data('word', wordInSpan.toLowerCase());
					$(this).data('words', alternatives);
					$(this).text('???').addClass('playable').on('click', function() {
						
						fn.showOptionSelect($(this), word, alternatives);
						
					});
					
				}
				
			});
			
		},
		showOptionSelect: function(wordElement, word, alternatives) {
			
			var overlayElement = $('<div id="gameOverlay"></div>');			
			$('body').prepend(overlayElement);
			
			var blockElement = $('<div class="gameBlock"><h1>Wat is het juiste woord?</h1><div class="words"></div></div>');		
			overlayElement.append(blockElement);
			
			var allWords = alternatives.concat();
			allWords.push(word);

			$.each(allWords, function(index, value) {

				var wordElementToAdd = $('<div class="gameWordButton">' + value.toLowerCase() + '</div>'); 
				blockElement.find('.words').append(wordElementToAdd);
				
				wordElementToAdd.on('click', function() {
					
					var clickedWord = $(this).text().toLowerCase();	
					
					$("span.gameWord.playable").each(function(index) {
					
						var thisWordElement = $(this);
						
						var thisWord = thisWordElement.data('word').toLowerCase();
						
						if (thisWord == clickedWord || thisWordElement.data('words').indexOf(clickedWord) > -1) {
							
							thisWordElement.text(clickedWord);
							thisWordElement.removeClass('correct');
							if (clickedWord == thisWord) {			
								thisWordElement.addClass('correct');				
							}										
							
						}
					
					});
								
					overlayElement.fadeOut(function() {
						
						overlayElement.remove();
						
					});
					
				});

			});
			
			blockElement.fadeIn();			
			wordElement.text(word);
			
		},
		addPlayables: function() {
			
			if (typeof app.wordObject != "undefined") {				
				$.each(app.wordObject, function(index, value) {

					fn.replaceWordInArticle(value.word, value.alternatives);

				});
			}
			
		},
		readArticle: function() {

			if (typeof app.articleElement != "undefined") {
				
				var articleTitleElement = $('h1#articleDetailTitle');				
				if (articleTitleElement.length > 0) {
					
					app.titleElement = articleTitleElement;
					
					app.title = articleTitleElement.text();
					
				}
				
				var detailContentElement = $('#detail_content')		
				if (detailContentElement.find('p').length > 0) {
					
					app.articleElement = detailContentElement;
					
					app.article = "";				
					detailContentElement.find('p').each(function(index) {
						
						app.article += $(this).text() + "\n";
						
					});
					
				}		
				
				if (typeof app.title != "undefined" && typeof app.article != "undefined") {
					
					fn.injectPlayButton();
					
				}
						
			}
			
		},
		init: function() {

			app.articleElement = $('.article.art_detail');
			if (app.articleElement.length > 0) {		
				fn.readArticle();				
			}
					
		}
	};	
	
	$(document).on('ready', fn.init);

})();