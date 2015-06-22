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
			
			var parent = $('body');
			var iframeSrc = 'http://basschuitema.nl/medialab/?article=' + encodeURIComponent(location.href);
			var elementToAdd = $('<div id="game-overlay"><div id="game-container"><iframe id="game-frame" src="' + iframeSrc + '"></iframe></div></div>');

			parent.prepend(elementToAdd);

			// Disable body scrolling
			$('body').css('overflow', 'hidden');

			$('#game-overlay').on('click', function(e) {
				
				if ($(e.target).is("#game-overlay")) {
				
					app.gameStarted = false;
				
					$(this).fadeOut(1000, function() {
					
						$(this).remove();
					
					});
					
					// Enable body scrolling again
					$('body').css('overflow', 'auto');
				
				}
				
			});
			
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