const functions = require('firebase-functions');
const express = require('express');
const stripe = require('stripe')('sk_test_4ResYzIWW4eq8z5Ct5grgT1X');
var bodyParser = require('body-parser');
var cors = require('cors');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const app = express();

app.use(bodyParser.urlencoded({ extended : false}));
app.use(cors({ origin: true }));

app.post('/stripe',(request,response)=>{

	console.log(request.body);
	
	var stripetoken = request.body.stripetoken;
	var amountPayable = request.body.amountPayable;
	var charge = stripe.charges.create({
		amount : amountPayable,
		currency : 'usd',
		description : 'Sample charge',
		source : stripetoken
	},function(err,charge){
		if(err){

			response.json({success: false, err: err})

		}else{
            response.json({success : true , message : charge});
		}
	})
})

exports.stripe = functions.https.onRequest(app);
