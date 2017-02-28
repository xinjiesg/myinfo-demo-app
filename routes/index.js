var express = require('express');
var router = express.Router();

const restClient = require('superagent-bluebird-promise');
const path = require('path');
const url = require('url');
const util = require('util');
const Promise = require('bluebird');
const _ = require('lodash');
const querystring = require('querystring');
const securityHelper = require('../lib/security/security');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


// ####################
// Setup Configuration
// ####################

// LOADED FRON ENV VARIABLE: public key from MyInfo Consent Platform given to you during onboarding for RSA digital signature
var publicCertContent = process.env.MYINFO_CONSENTPLATFORM_SIGNATURE_CERT_PUBLIC_CERT;  

// LOADED FRON ENV VARIABLE: your private key for RSA digital signature
var privateKeyContent = process.env.MYINFO_APP_SIGNATURE_CERT_PRIVATE_KEY;  

// LOADED FRON ENV VARIABLE: your client_id provided to you during onboarding
var clientId = process.env.MYINFO_APP_CLIENT_ID; 		

// LOADED FRON ENV VARIABLE: your client_secret provided to you during onboarding
var clientSecret = process.env.MYINFO_APP_CLIENT_SECRET; 		

// redirect URL for your web application
var redirectUrl =  process.env.MYINFO_APP_REDIRECT_URL;

// default realm for your web application
var realm = process.env.MYINFO_APP_REALM;

// URLs for MyInfo APIs
var authApiUrl =  process.env.MYINFO_API_AUTHORISE;
var tokenApiUrl = process.env.MYINFO_API_TOKEN; 
var personApiUrl = process.env.MYINFO_API_PERSON; 

var attributes = "name,sex,race,nationality,dob,email,mobileno,regadd,housingtype,hdbtype,marital,edulevel,assessableincome";

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/../views/html/index.html'));
});

router.get('/empty', function(req, res, next) {

    res.jsonp({});
});

// callback function - directs back to home page
router.get('/callback', function(req, res, next) {

    res.sendFile(path.join(__dirname+'/../views/html/index.html'));
});

// function for getting environment variables to the frontend
router.get('/getEnv', function(req, res, next) {
	if (clientId == undefined || clientId == null)
		res.jsonp({status: "ERROR", msg:"client_id not found"});
	else
		res.jsonp({status: "OK", clientId: clientId, redirectUrl: redirectUrl, authApiUrl: authApiUrl, attributes: attributes});
});

// function for frontend to call backend
router.post('/getPersonData', function(req, res, next) {
	// get variables from frontend
	var code = req.body.code;

	var data;
    var request;
    
    // **** CALL TOKEN API ****
	//console.log ("###### CALLING TOKEN");
	request = createTokenRequest(tokenApiUrl, code, redirectUrl, clientId, clientSecret, privateKeyContent);
	
    request
        .buffer(true)
        .end(function (callErr, callRes) {
//        console.log("callErr: " + util.inspect(callErr, false, null));
//        console.log("callRes: "+ util.inspect(callRes, false, null));

        if (callErr) {
        	// ERROR
			console.log("ERROR: " + util.inspect(callErr, false, null));
        	res.jsonp({status: "ERROR", msg: callErr});
        } else {
        	// SUCCESSFUL
//            console.log("callRes.body: " + util.inspect(callRes.body, false, null));
//            console.log("callRes.text: " + util.inspect(callRes.text, false, null));

            var data = {body: callRes.body, text: callRes.text};
            //console.log("####### TOKEN Response:"+JSON.stringify(data));
            
			var accessToken = data.body.access_token;
			if (accessToken == undefined || accessToken == null) {
				res.jsonp({status: "ERROR", msg: "ACCESS TOKEN NOT FOUND"});
			}
			
			// everything ok, call person API
            callPersonAPI(accessToken, attributes, clientId, res);
        }
    });
	
	

});
 
