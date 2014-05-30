var express = require('express');
var app = express();

app.all("*",function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods","POST,GET,OPTIONS");
    res.header("Content-Type","json");
    next();
});

var db = {};

app.get('/login',function(req,res,next){
    if (db[req.query.name] != undefined) {
	if (db[req.query.name] === req.query.pw) {
	    res.send(true);
	} 
	else { res.send(false);}
    }
    else {res.send(false);}
});
   
app.get("/register",function(req,res,next){
    if (db[req.query.name] === undefined){
	db[req.query.name] = req.query.pw;
	var data = {"status":true,"name":req.query.name};
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

var server = app.listen(3000,function(){
    console.log("listening on 3000");
});
