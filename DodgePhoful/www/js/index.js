//=======Globals====================================================
var watchID = null;
var motionArray = [];
var counter = 0;

//====Dodgeball constructor=========================================
function dodgeball(heading, deltaX, deltaY, deltaZ){
    this.heading = heading;
}

//=======app========================================================
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
//	navigator.geolocation.getCurrentPosition(getLoc,null);
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
	startWatch();
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

function startWatch(){
    var optns = { frequency : 500};
    watchID = navigator.accelerometer.watchAcceleration(watchSuccess, onError, optns);
}

function watchSuccess(acceleration){
    document.getElementById('accx').innerHTML = acceleration.x;
    document.getElementById('accy').innerHTML = acceleration.y;
    document.getElementById('accz').innerHTML = acceleration.z;
    motionArray.push(acceleration.x);
    motionArray.push(acceleration.y);
    motionArray.push(acceleration.z);
    counter = counter + 1;
    if(counter%2 == 0){
	motionDetector();
    }
}

function motionDetector(){
    z = motionArray.pop();
    y = motionArray.pop();
    x = motionArray.pop();
    z1 = motionArray.pop();
    y1 = motionArray.pop();
    x1 = motionArray.pop();
    if(z1 - z >= 3 ||
       x1 - x >= 3 ||
       y1 - y >= 3){
	alert("You threw a ball");
    }else{
	alert("You did nothing")
    }
}

function getLoc(){
    console.log("updating")
    navigator.geolocation.getCurrentPosition(function(position){
	document.getElementById('latitude').innerHTML = position.coords.latitude;
	document.getElementById('longitude').innerHTML = position.coords.longitude;
    }
					     ,null,
					    {enableHighAccuracy: true });
}

function getHeading(){
    navigator.compass.getCurrentHeading(function(heading){
	//document.getElementById('heading').innerHTML = heading.getmagneticHeading;
	alert(heading.trueHeading);
    },function(error){
	alert( error.code);
    });
}

function onSuccess(acceleration) {
    alert('Acceleration X: ' + acceleration.x + '\n' +
          'Acceleration Y: ' + acceleration.y + '\n' +
          'Acceleration Z: ' + acceleration.z + '\n' +
          'Timestamp: '      + acceleration.timestamp + '\n');
}

function onError() {
    alert('onError!');
}

function getForce(){
    navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
}

