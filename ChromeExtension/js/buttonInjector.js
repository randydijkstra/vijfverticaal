var app = window.app = {};

(function(undefined) {
	
	app.gameStarted = false;
		
	var fn = {
		injectPlayButton: function() {
			
			var introElement = $('p.intro');	
			if (introElement.length > 0) {
				
				var elementToAdd = $('<div id="playTheGameButton">Ben je altijd op de hoogte van het laatste nieuws?<span>Speel ons nieuwe spel en test je snelheid!</span></div>');
					
				introElement.before(elementToAdd);
				elementToAdd.on('click', function() {
					
				if (!app.gameStarted) {
						fn.addOverlay();
						app.gameStarted = true;
					}
					
				});
			}
			
		},
		addOverlay: function(){
			
			console.log("Adding the game overlay");

			var parent = $('body');

			var elementToAdd = $('<div id="game-overlay"><h2>VijfVerticaal</h2><div id="game-container"><p>Game here!</p></div></div>');

			parent.prepend(elementToAdd);
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