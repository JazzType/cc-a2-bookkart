var express = require('express');
var Datastore = require('nedb');
var bodyParser = require('body-parser');
var db = null;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.put('/', function(request, response) {
	console.log("=====PUT=====");
	db = new Datastore(request.query.tid);
	db.loadDatabase();
	db.find({}, function (error, docs) {
		if(docs.length == 0) {
			console.log('Invalid tenant ID');
			response.json({status: 404, message: 'Invalid tenant ID\n'});			
		}
		else {		
			db.findOne({bid: String(request.query.bid)}, function(err, doc) {
				if(doc != null) {
					console.log('[ INF ] Match found for ' + request.query.bid);
				
					var insDoc = {};
					
					for(name in request.query) {					
						insDoc[name] = request.query[name];
					}
					console.log(insDoc);
					db.insert(insDoc,
										function(err, newDoc) {
											if(!err) {
												response.end('{status: 200, message: "ok"}\n');
												console.log('[ INF ] Updated db entry');
											}
											else {
												console.log(newDoc);
												console.log('[ ERR ] Could not update db\n');
											}
										}
									 );
				}
				else {
					var insDoc = {};
					
					for(name in request.query) {					
						insDoc[name] = request.query[name];
					}
					console.log(insDoc);
					db.insert(insDoc,
										function(err, newDoc) {
											if(!err) {
												response.end('{status: 200, message: "ok"}\n');
												console.log('[ INF ] Added db entry');
											}
											else {
												console.log(newDoc);
												console.log('[ ERR ] Could not update db\n');
											}
										}
									 );
				}
			});
		}
	});
	console.log("Request queued");
	response.end("\n");
});
app.post('/', function(request, response) {	
	console.log('Creating new database for tenant ' + request.body.tid);
	db = new Datastore(request.body.tid);
	db.loadDatabase();
	db.findOne({created: true}, function(error, doc) {
		if(!error) {
			if(doc != null) {
				console.log(doc);
				if(doc.created) {
					console.log('db for tenant already exists\n');
					response.end('{status: 409, message: "Conflict"}\n');
				}
			}
			else {
				db.insert({created: true}, function(err, doc) {});
				response.end('{status: 200, message: "ok"}\n');
			}
		}
	});	
});

app.get('/', function(request, response) {
	console.log("=====GET_ONE=====");
	db = new Datastore(request.query.tid);
	db.loadDatabase();
	db.find({}, function (error, docs) {
		if(docs.length == 0) {
			console.log('Invalid tenant ID');
			response.json({status: 404, message: 'Invalid tenant ID\n'});			
		}
		else {				
			db.findOne({bid: String(request.query.bid)}, function(err, doc) {
				if(doc != null) {
					response.json(doc);
					response.end('{status: 200, message: "ok"}\n');
				}
				else {
					response.end('{status: 404, message: "Book ID not found"}\n');
				}
			});
		}
	});
	console.log("Request queued");	
});
app.get('/all', function(request, response) {
	console.log("=====GET_ALL=====");
	db = new Datastore(request.query.tid);
	db.loadDatabase();
	db.find({}, function (error, docs) {
		if(docs.length == 0) {
			console.log('Invalid tenant ID');
			response.end("{status: 404, message: 'Invalid tenant ID\n'}");
		}
		else {
			response.json(docs);
			response.end('{status: 200, message: "ok"}\n');
		}
	});
	console.log("Request queued");	
});
app.listen(4700);