
$(document).ready(function(){
    navigator.geolocation.watchPosition(getLoc);
});

// For the radar
// window.setInterval(function(){
//     navigator.geolocation.watchPosition(getLoc);
// }, 500);

    
function getLoc(position){
    console.log("updating")
    document.getElementById('latitude').innerHTML = position.coords.latitude;
    document.getElementById('longitude').innerHTML = position.coords.longitude;
    document.getElementById('heading').innerHTML = position.coords.heading;
}
