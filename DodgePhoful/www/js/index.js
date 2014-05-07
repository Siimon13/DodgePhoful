//=======Globals====================================================
var watchID = null;
var motionArray = [];
var dodgeBallArray = [];
var counter = 0;
var currentHeading,lat,longit;

//=======tmp=========================================================
function rd(pg){
    dest = pg + ".html";
    window.location.href = dest;
}

function weapon(){
    var fired = [0,0,0,0];
    var lines = [" balls thrown."," trap1 set."," trap2 set."," trap3 set."];
    var selected = "nothing";
    var select = function(n){
	var num = parseInt(n);
	selected = num;
	document.getElementById("nfired").innerHTML = fired[num] + lines[num];
	return false;
    }
    var fire = function(e){
	e.stopPropagation();
	//accelWatch();
	var num = selected;
	switch(num){
	case "nothing": return false;	
	case 0:
	    counter++;
	    accelWatch();
	    break;         //can add cases in future for traps and stuff
	default: break;
	}	
	if (e.type === "touchend"){
	    fired[num]++;
	    select(num);
	}
	return false;
    }
    return [select,fire];
}



var RANDOMSTRINGNAME = weapon();
var weap = RANDOMSTRINGNAME[0];
var fireWeap = RANDOMSTRINGNAME[1];

var ele = document.getElementsByClassName("shoot");

//The reason I added touchstart/cancel/end is because if the button is let go without the touchend, the button will just break. It's to catch the "error," which is touchend.
ele[0].addEventListener("touchstart",fireWeap);
ele[0].addEventListener("touchcancel",fireWeap);
ele[0].addEventListener("touchend",fireWeap);


//====Dodgeball constructor=========================================
function Dodgeball(heading, deltaY, deltaZ, lat, longit){
    this.heading = heading;
    this.lat = lat;
    this.longit = longit;
    this.deltaY = deltaY;
    this.deltaZ = deltaZ;
    alert("Made new Dodgeball");
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
	//startWatch();
//	go();
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

function accelWatch(){
    navigator.accelerometer.getCurrentAcceleration(watchSuccess, onError);
}

function watchSuccess(acceleration){
    //    if (counter >= 1){
	motionArray.push(acceleration.x);
	motionArray.push(acceleration.y);
	motionArray.push(acceleration.z);
    if (motionArray.length==6){
	motionDetector();
	//	}
    }
    
    /*
    document.getElementById('accx').innerHTML = acceleration.x;
    document.getElementById('accy').innerHTML = acceleration.y;
    document.getElementById('accz').innerHTML = acceleration.z;
    motionArray.push(acceleration.x);
    motionArray.push(acceleration.y);
    motionArray.push(acceleration.z);
    counter++;
    if(counter%2 == 0){
	motionDetector();
    }
    */
}
function motionDetector(){
    alert("ball thrown!");
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
	dodgeBallArray.push(new Dodgeball(currentHeading,
					  y1-y,z1-z,
					  lat, longit));
    }
}

function getLoc(){
    console.log("updating")
    navigator.geolocation.getCurrentPosition(function(position){
	document.getElementById('latitude').innerHTML = position.coords.latitude;
	lat = position.coords.latitude;
	document.getElementById('longitude').innerHTML = position.coords.longitude;
	longit = position.coords.longitude;
    }
					     ,null,
					    {enableHighAccuracy: true });
}

function getHeading(){
    navigator.compass.getCurrentHeading(function(heading){
	//document.getElementById('heading').innerHTML = heading.getmagneticHeading;
	alert(heading.trueHeading);
	currentHeading = heading.trueHeading;
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

function go(){
    var dbinfo = "";
    for (var i = 0; i < dodgeBallArray.length;i++){
    	dbinfo+= "<br>" + "dodgeBallNumber " + i + "<br>" +
    	    "Heading: " + dodgeBallArray[i].heading + "<br>" +
    	    "Latitude: " + dodgeBallArray[i].lat + "<br>" +
    	    "Longitude: " + dodgeBallArray[i].longit + "<br>"
    }
    
    document.getElementById('dodgeballs').innerHTML = dbinfo;
    setTimeout(go,300);
}
