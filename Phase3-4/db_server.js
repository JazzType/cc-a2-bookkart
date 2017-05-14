var express = require('express');
var Datastore = require('nedb');
var db = null;
var app = express();
app.get('/', function(req, res) {
	for(name in req.query) {
		console.log(name);
	}
	//res.write(req.query.tid + ' received\n');
	db = new Datastore(req.query.tid);
	db.loadDatabase();
	db.find({}, function(error, docs) {
		if(docs.length == 0) {
			console.log('Invalid tenant ID');
			res.json({status: 404, message: 'Invalid tenant ID'});
		}
		else {
			db.find({bid: req.query.bid}, function(err, docs) {
				if(docs.length != 0) {
					console.log("Retrieved:");
					console.log(docs[0]);
					res.end(docs[0].bid);
				}
				else {
					db.insert(
					          {
					          	bid: req.query.bid,
					          	tid: req.query.tid,
					          	title: req.query.title
					          },
					          function(err, newDoc) {
					          	if(!err) {
					          		console.log(newDoc);
					          		res.end('Created new DB for ' + req.query.tid + '\n');
					          	}
					          	else {
					          		console.log('Could not add to db\n');
					          	}
					          }
				           );
				}
			});
		}
	});
});
/*app.post('/', function(request, response) {
	console.log('Creating new database for tenant ' + request.query.tid);
	db = new Datastore(request.query)
});*/
app.listen(4700);