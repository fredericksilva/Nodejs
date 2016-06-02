var express = require('express');
var app = express();


app.use('/test', function(req, res){
	res.send('hello world');
});

app.listen(3000, function(){
	console.log('app is listening on port 3000...');
});