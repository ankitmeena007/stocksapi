//free api from alphavantage allows maximum 5 fetch per minute so server might stop after 5 updates/emits
//we have to decrease the refresh rate or buy a paid plan for longer live runtime
const express = require('express');
const https = require('https');
const bodyParser=require('body-parser');
var request = require('request');

//---------------required necessary modules---------------


const app = express();
let port=process.env.PORT;
if(port== null || port==""){
  port=8000;
} //specifying default port as 8000
app.use(bodyParser.urlencoded({extended: true}));
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
//---------------get request to root---------------------
io.on('connection', function(socket) {
    console.log('WebSocket connection established');
});


var mData=[];
var arr=[];

//-------------------------------------------
// For future version (to fetch by search bar query and date)
// var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();
//
// var today = yyyy + '/' + mm + '/' + dd;
//--------------------------------------------

setInterval(function() {


var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=1X6QHG731TWUXYW8';

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

      mData=[]
      mData.push(data["Meta Data"]);
      arr=[] //array is reset with every update (new fetch request)
      for (var i=0; i<14; i++) {
        arr.push(data["Time Series (Daily)"][Object.keys(data["Time Series (Daily)"])[i]]);
      }

    }
});

//------------Javascript Candlestick Chart update-------------
//chart code for future versions
//------------------------------------------------------------

  console.log(arr.length);

  io.emit('stock price update', {metaData:mData, array:arr});
}, 5000); //updates stock values every 5 seconds



http.listen(port, function() {
    console.log('Listening on *:',port);
});
