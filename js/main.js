var obj = {

		// Artikel dummy data 
		'title' : 'Vrouw 27 neergeschoten in Osdorp',
		'article' : 'Een 27-jarige vrouw is vannacht gewond geraakt bij een schietpartij in osdorp in de Charles Boissevainstraat. De daders vluchtten weg op een scooter. Volgens een getuige stond kort voor 01.00 uur een scooter stil op de Charles Boissevainstraat. Die reed daarna weg, waarna er een korte gil klonk en vier schoten. Daarna reed de scooter met hoge snelheid weg. In het gras lag een vrouw, hevig bloedend. Omstanders legden een doek over haar heen, waarna ambulancemedewerkers haar eerste hulp verleenden. Volgens de politie was de vrouw op weg naar huis toen zij werd beschoten.'
};

var obj = {
	'title' : 'Australië dumpt vluchtelingen in Cambodja',
	'article' : 'De eerste vluchtelingen uit een Australisch detentiecentrum zijn aangekomen in de Cambodjaanse hoofdstad Phnom Penh. Het gaat om drie Iraniërs en een Rohingya-vluchteling, meldt de BBC. Zij waren de enige vrijwilligers die mee wilden doen met controversiële ruil. Cambodja krijgt namelijk 40 miljoen Australische dollar (bijna 28 miljoen euro) voor het opnemen van vluchtelingen die geweigerd zijn door Australië. Mensenrechtenorganisaties beschuldigen Australië van het afschuiven van verantwoordelijkheden door de vluchtelingen niet op te nemen. De asielzoekers mogen het land niet in en worden opgevangen in detentiecentra op de eilanden Nauru en Manus. Ze worden daar in sommige gevallen onder onhygiënische en onveilige omstandigheden vastgehouden.'
};


var obj= {
		'title' : 'Buideldier sterft uit door te veel seks',
		'article' : 'Een buidelmuis die alleen op het eiland Tasmanië voorkomt neukt zoveel dat het dier daardoor uitsterft. Dat blijkt uit nieuw onderzoek. De Antechinus swainsonii heeft een periode van twee weken per jaar waarin hij zich helemaal de verdoemenis insekst. Er zijn dagen waarop er wel 14 uur aan één stuk gerampetampt wordt, zo schrijft The Advocate. Bij de mannetjes kan dit echter leiden tot het loskomen van zoveel testosteron dat het immuunsysteem volledig uitgeschakeld wordt. Hierdoor zijn de mannetjes vaak al dood nog voordat er nageslacht is. Aan de andere kant zorgt deze massale mannensterfte er wel ook voor dat de vrouwtjes genoeg voedsel hebben om het kroost op te voeden. Het probleem is echter dat het gebied waar de buidelmuis leeft ook bedreigd wordt door ontbossing en klimaatverandering. Hierdoor is de hoeveelheid eten die beschikbaar is steeds kleiner en neemt de populatie, mede door het sterven van de mannetjes, snel af.'

};

var obj = {
		'title' : 'Eigenaar Jordanees café stuit tijdens verbouwing op \'schatkist\'',
		'article' : "Nooit meer werken!' was het eerste dat Laurence Docherty dacht toen hij in zijn café De Parel op een ouderwets ogende kluis stuitte. De eigenaar van de kroeg op de Westerstraat had net een muurtje opengebroken om ruimte te maken voor zijn twee nieuwe ijskasten.De muurschildering in café De Parel. De muurschildering in café De Parel 'Het verhaal dat er in De Parel een schat verborgen ligt, gaat al jaren. Maar er gaan in de Jordaan altijd wel verhalen dus in eerste instantie dacht ik: het zal wel', zegt Docherty, terwijl hij de restanten van een muurschildering schoon staat te maken. 'Het gaat om een muurtje van twee bij drie meter dat bijna helemaal weggerot is, maar op een klein deel staat een Amsterdams tafereel met gracht en kerktoren. Geen idee hoe oud het is, maar daar komt binnenkort iemand naar kijken.' Tegen het onderste gedeelte van de muur zaten twee planken, die Docherty en zijn compagnons verwijderden. Dat bleek een goede zet, want achter het hout bleek een ouderwetse kluis verstopt. Loeizwaar, maar er kwam wel geluid uit. 'Dan word je wel even gek', aldus de kroegbaas. 'Dan denk je: hier zit goud in of iets dergelijks.' 'Wonder boven wonder hebben we het ding open gekregen', gaat Docherty verder. Er zat een authentiek tupperware-achtig bakje in de kluis. 'Waarschijnlijk uit de jaren zestig ofzo, want het was echt van dat ouderwetse harde plastic. Ik denk dat het zeker twintig of zelfs dertig jaar achter de muur heeft gezeten.' Waarde heeft de gevonden schat echter niet. 'Er zat echt niks in. Niet eens een briefje met 'goed gevonden!' ofzo. Wel stond er aan de buitenkant van de kluis iets dat op een code leek. Ik denk dat vorige eigenaren hier hun kas bewaarden.'  Hoewel hij de nodige lol heeft gehad van deze vondst is Docherty niet van plan de rest van zijn tent open te beitelen op zoek naar de échte schat. 'Het hangt hier vol met meer dan honderd jaar oude betegeling. Jammer dat we nu geen diamant of iets dergelijks hebben gevonden, maar verder laat ik de boel liever heel.'"
};


var bannedwords = ['door','andere','veel','te','uit','ze','zij','hij','hem','in','die','naar','op','met','een','de','het','is','over','dit','dat','jij','je','jou','u','toen'];


var parseurl = 'http://nl.wiktionary.org/w/api.php?action=parse&prop=wikitext&page={{query}}&format=json';

