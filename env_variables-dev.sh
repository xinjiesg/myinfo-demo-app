export MYINFO_APP_SIGNATURE_CERT_PRIVATE_KEY=$(cat ./ssl/testapp_private.pem)
export MYINFO_CONSENTPLATFORM_SIGNATURE_CERT_PUBLIC_CERT=$(cat ./ssl/stg-auth-signing-public.pem)

export MYINFO_APP_CLIENT_ID=my_client_id
export MYINFO_APP_CLIENT_SECRET=my_client_secret
export MYINFO_APP_REDIRECT_URL=http://localhost:3001/callback
export MYINFO_APP_REALM=http://localhost:3001

export MYINFO_API_AUTHORISE='https://myinfo.api.gov.sg/test/v1/authorise'
export MYINFO_API_TOKEN='https://myinfo.api.gov.sg/test/v1/token'
export MYINFO_API_PERSON='https://myinfo.api.gov.sg/test/v1/person'
