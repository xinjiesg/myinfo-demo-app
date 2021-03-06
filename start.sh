export DEMO_APP_SIGNATURE_CERT_PRIVATE_KEY=./ssl/stg-demoapp-client-privatekey-2018.pem
export MYINFO_CONSENTPLATFORM_SIGNATURE_CERT_PUBLIC_CERT=./ssl/stg-auth-signing-public.pem

export MYINFO_APP_CLIENT_ID=STG2-MYINFO-SELF-TEST
export MYINFO_APP_CLIENT_SECRET=44d953c796cccebcec9bdc826852857ab412fbe2
export MYINFO_APP_REDIRECT_URL=http://localhost:3001/callback
export MYINFO_APP_REALM=http://localhost:3001

# L0 APIs
export AUTH_LEVEL=L0
export MYINFO_API_AUTHORISE='https://myinfosgstg.api.gov.sg/dev/v2/authorise'
export MYINFO_API_TOKEN='https://myinfosgstg.api.gov.sg/dev/v2/token'
export MYINFO_API_PERSON='https://myinfosgstg.api.gov.sg/dev/v2/person'

# L2 APIs
# export AUTH_LEVEL=L2
# export MYINFO_API_AUTHORISE='https://myinfosgstg.api.gov.sg/test/v2/authorise'
# export MYINFO_API_TOKEN='https://myinfosgstg.api.gov.sg/test/v2/token'
# export MYINFO_API_PERSON='https://myinfosgstg.api.gov.sg/test/v2/person'

npm start
                                                                                                                                                                                                                                                                 
