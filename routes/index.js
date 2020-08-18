var express = require('express');
var router = express.Router();
var monk = require('monk');
var moment = require('moment');
var randomstring = require('randomstring');
var nodemailer = require('nodemailer')
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
router.get('/forgetpassword',function(req,res) {
res.render('forgetpassword');
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
  var data = {
    "name":req.body.name,
    "adm":req.body.adm,
    "email":req.body.email,
    "dob":moment(req.body.dob).format('DD-MM'),
    "branch":req.body.branch,
    "quota":req.body.quota,
    "gender":req.body.gender,
    "type":req.body.type,
    "address":req.body.address,
    "contact":req.body.contact
  }
  coll.insert(data,function(err,docs) {
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
			// console.log(docs);
			console.log("invalid")
		}
		else if(docs){
			// console.log(docs);
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
  		// console.log(docs);
  		res.send(docs);
  	}
  })
});
router.delete('/deletedata:id', function(req, res) {
	var myid = req.params.id
  coll.remove({"_id":myid},function(err,docs) {
  	if (docs) {
  		// console.log(docs);
  		// console.log("deleted");
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
      // console.log(docs);
      // console.log("updated")
      res.send(docs);
    }
  });


  });
router.get('/getbdydata', function(req, res) {
  var today = moment().format('DD-MM');
  // console.log(today);
  coll.find({"dob":today},function(err,docs) {
    if (err) {
      console.log(err);
    }
    else{
      // console.log(docs);
      res.send(docs);
    }
    
  })

})
router.get('/getrecentbdy',function(req,res){
  var yesterday = moment().subtract(1,'days').format('DD-MM');
  console.log(yesterday);
  coll.find({"dob":yesterday},function(err,docs){
    if (err) {
      console.log(err);
    }
    else{
      console.log(docs);
      res.send(docs);
    }
  })
})
router.get('/getnxtbdy',function(req,res) {
  var tomorrow = moment().add(1,'days').format('DD-MM');
  coll.find({"dob":tomorrow},function(err,docs) {
    if (err) {
      console.log(err);
    }
    else{
      console.log(docs);
      res.send(docs);
    }
  })
})
router.post('/sendmail',function(req,res) {
  console.log(req.body.email);
  collection.find({"Email":req.body.email},function(err,docs) {
    if (err) {
      console.log(err);
    }
    else{
      console.log(docs);
      console.log(docs.Name);
     var OTP = randomstring.generate({
      length: 6,
      charset: 'numeric'
    })
      var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ganeshrgppc.710@gmail.com',
    pass: 'Ganeshbhargav@710'
  }
});
var mailOptions = {
  from: 'ganeshrgppc.710@gmail.com',
  to: req.body.email,
  subject: "Dear"+"  "+"  "+"to change your password",
  text: 'your one time Password'+"  "+OTP
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
    collection.update({"Email":req.body.email},{$set:{"Password":OTP}},function(err,docs) {
      if (err) {
        console.log(err);
      }
      else{
        console.log(docs);
      }
    })
    res.send(info.responce);
  }
});
    }
  })
})







module.exports = router;
