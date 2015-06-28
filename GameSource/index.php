<?php
	header("Access-Control-Allow-Origin: *");
//	header("Access-Control-Allow-Credentials: true");

	ini_set('user_agent', 'MedlabSpeedReader/1.1 (http://www.basschuitema.nl/medialab/; randydijkstra92@gmail.com) BasedOnSuperLib/1.4');
	ini_set('error_reporting', E_ALL);
	ini_set('display_errors', 'On');  //On or Off
	
	$isPlayingGame = false;
	
?>

<!DOCTYPE html>

<html>
<head>
	
	<title>SpeedRead</title>
	
	<meta name="viewport" content="width=device-width" />
	
	<link href='http://fonts.googleapis.com/css?family=Anton' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="css/style.css">
	
	<script type="text/javascript" src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
	<script type="text/javascript" src="js/WiktionaryParser.js"></script>
	<script type="text/javascript" src="js/gameEngine.js"></script>
	<script type="text/javascript" src="js/game.js"></script>
	
</head>
<body>
<div class="wrapper">
		
	<div class="mainHeader">
		<div class="headerImgContainer">
			<img src="images/header.png" />
		</div>
	</div>
	<div class="contentWrapper">

<?php
	
	if (isset($_GET['article']) && strlen($_GET['article']) > 0) {
		
		$articleUrl = $_GET['article'];
		
		// Show article content
		
		if (substr_count($articleUrl, 'ad.nl') > 0) {
			
			$data = getAdContents($articleUrl);
			
			preg_match("~<body[^>]*>(.*?)</body>~si", $data, $output);
			
			$output = $output[0];
			
			if (isset($output) && strlen($output) > 0) {
				
				$titleStrip = explode('id="articleDetailTitle">', $output);
				$titleStrip = explode('</h1>', $titleStrip[1]);
				$titleStrip = $titleStrip[0];
				
				$articleContent = explode('<section id="detail_content">', $output);
				$articleContent = explode('<ul class="read_more">', $articleContent[1]);
				$articleContent = $articleContent[0];
								
				$imageStrip = explode('<img src="', $articleContent);
				
				if (isset($imageStrip[1])) {
					$imageStrip = explode('"', $imageStrip[1]);
					$imageStrip = $imageStrip[0];
				} else {
					$imageStrip = "";
				}
				
				$totalText = "";
				
				preg_match_all("~<p[^>]*>(.*?)</p>~si", $articleContent, $articles);
				
				//print_r($articles);
				
				for ($i = 0; $i < count($articles[0]); $i++) {

					$totalText .= $articles[0][$i];
								
				}

				$imageUrl = $imageStrip;
				$articleTitle = mb_convert_encoding($titleStrip,'ISO-8859-15','utf-8');
				$articleText = mb_convert_encoding($totalText,'ISO-8859-15','utf-8');
				
				$articleText = str_replace('lockquote class="twitter-tweet" lang="nl">', '', $articleText);
				$articleText = str_replace('lockquote class="twitter-tweet" lang="en">', '', $articleText);
				
				// $articleText = str_replace('<br>', '<br> ', $articleText);
				
				//$articleText = remove_links($articleText);
				
				$articleText = preg_replace('/(?i)<a([^>]+)>(.+?)<\/a>/', '${2}', $articleText);
				$articleText = preg_replace("/<span[^>]+\>(.+?)<\/span>/i", "", $articleText);
				
				echo '
				
					<div class="articleTitle gameWords">
						<h1>' . $articleTitle . '</h1>
					</div>
					<div class="articleImage">
						' . (strlen($imageUrl) > 0 ? '<img src="' . $imageUrl . '" alt="Article image" />' : '') . '
					</div>
					<div class="articleText gameWords">						
						' . $articleText .'						
					</div>
					
				';
				
				$isPlayingGame = true;

			} else {
				
				// Something went wrong, no body..
				
				echo 'Something went seriously wrong!';
				
			}
			
		} else {
			
			// No valid AD.nl article URL..
			
			echo 'Error occurred, no valid article url is given..';
			
		}
		
	} else {
		
		// Show homepage with article selection	
		
		$xml = 'http://www.ad.nl/rss.xml';

		$xmlDoc = new DOMDocument();
		$xmlDoc->load($xml);

		//get and output "<item>" elements
		$x = $xmlDoc->getElementsByTagName('item');		
		$articleCount = $x->length;
		
		echo '<h1>Kies een artikel en speel het spel!</h1>';
		
		for ($i = 0; $i < $articleCount; $i++) {
			
			$item_title = mb_convert_encoding($x->item($i)->getElementsByTagName('title')->item(0)->childNodes->item(0)->nodeValue,'ISO-8859-15','utf-8');
			$item_link = $x->item($i)->getElementsByTagName('link')->item(0)->childNodes->item(0)->nodeValue;
			$item_desc = mb_convert_encoding($x->item($i)->getElementsByTagName('description')->item(0)->childNodes->item(0)->nodeValue,'ISO-8859-15','utf-8');
  
			echo ("<p><a href='?article=" . $item_link  . "'>" . $item_title . "</a>");
			echo ("<br>");
			echo ($item_desc . "</p>");
			
		}
		
	}
	
	function getAdContents($url) {
		
		$cookies = "nl_cookiewall_version=1; Expires=Thu, 19-Jun-2025 08:20:10 GMT; Path=/;";
			
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
		curl_setopt($ch, CURLOPT_HEADER, true);  
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
		curl_setopt($ch, CURLOPT_COOKIE, $cookies);
		$output = curl_exec ($ch);
		curl_close($ch);
		
		if(preg_match('#Location: (.*)#', $output, $r))
			$l = trim($r[1]);
			
		if (isset($l)) {
			
			return getAdContents($l);
			
		} else {
			
			return $output;
			
		}
		
	}
	
	if ($isPlayingGame) {
		echo 	'<div id="state2">'.
					'<h3>Wat was het woord in het artikel?</h3>'.
					'<div id="option1" class="option">Placeholder 1</div>'.
					'<div id="option2" class="option">Placeholder 2</div>'.
					'<div id="option3" class="option">Placeholder 3</div>'.
				'</div>';

		echo <<<EOT
<div id="state3">
	<h3>Ranking</h3>
	<div id="question">
	Wat is je naam ? <input id="name" type="text"></input>
	<input type="button" value="Verstuur highscore" id="sendHighscore">
	</div>
	<ol id="scores">
		
	</ol>
</div>
EOT;
	}
?>

		</div>
	</div>
	
	<div id="animationHolder"></div>
	<div id="messageHolder">Demotext</div>
	
<?php
	
	if ($isPlayingGame) {
	
		echo '		
			<div id="score-board">
				<div class="left">
					<div class="wordButton">Laden..</div>
				</div>
				<div class="right">
					<div class="helpText">Zoek het woord in de tekst!</div>
				</div>		
			</div>		
		';	
		
	}
	
?>
	
</body>
</html>