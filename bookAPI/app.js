var express = require('express');
// var mongoose = require('mongoose');
// var bodyParser = require('body-parser');


// var db;

// if (process.env.ENV == 'Test'){
//     db = mongoose.connect('mongodb://localhost/bookAPI_test');

// } else {
//     db = mongoose.connect('mongodb://localhost/bookAPI');
// }

// var Book = require('./models/bookModel');


var app = express();
var port = process.env.PORT || 3000;

// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());

// bookRouter = require('./Routes/bookRoutes')(Book);

// app.use('/api/books', bookRouter);
// // app.use('/api/authors', authorRouter);

app.get('/', function(req,res){
    console.log('Welcome to my App');
    res.send('Welcome to my App');
});

app.listen(port, function(){
    console.log('Gulp is running my app on Port: ' + port);
});

// module.exports = app;