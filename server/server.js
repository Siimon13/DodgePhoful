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

var db = {};
var rooms = {};

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

app.get("/lRoom",function9req,res,next){
    
}

var server = app.listen(3000,function(){
    console.log("listening on 3000");
});
