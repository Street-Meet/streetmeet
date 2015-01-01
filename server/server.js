var express = require('express');
var Meetup = require('meetup');
var url = require('url');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();


var mup = new Meetup({
  clientId:"3fss73ueag5e744sp45cmopag2"
  , clientSecret:"g31i2o39pbf2qgscie95pkcdod"
  , redirectUri:"http://127.0.0.1:3000/api/meetupReturn/"
  })


app.use(bodyParser.json());
app.get('/api/meetup/', function(req, res2){


   var meetupUrl = mup.getAuthorizeUrl()
   
    // res.writeHead(302, {
    //   'Location': meetupUrl
    //   //add other headers here...
    // });
    request.get(meetupUrl, function(req, res){
        console.log(res.data);
         res2.end(res.data);
    });


   


    

   // console.log('this is the code:', code );
   // mup.getAccessToken(code, function(err, access, refresh, others) {
   //     if (err) {
   //        // do something about it
   //        console.log('this is the error: ', err);
   //     } else {
   //        // at this point mup is automatically configured with the access token
   //        // you are free to start making requests here
   //        mup.get("/2/member/self", function(err, data){
   //          console.log("got data " + data)
   //        })
   //     }
   // })
});

app.get('/api/meetupReturn/*', function(req, res){

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var code = query.code;
    res.json(code);

    // mup.getAccessToken(code, function(err, access, refresh, others) {
    //     if (err) {
    //       console.log('error: ', err)
    //     } else {
           
    //        // at this point mup is automatically configured with the access token
    //        // you are free to start making requests here
    //     }
    // });
    // //  mup.get("/2/member/self", function(err, data){
    //   console.log("got data " + data)
    //    res.send(data);
    // })


});

// app.get('/api/meetup/self', function(){
   
// });


var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '../../streetMeet/www'));




app.listen(port);


