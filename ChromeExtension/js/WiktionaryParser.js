var WiktionaryParser = ( function( window, undefined ) {

  function WiktionaryParser () {


    var escapeRegExp = function( string ) {
      return string.replace( /([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1" );
    }

    var replaceEscapedString = function ( string, find, replace ) {
      return string.replace( new RegExp( escapeRegExp(find), 'g' ), replace );
    };

    var banWordsfromArray = function ( arr, bannedarray ) {
      return arr.filter( function ( value, index, self ) {
        return bannedarray.indexOf( value ) == -1;
      });
    }


    this.parse = function ( json ) {

      var text = json.parse.wikitext['*'];
      var output = {};      


      // Strip de onderstaande wikitext. 
      var unwantedtags = '{{rel-top}} {{rel-bottom}} {{((}} {{))}} {{=}}'.split(' ');
      
      for( var i = 0; i < unwantedtags.length; i++ )
      {
        text = replaceEscapedString( text, unwantedtags[i], '' );        
      }


      var parsewords = '{{-syn-}} {{-rel-}} {{-ant-}} {{-hypo-}} {{-drv-}}'.split(' ');
      for( var i = 0; i < parsewords.length; i++ ) {
         parsewords[i] = parsewords[i].replace(/[0-9\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]]/g,'');
         //console.log(text.split(parsewords[i])[1].split('{{')[0].replace(/[0-9\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]]/g,'').replace(/\n/g,' ').split(' '));
        try {
          output[parsewords[i]] = text.split(parsewords[i])[1].split('{{')[0].replace(/\[\[([a-z]+)\:([a-z]*)\]\]/gi,'').replace(/[0-9\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]]/g,'').replace(/\n/g,' ').split(' ');
          output[parsewords[i]] = banWordsfromArray(output[parsewords[i]],['formeler','informeler','']);
        } catch(ex) {
          output[parsewords[i]] = '';
        };

      }

      return output;

    }

  }

  return WiktionaryParser;
  
} )( window );
