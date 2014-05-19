var app = require("express")();
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);

server.listen(3000);

app.get("/login",function(req,res){
//    res.sendfile(__dirname+"/client.html");
    res.sendfile("../DodgePhoful/www/login.html");
});

app.get("/register",function(req,res){
//    res.sendfile(__dirname+"/client.html");
    res.sendfile("../DodgePhoful/www/register.html");
});

var db = {}
io.sockets.on("connection",function(socket){
    socket.on("login",function(data){
	//check if user exists
	if (keys(db).indexOf(data['usr'])>=0){
	    if (data['pw'] === db[data['usr']]){
		socket.emit("authorized",{'result':true,'code':data['usr']});
	    }
	    else{
		socket.emit("authorized",{'result':false,'code':undefined});
	    }
	}
	else if (keys(db).indexOf(data['usr'])==-1){
	    socket.emit("authorized",{'result':false,'code':undefined});
	}
	else{}
    });

    socket.on("register",function(data){
	if(keys(db).indexOf(data['usr'])==-1){
	    db[data['usr']) = data['pw'];
	    socket.emit("added",{'result':true,'code':data['usr']});
	}
	else if (keys(db).indexOf(data['usr'])>-1){
	    socket.emit("added",{'result':false,'code':undefined});
	}
	else{}
    });
    
    socket.on("disconnect",function(){});

}