# DEMO Client App for MyInfo Bank Pilot
This demo client is set up as a demo to show how to call the MyInfo APIs.

########################
## Environment Variables
########################
You will require the following environment variables before running the app:

MYINFO_APP_SIGNATURE_CERT_PRIVATE_KEY 
- This is your private key for RSA digital signature

MYINFO_CONSENTPLATFORM_SIGNATURE_CERT_PUBLIC_CERT
- This is the public cert from MyInfo Consent Platform given to you during onboarding for RSA digital signature

MYINFO_CLIENT_ID
- Your client_id provided to you during onboarding

MYINFO_CLIENT_SECRET
- Your client_secret provided to you during onboarding

MYINFO_APP_REDIRECT_URL
- The redirect URL of your application

MYINFO_APP_REALM
- The realm of your application - usually your web application URL domain e.g. "http://app.bank.com"

also the urls for the MyInfo APIs:
MYINFO_API_AUTHORISE
MYINFO_API_TOKEN
MYINFO_API_PERSON


## Set-up

```sh
$ cd {project folder}
$ npm install
$ npm start
```
This will run on localhost:3001


## Running
The flow is split into 3 main steps.
 - Step 1, Authenticate with SingPass and obtain user consent.
 - Step 2 - Get Access Token (POST).
 - Step 3 - Call API with Access Token (GET).
 
