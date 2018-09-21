## MyInfo Demo App Setup

### 1.1 Install Node and NPM

In order for the demo application to run, you will need to install Node and NPM.

Follow the instructions given by the links below depending on your OS.

- [Install Node and NPM for Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows)
- [Install Node and NPM for Linux](http://blog.teamtreehouse.com/install-node-js-npm-linux)
- [nstall Node and NPM for Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac)


### 1.2 Run NPM install

Run the following command in the folder you unzipped the application:
```
npm install
```

### 1.3 Start the Application

**For Linux/MacOS**

Execute the following command to start the application:
```
  ./start.sh
```


**For Windows**

Execute the following command to start the application:
```
  .\start.bat
```


**Access the Application on Your Browser**
You should be able to access the sample application via the following URL:

```
http://localhost:3001
```

![Demo Screenshot](screenshot.png)

---
## Login with SingPass

Use this test ID and password to login to SingPass:

NRIC: ``S9812381D``
Password: ``MyInfo2o15``

---
## Enable PKI Digital Signature

**For Linux/MacOS**

Edit the ``start.sh``. Look for ``L0 APIs``, Comment out these configurations,
```
# L0 APIs
# export AUTH_LEVEL=L0
# export MYINFO_API_AUTHORISE='https://myinfosgstg.api.gov.sg/dev/v2/authorise'
# export MYINFO_API_TOKEN='https://myinfosgstg.api.gov.sg/dev/v2/token'
# export MYINFO_API_PERSON='https://myinfosgstg.api.gov.sg/dev/v2/person'
```
Look for ``L2 APIs``, uncomment these configurations,
```
# L2 APIs
export AUTH_LEVEL=L2
export MYINFO_API_AUTHORISE='https://myinfosgstg.api.gov.sg/test/v2/authorise'
export MYINFO_API_TOKEN='https://myinfosgstg.api.gov.sg/test/v2/token'
export MYINFO_API_PERSON='https://myinfosgstg.api.gov.sg/test/v2/person'
```
Execute the following command to start the application:
```
  ./start.sh
```

**For Windows**

Edit the ``start.bat``. Look for ``L0 APIs``, comment out these configurations,
```
rem L0 APIs
rem set AUTH_LEVEL=L0
rem set MYINFO_API_AUTHORISE='https://myinfosgstg.api.gov.sg/dev/v2/authorise'
rem set MYINFO_API_TOKEN='https://myinfosgstg.api.gov.sg/dev/v2/token'
rem set MYINFO_API_PERSON='https://myinfosgstg.api.gov.sg/dev/v2/person'
```
Look for ``L2 APIs``, uncomment these configurations,
```
rem L2 APIs
set AUTH_LEVEL=L2
set MYINFO_API_AUTHORISE='https://myinfosgstg.api.gov.sg/test/v2/authorise'
set MYINFO_API_TOKEN='https://myinfosgstg.api.gov.sg/test/v2/token'
set MYINFO_API_PERSON='https://myinfosgstg.api.gov.sg/test/v2/person'
```
Execute the following command to start the application:
```
  .\start.bat
```

---

## Reporting issues

If you would like request for new features or report any bugs, please post it to the [GitHub issue tracker](https://github.com/jamesleegovtech/myinfo-demo-app/issues).
