var watchID = null;
$(document).ready(function(){
    var optn = {
	enableHighAccuracy: true,
	timeout: Infinity,
	maximumAge: 0
    };
    if (navigator.geolocation)
	navigator.geolocation.watchPosition(success, null, optn);
    else
	$("p").html("HTML5 NOT SUPPORTED");
});

function success(position){
    var googleLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var map0tn={
	zoom:10,
	center:googleLatLng,
	mapTypeId:google.maps.MapTypeId.ROAD
    };

    var Pmap = document.getElementById("map");

    var map = new google.maps.Map(Pmap,map0tn);
    addMarker(map,googleLatLng, "Here");

    function addMarker(map, googleLatLng, content){
	var markerOptn={
	    position:googleLatLng,
	    map:map,
	    animation:google.maps.Animation.DROP
	};

	var marker = new google.maps.Marker(markerOptn);
    }

    var infoWindow = new google.maps.InfoWindow({
	content: content,
	position: googleLatLng
    });

    google.maps.event.addListener(marker, "click", function(){
	infoWindow.open(map);
    });

    function fail(error){
	var errorType={
	    0:"Unknown Error",
	    1:"Permission denied by the user",
	    2:"Position of the user not available",
	    3:"Request timed out"
	};
    }
}
