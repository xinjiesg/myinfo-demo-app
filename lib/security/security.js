const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const nonce = require('nonce')();
const crypto = require('crypto');
const qs = require('querystring');
const jwt = require('jsonwebtoken');

var security = {};

// Sorts a JSON object based on the key value in alphabetical order
function sortJSON(json) {
    if (_.isNil(json)) {
        return json;
    }

    var newJSON = {};
    var keys = Object.keys(json);
    keys.sort();

    for (key in keys) {
        newJSON[keys[key]] = json[keys[key]];
    }

    return newJSON;
};

/**
 * @param url Full API URL
 * @param params JSON object of params sent, key/value pair.
 * @param method
 * @param appId ClientId
 * @param keyCertContent Private Key Certificate content
 * @param keyCertPassphrase Private Key Certificate Passphrase
 * @returns {string}
 */
function generateSHA256withRSAHeader(url, params, method, strContentType, appId, keyCertContent, keyCertPassphrase, realm) {
    var nonceValue = nonce();
    var timestamp = (new Date).getTime();

    var defaultApexHeaders = {
        "apex_app_id": appId,
        "apex_nonce": nonceValue,
        "apex_signature_method": "SHA256withRSA",
        "apex_timestamp": timestamp,
        "apex_version": "1.0"
    };

    // Remove params unless Content-Type is "application/x-www-form-urlencoded"
    if(method == "POST" && strContentType!="application/x-www-form-urlencoded") {
        params = {};
    }

    // console.log("params:" + params);

    // merge default headers with query/body params and sort alphabetically.
    var baseParams = sortJSON(_.merge(defaultApexHeaders, params));

    var baseParamsStr = qs.stringify(baseParams);
    baseParamsStr = qs.unescape(baseParamsStr);

    // base string required by crypto to hash and sign the signature token for API gateway
    var baseString = method.toUpperCase() + "&" + url + "&" + baseParamsStr;

    console.log("baseString:\n"+baseString);

    var signWith = {
        key: keyCertContent
    };
    if (!_.isUndefined(keyCertPassphrase) && !_.isEmpty(keyCertPassphrase)) _.set(signWith, "passphrase", keyCertPassphrase);

    // console.log("signWith:"+signWith);

    // Load pem file containing the x509 cert & private key & sign the base string with it.
    var signature = crypto.createSign('RSA-SHA256')
        .update(baseString)
        .sign(signWith, 'base64');

    // console.log("signature:\n"+signature);

    var strApexHeader = "Apex realm=\""+realm+"\",apex_timestamp=\"" + timestamp +
        "\",apex_nonce=\"" + nonceValue + "\",apex_app_id=\"" + appId +
        "\",apex_signature_method=\"SHA256withRSA\",apex_version=\"1.0\",apex_signature=\"" + signature +
        "\"";

    return strApexHeader;
};

/**
 * @param url API URL
 * @param params JSON object of params sent, key/value pair.
 * @param method
 * @param appId API ClientId
 * @param passphrase API Secret or certificate passphrase
 * @returns {string}
 */
security.generateAuthorizationHeader = function (url, params, method, strContentType, authType, appId, keyCertContent, passphrase, realm) {
    // NOTE: need to include the ".e." in order for the security authorisation header to work
    url = _.replace(url, ".api.gov.sg", ".e.api.gov.sg");
	
	if (authType == "L2") {
        return generateSHA256withRSAHeader(url, params, method, strContentType, appId, keyCertContent, passphrase, realm);
    } else {
        return "";
    }

};


// Verify & Decode JWS or JWT
security.verifyJWS = function verifyJWS(jws, publicCert){
	//console.log("JWS:"+jws);
	// verify token
	// ignore notbefore check because it gives errors sometimes if the call is too fast.
	var decoded = jwt.verify(jws, publicCert, { algorithms: ['RS256'], ignoreNotBefore:true }); 
	return decoded; 
}


module.exports = security;