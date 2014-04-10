
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
	document.getElementById('heading').innerHTML = heading.getmagneticHeading;
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