function callPersonAPI (accessToken, attributes, clientId, res) {

	// validate and decode token to get UINFIN
	var decoded = securityHelper.verifyJWS(accessToken,publicCertContent);
	
	if (decoded == undefined || decoded == null) {
		res.jsonp({status: "ERROR", msg: "INVALID TOKEN"})
	}
	
	var uinfin = decoded.sub;
	 
    if (uinfin == undefined || uinfin == null) {
	    res.jsonp({status: "ERROR", msg: "UINFIN NOT FOUND"});
    } 
	
    // **** CALL PERSON API ****
	//console.log ("###### CALLING PERSON");
	var url = personApiUrl+ "/" + uinfin + "/";
	var request = createPersonRequest (url, uinfin, attributes, clientId, clientSecret, privateKeyContent, accessToken);
	
	// Invoke asynchronous call
    request
        .buffer(true)
        .end(function (callErr, callRes) {
//        console.log("callErr: " + util.inspect(callErr, false, null));
//        console.log("callRes: "+ util.inspect(callRes, false, null));

        if (callErr) {
        	// ERROR
			console.log("ERROR: " + util.inspect(callErr, false, null));
        	res.jsonp({status: "ERROR", msg: callErr});
        } else {
        	// SUCCESSFUL
//            console.log("callRes.body: " + util.inspect(callRes.body, false, null));
//            console.log("callRes.text: " + util.inspect(callRes.text, false, null));

            var data = {body: callRes.body, text: callRes.text};
            
			var personJWS = data.text;
			if (personJWS == undefined || personJWS == null) {
			    res.jsonp({status: "ERROR", msg: "PERSON DATA NOT FOUND"});
			} else {
				// verify signature & decode JWS to get the JSON
				var personData = securityHelper.verifyJWS(personJWS, publicCertContent);
				if (personData == undefined || personData == null) 
					res.jsonp({status: "ERROR", msg: "INVALID DATA OR SIGNATURE FOR PERSON DATA"});
				personData.uinfin = uinfin; // add the uinfin into the data to display on screen
				//console.log("PERSON DATA:"+JSON.stringify(personData));
				
				// successful. return data back to frontend
				res.jsonp({status: "OK", text: personData});
			}
        }
    });	
	
}


// function to prepare request for TOKEN API
function createTokenRequest(url, code, redirectUrl, clientId, clientSecret, privateKeyContent) {

    var cacheCtl = "no-cache";
    var contentType = "application/x-www-form-urlencoded";
    var method = "POST";

    // assemble params for Token API
    var strParams = "grant_type=authorization_code" 
				+ "&code=" + code 
				+ "&redirect_uri=" + redirectUrl
				+ "&client_id=" + clientId 
				+ "&client_secret=" + clientSecret
				;
    var params = querystring.parse(strParams);

    
    // assemble headers for Token API
    var strHeaders = "Content-Type=" + contentType + "&Cache-Control=" + cacheCtl;
    var headers = querystring.parse(strHeaders);
    
    // Add Authorisation headers for connecting to API Gateway
    var authHeaders = securityHelper.generateAuthorizationHeader(
    	url, 
    	params, 
    	method, 
    	contentType, 
    	"L2", 
    	clientId, 
    	privateKeyContent, 
    	clientSecret,
    	realm 
    	);
    	
    if(!_.isEmpty(authHeaders)) {
        _.set(headers, "Authorization", authHeaders);
        // console.log(headers);
    }
    
    var request = restClient.post(url);

    // Set headers
    if(!_.isUndefined(headers) && !_.isEmpty(headers)) 
    	request.set(headers);

    // Set Params
    if(!_.isUndefined(params) && !_.isEmpty(params))
        request.send(params);

	console.log("request:"+request);
	return request;
	
}



// function to prepare request for PERSON API
function createPersonRequest (url, uinfin, attributes, clientId, clientSecret, privateKeyContent, validToken) {

    var cacheCtl = "no-cache";
    var method = "GET";

    // assemble params for Person API
    var strParams = "client_id=" + clientId 
				+ "&attributes=" + attributes;
    var params = querystring.parse(strParams);

    
    // assemble headers for Person API
    var strHeaders = "Cache-Control=" + cacheCtl ; 
    var headers = querystring.parse(strHeaders);
    
    // Add Authorisation headers for connecting to API Gateway
    var authHeaders = securityHelper.generateAuthorizationHeader(
    	url, 
    	params, 
    	method, 
    	"", // no content type needed for GET 
    	"L2", 
    	clientId, 
    	privateKeyContent, 
    	clientSecret,
    	realm
    	);
    	
    if(!_.isEmpty(authHeaders)) {
 	   // NOTE: include access token in Authorization header as "Bearer " (with space behind)
        _.set(headers, "Authorization", authHeaders + ",Bearer " + validToken); 
        // console.log(headers);
    }
    
	// invoke token API
    var request = restClient.get(url);

    // Set headers
    if(!_.isUndefined(headers) && !_.isEmpty(headers)) 
    	request.set(headers);

    // Set Params
    if(!_.isUndefined(params) && !_.isEmpty(params))
        request.query(params);

	console.log("request:"+request);
	return request;

}



module.exports = router;
