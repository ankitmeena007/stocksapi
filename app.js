//free api from alphavantage allows maximum 5 fetch per minute so server might stop after 5 updates/emits
//we have to decrease the refresh rate or buy a paid plan for longer live runtime
//if paid api, then hide api key using config.js
const express = require('express');
const https = require('https');
const bodyParser=require('body-parser');
var request = require('request');

//---------------required necessary modules---------------
let query="";
let queryPrev="";

var mData=[];
var arr=[];
var ticker='IBM';

const app = express();
let port=process.env.PORT;
if(port== null || port==""){
  port=8000;
} //specifying default port as 8000
app.use(bodyParser.urlencoded({extended: true}));
var http = require('http').Server(app);
var io = require('socket.io')(http);





function fetch(){
  if (query=='' || query==null){
    ticker='IBM';

  }
  else if (queryPrev!= query){
    ticker=query;
  }
  else {
    ticker=query;

  }
var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ticker+'&apikey=1X6QHG731TWUXYW8';

request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is successfully parsed as a JSON object:
      // console.log(data);
      console.log('request made through function');
      mData=[]
      mData.push(data["Meta Data"]);
      arr=[] //array is reset with every update (new fetch request)
      for (var i=0; i<14; i++) {
        arr.push(data["Time Series (Daily)"][Object.keys(data["Time Series (Daily)"])[i]]);
      }

    }
});
}


fetch();
setInterval(function(){
  io.emit('stock price update', {metaData:mData, array:arr});
},100)

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post("/",function(req,res){
  console.log(req.body.stockInput);
  queryPrev=query;
  query=req.body.stockInput;
  fetch();
  io.emit('stock price update', {metaData:mData, array:arr});
  console.log("fetched from query post");
  res.redirect("/");
  // res.sendFile(__dirname + '/index.html');
//   const url="https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+query+"&apikey=1X6QHG731TWUXYW8";
//

});




//-------------------------------------------
// For future version (to fetch by date)
// var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();
//
// var today = yyyy + '/' + mm + '/' + dd;
//--------------------------------------------




setInterval(function() {


fetch();
console.log("from main fetch")
//------------Javascript Candlestick Chart update-------------
//chart code for future versions
//------------------------------------------------------------

  console.log(arr.length);

  // io.emit('stock price update', {metaData:mData, array:arr});
}, 50000); //updates stock values automatically every 50 seconds





http.listen(port, function() {
    console.log('Listening on *:',port);
});
