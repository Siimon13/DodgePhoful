//===================globals
var watchGPSID = null;
var watchCompassID = null;
var heading,lat,longit,angle;


//===================app
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
	//navigator.geolocation.getCurrentPosition(getLoc,null);
	//navigator.compass.getCurrentHeading(getHeading,null);
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
	addGraph();
	startGPS();
	startCompass();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

//===============================GPS watcher
function startGPS(){
    var optns = { timeout : 10000};
    watchGPSID =navigator.geolocation.watchPosition(GPSSuccess,
						    GPSError,
						    optns);
}

function GPSSuccess(position){
    lat = position.coords.latitude;
    longit = position.coords.longitude;
    var element = document.getElementById('gps');
    element.innerHTML = 'Latitude: '  + position.coords.latitude + '<br />' + 'Longitude: ' + position.coords.longitude + '<br />' +
	'<hr />';
}

function GPSError(error){
    alert(error.code);
}

function startCompass(){
    var optns = { frequency : 500};
    watchCompassID = navigator.compass.watchHeading(CompassSuccess,
						    CompassError,
						    optns);
}

function CompassSuccess(heading){
    heading = heading.trueHeading;
    var element = document.getElementById('compass');
    element.innerHTML = 'Heading: ' + heading;
}

function CompassError(error){
    alert(error.code);
}

function addGraph(){
    var s = document.getElementById('radar');
    alert(s);
    var l = document.createElementNS("http://www.w3.org/2000/svg","line");
    l.setAttribute('x1',150);
    l.setAttribute('y1',150);
    l.setAttribute('x2',150);
    l.setAttribute('y2',300);
    l.setAttribute('stroke',"#00FF00");
    l.setAttribute("stroke-width", 2);
    s.appendChild(l);
}
