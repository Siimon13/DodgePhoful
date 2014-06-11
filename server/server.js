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
var rooms = {"test1":[[1,2,3],1,10],"test2":[[2,3,4],1,10]};//{<roomName>:[[users],current#,max#],<roomName2>:...} maybe add location later
var games = {};//{<roomName>:{<user1>:[<alive?>,{x:<userX>,y:<userY>}],<user2>:...}}

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

app.post("/initRoom",function(req,res,next){
    var data = [];
    var keys = Object.keys(rooms);
    for (var i = 0;i < keys.length;i++){
	data.push([keys[i],rooms[keys[i]][0],rooms[keys[i]][1],rooms[keys[i]][2]]);
    }
    res.send(data);
});
	 
app.post("/jRoom",function(req,res,next){
    var n = req.body.roomName;
    if (rooms[n] != undefined){
	if (rooms[n][1] < rooms[n][2]){
	    rooms[n][0].push(req.body.name);
	    rooms[n][1] += 1;
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
	res.send({"stat":true,"err":undefined});
    }
    else{
	res.send({"stat":false,"err":"another room with the same name exists"});
    }
});

app.post("/qRoom",function(req,res,next){
    var name = req.body.name;
    var game = req.body.game;
    var target = rooms[game][0].indexOf(name);
    rooms[game][0].splice(target,1);
    console.log(rooms[game]);
});

app.post("setGame",function(req,res,next){//once room is filled w/ people,or host decides to start
    var n = req.body.roomName;
    var d = {}
    for (var i = 0;i<rooms.n[0].length;i++){
	d.rooms.n[0][i] = [true,{'x':0.0,'y':0.0}];
    }
    games.n = d;
    delete rooms.n;
});

app.post("/updateP",function(req,res,next){
    var game = req.body.game;
    var player = req.body.player;
    var x =req.body.xC, y = req.body.yC;
    games.game.player[1].x = x;
    games.game.player[1].y = y;
});

app.post("/collide",function(req,res,next){
    var x = req.body.xC,y=req.body.yC; //ball's xy/geo coord
    var origin = req.body.usr; // user that threw the ball
    var game = req.body.game; //the gameroom, windows.localStorage.game
    var keys = Object.keys(games.game);
    var stat = false;
    var acc = 0.000000; //*******************************ACCURACY*******************
    for (var i = 0;i<keys.length;i++){
	if (keys[i] != origin){
	    if ((Math.abs(x-games.game.keys[i][1].x)<=acc)&&(Math.abs(y-games.game.keys[i][1].y)<=acc)){
		stat = true;
		games.game.keys[i][0] = false;
	    }
	}
    }
    req.send({"stat":stat});    
});

app.post("/eliminate",function(req,res,next){
    var game = req.body.game;
    var name = req.body.name; //username
    if (!games.game.name[0]){
	req.send({"stat":false}); //dead
    }
    else if (games.game.name[0]){
	req.send({"stat":true}); //still alive
    }
    else {
	req.send({"stat":undefined});
    }
});


var server = app.listen(3000,function(){
    console.log("listening on 3000");
});
