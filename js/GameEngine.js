var GameEngine = ( function( window, undefined ) {

  function GameEngine () {


    this.run = function ( title, article, count ) {

      var words = [
        {
          'word' : 'universiteit',
          'alternatives' : ['school', 'gemeentehuis', 'buurthuis']
        }
        {
          'word' : 'foto',
          'alternatives' : ['video', 'panorama', 'polaroid']
        }
        {
          'word' : 'zwart',
          'alternatives' : ['bruin', 'grijs', 'paars']
        }
      ];

      return words;

    }

  }

  return GameEngine;
  
} )( window );