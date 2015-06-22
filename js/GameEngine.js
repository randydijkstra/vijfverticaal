<<<<<<< HEAD
var GameEngine = ( function( JQ, wiktionaryParser, window, undefined ) {

  function GameEngine ( options ) {

    var wiktionary_query = 'http://nl.wiktionary.org/w/api.php?action=parse&prop=wikitext&page={{query}}&format=json';

    // Default settings 
    var defaults = {
      bannedwords : [
        'door', 'andere', 'hier', 'waarom', 'en', 'veel','te','uit','ze','zij','hij','hem','in','die','naar','op','met','een','de','het','is','over','dit','dat','jij','je','jou','u','toen']
=======
var GameEngine = ( function( window, undefined ) {

  function GameEngine ( options ) {

    // Default settings 
    var defaults = {
      bannedwords : [
        'door', 'andere', 'veel','te','uit','ze','zij','hij','hem','in','die','naar','op','met','een','de','het','is','over','dit','dat','jij','je','jou','u','toen']
>>>>>>> Chrome
    };

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    var extend = function ( defaults, options ) {
        var extended = {};
        var prop;
        for ( prop in defaults ) {
            if (Object.prototype.hasOwnProperty.call( defaults, prop )) {
                extended[ prop ] = defaults[ prop ];
            }
        }
        for ( prop in options ) {
            if (Object.prototype.hasOwnProperty.call( options, prop )) {
                extended[ prop ] = options[ prop ];
            }
        }
        return extended;
    };
<<<<<<< HEAD

    // apply 
    var settings = extend( defaults, options );
=======
    // apply 
    var settings = extend( defaults, settings );
>>>>>>> Chrome

    var getWords = function ( str ) {
      return str.toLowerCase().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ');
    };

<<<<<<< HEAD
    var banWords = function ( array, banned ) {
      return array.filter( function( value, index, self ){
        return banned.indexOf( value ) == -1;
      });
    }
=======

    var unique = function ( array ) {
      return array.filter(function( value, index, self ){
        return self.indexOf( value ) == index;
      });
    };
>>>>>>> Chrome


    var occurrence = function ( array ) {
      var a = [], b = [], prev;

      array.sort();
      for ( var i = 0; i < array.length; i++ ) {
          if ( array[i] !== prev ) {
              a.push( array[ i ] );
              b.push(1);
          } else {
              b[b.length-1]++;
          }
          prev = array[ i ];
      }

<<<<<<< HEAD
      var o = [];
      for( var i = 0; i < b.length; i++ ) {
        o.push([b[i],a[i]]);
      }

      return o;
    }



    this.run = function ( title, article, count, callback ) {
      
      callback = callback || $.noop;
      var parser = new WiktionaryParser().parse;

      var allwords = getWords( title ).concat( getWords( article ) );
      var filtered = banWords( allwords, settings.bannedwords );
      var occurrence_array = occurrence( filtered );
      
      var sorted_occurence = occurrence_array.sort( function( a, b ) {
        return a[0] - b[0];
      }).reverse();
      
      var target = sorted_occurence.splice( 0, count ).map( function( item ) {
        return item[1];
      });

      var words = [];
      var requests = []; // hold ajax request
      
      for( var i = 0; i < target.length; i++ ) {
        requests.push( JQ.ajax({url : wiktionary_query.replace('{{query}}',target[i]) } ));
      }

      JQ.when.apply( JQ, requests ).done(function () {
        JQ.each( requests, function ( n, data ) {
          words.push( { 
            word: data.responseJSON.parse.title,
            alternatives : parser(data.responseJSON)
          });
        });

        // run callback
        callback(words)

      });
=======
      return [ a, b ];
    }

    this.run = function ( title, article, count ) {

      var words = [
        {
          'word' : 'universiteit',
          'alternatives' : ['school', 'gemeentehuis', 'buurthuis']
        },
        {
          'word' : 'foto',
          'alternatives' : ['video', 'panorama', 'polaroid']
        },
        {
          'word' : 'zwart',
          'alternatives' : ['bruin', 'grijs', 'paars']
        }
      ];

      return words;
>>>>>>> Chrome

    }

  }

  return GameEngine;
  
<<<<<<< HEAD
} )( jQuery, WiktionaryParser, window );

=======
} )( window );
>>>>>>> Chrome
