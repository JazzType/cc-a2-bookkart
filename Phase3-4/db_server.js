var express = require('express');
var Datastore = require('nedb');
var bodyParser = require('body-parser');
var db = new Datastore('db.json');
db.loadDatabase();
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
db.persistence.setAutocompactionInterval(180000);
db.on('compaction.done', function(event) {
	console.log('[ DBX ] Compaction complete');
});
app.put('/', function(request, response) {
	console.log("=====PUT=====");
	//db = new Datastore(request.query.tid);
	
	db.find({}, function (error, docs) {
		if(docs.length == 0) {
			console.log('Invalid tenant ID');
			response.json({status: 404, message: 'Invalid tenant ID\n'});			
		}
		else {		
			db.findOne({bid: String(request.query.bid),tid: String(request.query.tid)}, function(err, doc) {
				if(doc != null) {
					console.log('[ INF ] Match found for ' + request.query.bid);
				
					var insDoc = {};
					
					for(name in request.query) {					
						insDoc[name] = request.query[name];
					}
					console.log(insDoc);
					db.update({bid: String(request.query.bid),tid: String(request.query.tid)},
					          insDoc,
					          {
					          	upsert: true
					          },
										function(err, numAffected, affectedDocument, upsert) {
											if(!err) {
												if(!upsert) {
													response.end('{status: 200, message: "ok"}\n');
													console.log('[ INF ] Updated db entry');
												}												
												else {
													//console.log(affectedDocument);
													console.log('[ INF ] Added db entry\n');
												}
											}
										}
									 );
				}
				else {
					console.log('[ ERR ] ')
				}
			});
		}
	});
	console.log("Request queued");
	response.end();
});
app.post('/', function(request, response) {	
	console.log('Creating new database for tenant ' + request.body.tid);
	//db = new Datastore(request.body.dbid);
	db.loadDatabase();
	db.findOne({created: true}, function(error, doc) {
		if(!error) {
			if(doc != null) {
				console.log(doc);
				if(doc.created) {
					console.log('db with specified id already exists\n');
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
	//db = new Datastore(request.query.tid);
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
	//db = new Datastore(request.query.tid);
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