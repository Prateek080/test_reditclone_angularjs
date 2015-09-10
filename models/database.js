var pg = require('pg');
var connectionString = "postgres://postgres:prateek07@localhost/reddit";


var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE posts(id SERIAL PRIMARY KEY, title VARCHAR(4000) not null,link VARCHAR(4000) not null, upvotes integer DEFAULT 0)');
query.on('end', function() { client.end(); });


var query1 = client.query('CREATE TABLE comments(id SERIAL PRIMARY KEY, body VARCHAR(4000) not null,author VARCHAR(4000) not null, upvotes integer DEFAULT 0, post_id integer not null)');
query1.on('end', function() { client.end(); });

