var speed = function(){
    for (var i = 0;i<10;i++){
	$.ajax({
	    type:"GET",
	    url:"http://localhost:3000/test", // CHANGE THIS TO SERVER URL
	    data:{d:i},
	    success:function(data){
		if (data!=undefined){
		    console.log("success");
		    $("#results").append("<li>success</li>");
		}
		else{
		    console.log("fail");
		    $("#results").append("<li>fail</li>");
		}
	    }//success
	});//ajax
    }//for
};//speed

$("#test").click(speed);
