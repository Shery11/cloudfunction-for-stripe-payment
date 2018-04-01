const functions = require('firebase-functions');
const express = require('express');
const stripe = require('stripe')('sk_test_4ResYzIWW4eq8z5Ct5grgT1X');
var bodyParser = require('body-parser');
var cors = require('cors');
const admin = require('firebase-admin');
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
    databaseURL: "https://ionic-crud-b95b2.firebaseio.com"
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(cors({ origin: true }));


router.post('/stripe',(request,response)=>{

	console.log(request.body);

	var userId = request.body.userId;
	var spins = request.body.spins;
	
	var stripetoken = request.body.stripetoken;
	var amountPayable = request.body.amountPayable;
	var charge = stripe.charges.create({
		amount : amountPayable,
		currency : 'usd',
		description : 'Sample charge',
		source : stripetoken
	},function(err,charge){
		if(err){
			console.log(err);
			response.json({success: false, err: err})

		}else{
			console.log("success");
			var spins = spins + 5;
            var usersRef = admin.database().ref(`users/${userId}`);
			usersRef.update({
			  "spins": spins
			});
            response.json({success : true , message : charge});
		}
	})
})

app.use(router);

// exports.stripe = functions.https.onRequest(app);
app.listen(8000, function(){
	console.log("Server started on 8000")
})