var run = function(){
	// Haal een nieuwe originele artikel op 
	var article = obj.article;
	var title = obj.title;

	var words_in_article = getWordsFromSentence(article);

	// Zet alle woorden van de title in een array
	var words_in_title = uniqueArray(getWordsFromSentence(title));

	words_in_article = banWordsfromArray(words_in_article, bannedwords);
	words_in_title = banWordsfromArray(words_in_title, bannedwords);

	unique_words_in_article = uniqueArray(words_in_article);

	var occurrence = countWordOccurrence(allowWordsFromArray(words_in_article, words_in_title));
	var winner = occurrence[0][getMaxIndex(occurrence[1])];
	

	if(winner == undefined)
	{
		console.log('Couldn\'t find winner');
	} else {
		console.log('');
		console.log('Originele titel: ' + obj.title);
		console.log('Weggelaten woord: ' + winner);
		console.log('');
		console.log(obj.title.replace(winner,'??????'));
		console.log(obj.article.replace(winner,'??????'));
		
		wiktionaryAnalizer(winner, function(d){
			console.log(d);
		});
	}

	
}
function banWordsfromArray(arr, bannedarray)
{
	return arr.filter(function(value, index, self){
		return bannedarray.indexOf(value) == -1;
	});
}


function wiktionaryparser(jsonstr)
{


	var text = jsonstr.parse.wikitext['*'];

	['{{rel-top}}','{{rel-bottom}}','{{((}}','{{))}}','{{=}}'].forEach(function(str){
		text = replaceAll(text, str, '');
	})


	var antoniem = [];
	var hyponiem = [];
	var related = [];
	var synoniemen = [];
	var afgeleiden = [];

	try {
		synoniemen = text.split('{{-syn-}}')[1].split('{{')[0].replace(/[0-9\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]]/g,'').replace(/\n/g,' ').split(' ');
		synoniemen = banWordsfromArray(synoniemen,['']);
	} catch (ex){}

	try {
		related = text.split('{{-rel-}}')[1].split('{{')[0].replace(/[0-9\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]]/g,'').replace(/\n/g,' ').split(' ');
		related = banWordsfromArray(related,['']);
	} catch (ex){}

	try {
		antoniem = text.split('{{-ant-}}')[1].split('{{')[0].replace(/[0-9\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]]/g,'').replace(/\n/g,' ').split(' ');
		antoniem = banWordsfromArray(antoniem,['']);
	} catch (ex){}
	
	try {
		hyponiem = text.split('{{-hypo-}}')[1].split('{{')[0].replace(/[0-9\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]]/g,'').replace(/\n/g,' ').split(' ');
		hyponiem = banWordsfromArray(hyponiem,['']);
	} catch (ex){}

	try {
		afgeleiden = text.split('{{-drv-}}')[1].split('{{')[0].replace(/[0-9\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]]/g,'').replace(/\n/g,' ').split(' ');
		afgeleiden = banWordsfromArray(afgeleiden,['']);
	} catch (ex){}


	return {
		'synoniemen' : synoniemen,
		'antoniemen'	: antoniem,
		'hyponiemen' : hyponiem,
		'gerelateerd' : related,
		'afgeleiden' : afgeleiden
	};

}

function getMaxIndex(arr)
{
	return arr.indexOf(Math.max.apply(Math, arr));
}

function allowWordsFromArray(arr, allowarray)
{
	return arr.filter(function(value, index, self){
		return allowarray.indexOf(value) != -1;
	});
}

function wiktionaryAnalizer(word, cb)
{

	if(typeof window !== 'undefined')
	{
		microAjax(parseurl.replace('{{query}}',word),function(data){
			cb(wiktionaryparser(data));
		});
	} else {
		
		var http = require('http');
		var options = {
			host: 'nl.wiktionary.org',
			path : '/w/api.php?action=parse&prop=wikitext&page={{query}}&format=json'.replace('{{query}}',word)
		};
		var callback = function(response)
		{
			var str = '';

			//another chunk of data has been recieved, so append it to `str`
			response.on('data', function (chunk) {
				str += chunk;
			});

			//the whole response has been recieved, so we just print it out here
			response.on('end', function () {
				
				cb(wiktionaryparser(JSON.parse(str)));

			});
		}

		http.request(options, callback).end();

	}
}



function countWordOccurrence(arr){
    var a = [], b = [], prev;
    
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }
    
    return [a, b];

}

function getWordsFromSentence(str){
	
	return str.toLowerCase().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(' ');
}

function uniqueArray(arr)
{
	return arr.filter(function(value,index,self){
		return self.indexOf(value) == index;
	})
}

function microAjax(url, callbackFunction)
{
	this.bindFunction = function (caller, object) {
		return function() {
			return caller.apply(object, [object]);
		};
	};

	this.stateChange = function (object) {
		if (this.request.readyState==4)
			this.callbackFunction(this.request.responseText);
	};

	this.getRequest = function() {
		if (window.ActiveXObject)
			return new ActiveXObject('Microsoft.XMLHTTP');
		else if (window.XMLHttpRequest)
			return new XMLHttpRequest();
		return false;
	};

	this.postBody = (arguments[2] || "");

	this.callbackFunction=callbackFunction;
	this.url=url;
	this.request = this.getRequest();
	
	if(this.request) {
		var req = this.request;
		req.onreadystatechange = this.bindFunction(this.stateChange, this);

		if (this.postBody!=="") {
			req.open("POST", url, true);
			req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			req.setRequestHeader('Connection', 'close');
		} else {
			req.open("GET", url, true);
		}

		req.send(this.postBody);
	}
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

run();