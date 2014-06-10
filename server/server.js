var express = require('express');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser());

app.all("*",function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods","POST,GET");
    res.header("Content-Type","json");
    next();
});

var db = {};//{<username>:<pw>,<username2>:...}
var rooms = {};//{<roomName>:[[users],current#,max#],<roomName2>:...} maybe add location later
var games = {};//[<roomName>:[{<user1>:<alive?>,<user2>:...},[user pos in same index]]

app.post('/login',function(req,res,next){
    if (db[req.body.name] != undefined) {
	if (db[req.body.name] === req.body.pw) {
	    res.send(true);
	} 
	else { res.send(false);}
    }
    else {res.send(false);}
});
   
app.post("/register",function(req,res,next){
    if (db[req.body.name] === undefined){
	db[req.body.name] = req.body.pw;
	var data = {"status":true,"name":req.body.name};
	res.send(data);
    }
    else { res.send(false);}

});
 
app.get("/",function(req,res,next){
    res.send("hello world");
});

app.get("/test",function(req,res,next){
    if (req.query.d != undefined){
	res.send({'d':req.query.d * 100 + 1});
    }
    else{
	res.send(undefined);
    }
});

app.post("/lRoom",function(req,res,next)){
    var data = [];
    for (var i = 0;i < keys(rooms).length;i++){
	data.push(keys(rooms)[i]);
    }
    res.send(data);
}

app.post("/jRoom",function(req,res,next){
    var n = req.body.roomName;
    if (rooms.n != undefined){
	if (rooms.n[2] < rooms.n[3]){
	    rooms.n[2] += 1;
	    res.send({"stat":true,"err":undefined});
	}
	res.send({"stat":false,"err":"room full"});
    }
    res.send({"stat":false,"err":"room no longer exist"});
});

app.post("/cRoom",function(req,res,next){
    var n = req.body.roomName;
    if (rooms.n === undefined){
	rooms.n = [[req.body.userName],1,10];
    }
    else{
	req.send({"stat":false,"err":"another room with the same name exists"});
    }
});

app.post("setGame",function(req,res,next){//once room is filled w/ people, or host decides to start
    var n = req.body.roomName;
    for (var i = 0;i<rooms.n

});
	
app.post("/updateP",function(req,res,next){
    
});



var server = app.listen(3000,function(){
    console.log("listening on 3000");
});
