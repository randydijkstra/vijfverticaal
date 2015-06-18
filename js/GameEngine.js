var GameEngine = ( function( window, undefined ) {

  function GameEngine ( options ) {

    // Default settings 
    var defaults = {
      bannedwords : [
        'door', 'andere', 'veel','te','uit','ze','zij','hij','hem','in','die','naar','op','met','een','de','het','is','over','dit','dat','jij','je','jou','u','toen']
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
    // apply 
    var settings = extend( defaults, options );

    var getWords = function ( str ) {
      return str.toLowerCase().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ');
    };


    var unique = function ( array ) {
      return array.filter(function( value, index, self ){
        return self.indexOf( value ) == index;
      });
    };


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

    }

  }

  return GameEngine;
  
} )( window );