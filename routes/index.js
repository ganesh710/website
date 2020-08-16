var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/mywebsite');
var collection = db.get('signupdata');
var coll = db.get('studentdata');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.post('/postsignupdata', function(req, res) {
	console.log(req.body);
	collection.insert(req.body,function(err,docs) {
		if (err) {
			console.log(err);
		}
		else{
			console.log(docs);
			res.send(docs);
		}
	})
});
router.post('/poststudentdata', function(req, res) {
  coll.insert(req.body,function(err,docs) {
  	if (err) {
  		console.log(err);
  	}
  	else{
  		console.log(docs);
  		res.send(docs);
  	}
  })
});
router.post('/logindetails', function(req, res) {
	collection.findOne({"Email":req.body.email,"Password":req.body.password},function(err,docs) {
		if (!docs) {
			console.log(docs);
			console.log("invalid")
		}
		else if(docs){
			console.log(docs);
			console.log("logged")
			res.send(docs);
		}
		else{
			console.log(err);
			console.log("error")
		}
		
	})
 	
});
router.get('/getdatafromdb', function(req, res) {
  coll.find({},function(err,docs) {
  	if (err) {
  		console.log(err);
  	}
  	else{
  		console.log(docs);
  		res.send(docs);
  	}
  })
});
router.delete('/deletedata:id', function(req, res) {
	var myid = req.params.id
  coll.remove({"_id":myid},function(err,docs) {
  	if (docs) {
  		console.log(docs);
  		console.log("deleted");
  		res.send(docs);
  	}
  	else{
  		console.log(err);
  		console.log("error occured");
  	}
  })
});
router.put('/updateuser:myid', function(req, res) {
  var id = req.params.myid;
  console.log(id);
  console.log(req.body);
  coll.update({"_id":id},{$set:req.body},function(err,docs) {
    if (err) {
      console.log(err);
    }
    else{
      console.log(docs);
      console.log("updated")
      res.send(docs);
    }
  });


  });




module.exports = router;
