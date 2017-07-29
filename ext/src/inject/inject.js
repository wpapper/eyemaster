chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

	}
	}, 10);
});

var mouseDown = 0;
document.body.addEventListener('mousedown', function() { 
    mouseDown = 1;
    console.log('mouse down');
});

document.body.addEventListener('mouseup', function() {
    mouseDown = 0;
    console.log('mouse up');
});

var hasLoaded = false;

window.addEventListener("load", function() {
    webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function(data, clock) {
         //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
         //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
        })
        .setOnBlinkCallback(function() {
        	console.log("I see a blink!");
        	//openNewTab();
          var selectedText = window.getSelection().toString();
          if (selectedText && selectedText.length < 20 && mouseDown) {
            mouseDown = false;
            googleIt(selectedText);
          }
        	// textToSpeech("I am google and I can see into your soul!");
        })
        .begin()
        .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */

    var width = 320;
    var height = 240;
    var topDist = '0px';
    var leftDist = '0px';
    
    var setup = function() {
        // var video = document.getElementById('webgazerVideoFeed');
        // video.style.display = 'block';
        // video.style.position = 'absolute';
        // video.style.top = topDist;
        // video.style.left = leftDist;
        // video.width = width;
        // video.height = height;
        // video.style.margin = '0px';

        webgazer.params.imgWidth = width;
        webgazer.params.imgHeight = height;

        var overlay = document.createElement('canvas');
        overlay.id = 'overlay';
        overlay.style.position = 'absolute';
        overlay.width = width;
        overlay.height = height;
        overlay.style.top = topDist;
        overlay.style.left = leftDist;
        overlay.style.margin = '0px';

        document.body.appendChild(overlay);

        var cl = webgazer.getTracker().clm;

        function drawLoop() {
            requestAnimFrame(drawLoop);
            overlay.getContext('2d').clearRect(0,0,width,height);
            if (cl.getCurrentPosition()) {
                cl.draw(overlay);
            }
        }
        drawLoop();
    };

    function checkIfReady() {
        if (webgazer.isReady()) {
            setup();
        } else {
            setTimeout(checkIfReady, 100);
        }
    }
    setTimeout(checkIfReady,100);
}, false);


window.addEventListener("focus", function() {
	if(hasLoaded) {
		webgazer.resume()
	}
}, false);

window.addEventListener("blur", function() {
	hasLoaded = true;
	webgazer.pause()
}, false);

// window.onbeforeunload = function() {
// 	webgazer.end()
// }

$('body').prepend('<div id="lol"></div>')
chrome.extension.sendRequest({cmd: "read_file"}, function(html){
  $('#lol').html(html);
});

