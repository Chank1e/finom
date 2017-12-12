var express = require("express");
var app = express();
var http = require('http');
/* serves main page */
app.get("/", function(req, res) {
   res.sendfile('index.html')
});
/* serves all the static files */
app.get(/^(.+\..+)$/, function(req, res){
    res.sendfile( __dirname + req.params[0]);
});
app.listen(8080, function() {
  console.log("Listening on 8080");
});

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter_min = new FileSync('db/min.json')
const adapter_max = new FileSync('db/max.json')
const db = {min:low(adapter_min),max:low(adapter_max)};


app.get('/api',function(req,res){
    let $db = (req.query.db==0||!req.query.db)?db.min:db.max;
    let _id = +req.query.id;
    let result = $db.get('users').find({id:_id}).value();
    if(result){
        res.json(result);
    } else {
        res.status(204).send('No content!')
    }
})