var baseStringEnvSettings = {
    "TOKEN" : {
        "method": "POST"
        , "requiredParams": ["client_id", "client_secret", "code", "grant_type", "redirect_uri"]
        , "url" : {
            "STAGE": "https://myinfo.e.api.gov.sg/test/v1/token"
            , "PROD" : "https://myinfo.e.api.gov.sg/v1/token"
        }
        , accept: "application/x-www-form-urlencoded"
    }
    , "PERSON" : {
        "method": "GET"
        , "requiredParams": ["attributes", "client_id", "txnNo"]
        , "url": {
            "STAGE": "https://myinfo.e.api.gov.sg/test/v1/person/{UINFIN}/"
           , "PROD" : "https://myinfo.e.api.gov.sg/v1/person/{UINFIN}/"
        }
        , accept: "application/json"
    }
}

BaseStringGenerator = function() {};

BaseStringGenerator.generateBaseString = function(params) {
    var method = baseStringEnvSettings[params.api].method;
    var baseUrl = baseStringEnvSettings[params.api].url[params.environment];

    // For person API
    baseUrl = baseUrl.replace("{UINFIN}", params["uinfin"]);

    var baseString = method+"&"+baseUrl;

    // APEX requirement
    baseString += "&" + "apex_app_id="+params.client_id;
    baseString += "&" + "apex_nonce="+params.apex_nonce;
    baseString += "&" + "apex_signature_method=SHA256withRSA";
    baseString += "&" + "apex_timestamp="+params.apex_timestamp;
    baseString += "&" + "apex_version=1.0";


    var requiredParams = baseStringEnvSettings[params.api].requiredParams;
    var parametersStr = "";
    for (var i in requiredParams) {
        if (i != 0) {
            parametersStr += "&";
        }
        parametersStr += requiredParams[i] + "=" + params[requiredParams[i]];
    }
    baseString += "&"+parametersStr;



    var sampleRequest = method + " " + baseUrl + "\n";
    sampleRequest += "Content-Type: "+baseStringEnvSettings[params.api].contentType+"\n";
    sampleRequest += "{AUTHORIZATION_HEADER}\n";
    sampleRequest += "Accept: "+baseStringEnvSettings[params.api].accept + "\n";
    sampleRequest += "\n";
    if (method == "POST") {
        sampleRequest += parametersStr;
    }

    return { value : baseString, sampleRequest: sampleRequest};
}

BaseStringGenerator.prettyPrint = function(baseString) {
    baseString = BaseStringGenerator.concat(baseString);
    var baseStringParts = baseString.split("&");
    var prettyPrinted = "";
    for (var part in baseStringParts) {
        if (part > 0) {
            prettyPrinted += "&";
        }
        prettyPrinted += baseStringParts[part] + "\n";
    }

    return prettyPrinted;
}

BaseStringGenerator.concat = function(baseString) {
    var baseStringParts = baseString.split("\n");
    var raw = "";
    for (var part in baseStringParts) {
        raw += baseStringParts[part];
    }

    return raw;
}