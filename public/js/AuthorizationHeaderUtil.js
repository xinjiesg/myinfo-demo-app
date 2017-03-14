var authHeaderEnvSettings = {
    "TOKEN" : {
        "requiredParams": ["realm", "apex_app_id", "apex_nonce", "apex_signature_method", "apex_signature", "apex_timestamp", "apex_version"]
    }
    , "PERSON" : {
        "requiredParams": ["realm", "apex_app_id", "apex_nonce", "apex_signature_method", "apex_signature", "apex_timestamp", "apex_version", "Bearer"]
    }

}

AuthorizationHeaderGenerator = function() {};

AuthorizationHeaderGenerator.generate = function(params) {
    var authorizationHeader = "Authorization: Apex ";

    var requiredParams = authHeaderEnvSettings[params.api].requiredParams;
    for (var i = 0; i< requiredParams.length; i++) {
        if (i != 0) {
            authorizationHeader += ",";
        }
        if (requiredParams[i] != "Bearer") {
            authorizationHeader += requiredParams[i] + "=\"" + params[requiredParams[i]]+"\"";
        } else {
            authorizationHeader += requiredParams[i] + " " + params[requiredParams[i]];
        }
    }

    return { "value" : authorizationHeader, "error" : ""};
}

AuthorizationHeaderGenerator.prettyPrint = function(authorizationHeader) {
    authorizationHeader = BaseStringGenerator.concat(authorizationHeader);
    var authorizationHeaderParts = authorizationHeader.split(",");
    var prettyPrinted = "";
    for (var part in authorizationHeaderParts) {
        if (part > 0) {
            prettyPrinted += ",";
        }
        prettyPrinted += authorizationHeaderParts[part] + "\n";
    }

    return prettyPrinted;
}

AuthorizationHeaderGenerator.concat = function(authorizationHeader) {
    var authorizationHeaderParts = authorizationHeader.split("\n");
    var raw = "";
    for (var part in authorizationHeaderParts) {
        raw += authorizationHeaderParts[part];
    }

    return raw;
}