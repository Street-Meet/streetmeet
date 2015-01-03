var express = require('express');
var Meetup = require('meetup');
var url = require('url');
var bodyParser = require('body-parser');
var request = require('request');
var cors = require('cors');
var app = express();
var path = require('path');

// var graph     = Promise.promisifyAll(require('fbgraph'));
// var Promise = require("bluebird");
// var _ = require('underscore');


// var mup = new Meetup({
//   clientId:"3fss73ueag5e744sp45cmopag2",
//   clientSecret:"g31i2o39pbf2qgscie95pkcdod",
//   redirectUri:"http://127.0.0.1:3000"
// });

// var corsOptions = {
//   origin: 'http://localhost:3000'
// };

// app.use(bodyParser.json());
// app.use(cors(corsOptions));

// app.get('/login/meetup', function(req, res){
//    var meetupUrl = mup.getAuthorizeUrl();

//     res.redirect(meetupUrl);
//     res.end();
// });

// app.get('/*', function(req, res, next){
//     var url_parts = url.parse(req.url, true);
//     var query = url_parts.query;
//     var code = query.code;
//     if (!code) {
//       next();
//     } else {
//       res.sendFile(path.resolve(__dirname+'../../streetMeet/www/index.html'));
//     }
    
// });

// app.get('/api/meetup/self', function(){
   
// });

// app.get('/api/facebook/:token', function(req, res2){
//   console.log('llego a getthefeed');
//   var count = 0;
//   var theResult = [];
//   var  _theToken = req.params.token
//   var  fbToken = req.params.token

//   console.log('this is the token: '+ _theToken);
//   var getFacebookGraphData = function(theData,  _theToken){
//     theData = theData || 'me';
//     _theToken = _theToken || {access_token: fbToken};

//     graph.getAsync(theData, _theToken)
//     .then(function(res){
//       console.log('llego dentro del then');
//       if(count<1){
//         count++;
// // console.log('OTRO DATA SET ----------------------------- ' , res.data);
// theResult.push(res.data);
// // console.log('vuelta numero: '+ count + 'resultado en ' + res.paging.next);
// if(res.paging && res.paging.next) {
//   getFacebookGraphData(res.paging.next, null);
// }
// }
// return theResult;
// })
//     .then(function(results){
// // eventEmitter.emit('pageLoaded', res2, results);
// // console.log(results)
// console.log('EL COUNT FUE DE ' + count);
// if(count === 1){
// // res2.render('feed', { res: _.flatten(results) });
// res2.json(_.flatten(results))
// }
// })
//     .catch(function(e){
//       console.error("Error: ", e);
//     });
//   };

//   console.log('llamando a la funcion');
//   getFacebookGraphData();
// });

var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '../../streetMeet/www'));




app.listen(port);


