$.ajaxSetup({
    cache:false
});

var speed = function(){
    var ts = new Date();
    var num = $("#num")[0].value;
    for (var i = 0;i<num;i++){
	$.ajax({
	    type:"GET",
	    url:"http://localhost:3000/test", // CHANGE THIS TO SERVER URL
	    data:{d:i},
	    success:function(data){
		if (data.d!=undefined){
		    $("#results").append("<li>"+data.d+"</li>");
		}
		else{
		    console.log("fail");
		    $("#results").append("<li>fail</li>");
		}
	    }//success
	});//ajax
    }//for
    var tf = new Date();
    console.log(tf.getTime() - ts.getTime());
};//speed

var clear = function(){
    var parent = $("#results");
    parent.empty();
};

$("#clear").click(clear);
$("#test").click(speed);
