//=======Globals====================================================
var watchID = null;
var motionArray = [];
var dodgeBallArray = [];
var counter = 0;
var currentHeading,lat,longit;
//=========login/register===========================================
$.ajaxSetup({
    cache: false
});

var regi = function(){
    var name=$("#username")[0].value,pw=$("#pw")[0].value,pw2=$("#pw2")[0].value;
    var line = $("#status")[0];
    var data = {"name":name,"pw":pw};
    $("#regi").attr("disabled","disabled");	    
    if (pw === pw2){
	$.ajax({
	    type:"POST",
	    url:"http://localhost:3000/register", // CHANGE THIS TO SERVER URL
	    data:data,
	    success:function(data){
		if (data['status']){
		    window.localStorage['username'] = name;
		    $("#user")[0].innerHTML = window.localStorage["username"];
		    rd("index")
		}
		else {
		    line.innerHTML = "username already registered";	
		    $("#username")[0].value = "";
		    $("#pw")[0].value = "";
		    $("#pw2")[0].value="";
		    $("#regi").removeAttr("disabled");
		}}});
    }
    else {
	line.innerHTML = "passwords do not match";
	$("#username")[0].value = "";
	$("#pw")[0].value = "";
	$("#pw2")[0].value="";     
	$("#regi").removeAttr("disabled");
    }
};

var login = function(){
    var name = $("#username")[0].value, pw = $("#pw")[0].value;
    var line = $("#status")[0];
    var data = {"name":name,"pw":pw};
   $("#login").attr("disabled","disabled");
   $.ajax({
     type:"POST",
     url:"http://localhost:3000/login", //CHANGE THIS TO SERVER URL TOOOOOOOOO
     data:data,
     success:function(data){
       if (data){
	 window.localStorage['username'] = name;
	 if (window.localStorage['username'] != undefined){
	   $("#user")[0].innerHTML = window.localStorage["username"];
	 }
	   rd("index");	   	
       }
       else {
	 line.innerHTML = "incorrect login info";
	 $("#username")[0].value = "";
	 $("#pw")[0].value = "";
	 $("#login").removeAttr("disabled");
       }
     }
   });
 };

var hide = function(){
    console.log("running hide");
    if (window.localStorage['username'] != undefined){
	console.log("not equal");
	$("#current")[0].innerHTML = "Welcome"+window.localStorage['username'];
	$(".regi").toggle();
	$(".login").toggle();
    }
    else{
	$("#current").toggle();
    }
}

var logout = function(){
    window.localStorage.clear();
    rd("index");
}

var hlog = function(){
    if (window.localStorage["username"]!=undefined){rd("join");}
    else{rd("login");}
};

var hreg = function(){
    if (window.localStorage["username"]!=undefined){logout();}
    else{rd("register");}
};
	
$("#hlogin").click(hlog);
$("#hregi").click(hreg);
$("#login").click(login);
$("#regi").click(regi);

//********************************** GAME ROOM ******************************

var initRoom = function(){
    var list = $(".lobby");
    var data = [];
    list.empty();
    $.ajax({
	type:"POST",
	url:"http://localhost:3000/initRoom", //CHANGE THIS TO SERVER URL TOO
	data:{"d":"ListRoom"},
	success:function(d){
	    data = d;
	    for (var i = 0;i<data.length;i++){
		list.append("<li>"+data[i][0]+" &nbsp&nbsp&nbsp&nbsp&nbsp "+data[i][2]+"/"+data[i][3]+"</li>");
	    }    
	    $("li").dblclick(jRoom);   
	}
    });
};

var cRoom = function(){
    var da = {"userName":window.localStorage.username,"roomName":window.localStorage.username +"'s room"};
    $.ajax({
	type:"POST",
	url:"http://localhost:3000/cRoom",
	data:da,
	success:function(d){
	    if (d.stat != false){
		window.localStorage['game'] = da[0]+"'s room";
		rd('game');
	    }
	}
    });
};

var jRoom = function(){
    var name = window.localStorage.username;
    var room = this.innerHTML.split(" &nbsp")[0];
    $.ajax({
	type:"POST",
	url:"http://localhost:3000/jRoom",
	data:{"name":name,"roomName":room},
	success:function(d){
	    if (d.stat){
		window.localStorage['game'] = room;
		rd('game');
	    }
	}
    });
};

var qRoom = function(){
    window.localStorage.game = undefined;
    $.ajax({
	type:"POST",
	url:"http://localhost:3000/qRoom",
	data:{"name":window.localStorage.username,"roomName":window.localStorage.game},
	success:function(d){
	    rd('index');
	}
    });
};


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


//Animates the ball
function go(){
    // var dbinfo = "";
    // for (var i = 0; i < dodgeBallArray.length;i++){
    // 	dbinfo+= "<br>" + "dodgeBallNumber " + i + "<br>" +
    // 	    "Heading: " + dodgeBallArray[i].heading + "<br>" +
    // 	    "Latitude: " + dodgeBallArray[i].lat + "<br>" +
    // 	    "Longitude: " + dodgeBallArray[i].longit + "<br>"
    // }
    
    // document.getElementById('dodgeballs').innerHTML = dbinfo;
    // setTimeout(go,300);
    for(var i = 0; i < dodgeBallArray.length;i++){
	var acc = dodgeBallArray[i].deltaZ/10;
	var height = dodgeBallArray[i].deltaY/10;
	var heading = parseFloat(dodgeBallArray[i].heading);
	var constant = .0000028 * dodgeBallArray[i].deltaZ;
	dodgeBallArray[i].deltaY/10 += -.918;
	//Update Dodgeball
	if(heading == 0 ){
	    dodgeBallArray[i].longit += constant;
	}else if(0 < heading < 90){
	    dodgeBallArray[i].lat += constant;
	    dodgeBallArray[i].longit += constant;
	}else if(heading == 90){
	    dodgeBallArray[i].lat += constant;
	}else if (90 < heading < 180){
	    dodgeBallArray[i].lat += constant;
	    dodgeBallArray[i].longit -= constant;
	}else if(heading = 180){
	    dodgeBallArray[i].longit -= constant;
	}else if(180 < heading < 270){
	    dodgeBallArray[i].lat -= constant;
	    dodgeBallArray[i].longit -= constant;
	}else if(heading == 270){
	    dodgeBallArray[i].lat -= constant;
	}else if(270 < heading < 360){
	    dodgeBallArray[i].lat -= constant;
	    dodgeBallArray[i].longit += constant;
	}
	//Removes the Dodgeball
	if(dodgeBallArray[i].deltaY/10 <= 0){
	    dodgeBallArray.splice(i,1);
	}
    }

}
