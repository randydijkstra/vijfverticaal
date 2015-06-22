var GameEngine = ( function( JQ, wiktionaryParser, window, undefined ) {

  function GameEngine ( options ) {

    var wiktionary_query = 'http://nl.wiktionary.org/w/api.php?action=parse&prop=wikitext&page={{query}}&format=json';

    var bannedwords = ['voor','achter','door','andere','veel','te','uit','ze','zij','hij','hem','in','die','naar','op','met','een','de','het','is','over','dit','dat','jij','je','jou','u','toen'];

    var banWordsfromArray = function ( arr, bannedarray ) {
      return arr.filter( function ( value, index, self ) {
        return bannedarray.indexOf( value ) == -1;
      });
    };

    this.run = function ( array, callback ) {
      
      callback = callback || JQ.noop;
      var parser = new WiktionaryParser().parse;

      var requests = []; // hold ajax request
      var words = [];
      var parse;

      //apply filter of banned words
      array = banWordsfromArray( array, bannedwords );

      for( var i = 0; i < array.length; i++ ) {
        requests.push( JQ.ajax({url : wiktionary_query.replace('{{query}}',array[i]) } ));
      }


      JQ.when.apply( JQ, requests ).done( function () {
        
        JQ.each( requests, function ( n, data ) {
          parse = parser(data.responseJSON);
          if(!parse.error){
            if(parse.syn.length > 0)
            {
              words.push({
                word : data.responseJSON.parse.title,
                hasSynonyms : true,
                synonyms : parse.syn
              });
            } else {
              words.push({
                word : data.responseJSON.parse.title,
                hasSynonyms : false
              });
            }
          }

        });

        // run callback
        callback(words)

      });

    }

  }

  return GameEngine;
  
} )( jQuery, WiktionaryParser, window );