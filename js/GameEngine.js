var GameEngine = ( function( JQ, wiktionaryParser, window, undefined ) {

  function GameEngine ( options ) {

    var wiktionary_query = 'http://nl.wiktionary.org/w/api.php?action=parse&prop=wikitext&page={{query}}&format=json';


    this.run = function ( array, callback ) {
      
      callback = callback || JQ.noop;
      var parser = new WiktionaryParser().parse;

      var requests = []; // hold ajax request
      var words = [];
      var parse;

      for( var i = 0; i < array.length; i++ ) {
        requests.push( JQ.ajax({url : wiktionary_query.replace('{{query}}',array[i]) } ));
      }


      JQ.when.apply( JQ, requests ).done( function () {
        
        JQ.each( requests, function ( n, data ) {
          parse = parser(data.responseJSON);

          if(parse.syn.length > 0)
          {
            words.push({
              word : data.responseJSON.parse.title,
              hassynonym : true,
              synonyms : data.responseJSON.parse.syn
            });
          } else {
            words.push({
              word : data.responseJSON.parse.title,
              hassynonym : true
            });
          }
          
        });

        // run callback
        callback(words)

      });

    }

  }

  return GameEngine;
  
} )( jQuery, WiktionaryParser, window );

