var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = "postgres://postgres:prateek07@localhost/reddit";


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/posts', function(req, res, next) {

 var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM posts ORDER BY upvotes DESC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });
  
});



router.post('/posts', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {title: req.body.title, link:req.body.link, upvotes: 0};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Insert Data
        var query = client.query("INSERT INTO posts(title, link,upvotes) values($1, $2, $3)", [data.title, data.link, data.upvotes]);



        // After all data is returned, close connection and return results
        query.on('end', function() {
            return res.json(data);
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });
});



router.param('post', function(req, res, next, id) {

    var results=[];
 // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM posts WHERE id=$1", [id]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            req.post = res.json(results);
            return next();
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });
});

router.get('/posts/:post', function(req, res) {
  return res.json(req.post);
});



router.post('/posts/:post/comments', function(req, res) {
 		var results = [];

    // Grab data from http request
    var comment = {body: req.body.body, author:"user", upvotes: 0, post_id: req.body.id};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Insert Data
        var query3= client.query("INSERT INTO comments(body, author,upvotes,post_id) values($1, $2, $3, $4)", [comment.body, comment.author, comment.upvotes,comment.post_id]);


        query3.on('end', function() {
        	console.log("hello");
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }
        // After all data is returned, close connection and return results
        

    });
});


router.param('comment', function(req, res, next, id) {

    var results=[];
 // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM comments WHERE post_id=$1", [id]);

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            req.post = res.json(results);
            return next();
        });

        // Handle Errors
        if(err) {
          console.log(err);
        }

    });
});



router.get('/comments/:comment', function(req, res) {
  return res.json(req.post);
});



module.exports = router;
