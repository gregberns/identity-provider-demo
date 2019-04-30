
var fs = require('fs');
var express = require('express');
var app = express();
var session = require('express-session');
var Keycloak = require('keycloak-connect');
var bodyParser = require('body-parser');
var hogan = require('hogan-express');
app.use(bodyParser.urlencoded({
  extended: true
}));

// Register '.mustache' extension with The Mustache Express
app.set('view engine', 'html');
app.set('views', require('path').join(__dirname, '/view'));
app.engine('html', hogan);

// A normal un-protected public URL.

app.get('/', function (req, res) {
  res.render('index');
});

var memoryStore = new session.MemoryStore();

app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

let kcConfig = {
  clientId: 'demo',
  bearerOnly: true,
  serverUrl: 'http://localhost:8080/auth',
  realm: 'master',
  realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmI0tXb381TxApeYofQRJ/PS2AfeJX9RTHljfUEasI2ho+7iLtWqGwVhZpKgEdzSBrEw/BPjXvYWIywtup+o8fGGc3Y37YeN1f9uuiytUKTfSiEfvA09qivhZp+FfZMV76Opbsgw+tVsN3OHzY3MzBzEBfYSG4C6lopvu9z00H3wAKPVX3NLzKubBRna7Ak+qDQgYDjQRVStcvmuXTlPYamMwVxRoXWPHBzYJiuD6yfkOwNnu5/CHpiOjygwvkoQEY6f0QFdS6bEu6iJBOSohhWhIecyqC2IOGVapR6X9yjabRppUAQNNXJztdqM3WDsJWafqANLsFlIgVrcRojLm7wIDAQAB'
};

// {
//   "realm" : "master",
//   "realm-public-key" : "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmI0tXb381TxApeYofQRJ/PS2AfeJX9RTHljfUEasI2ho+7iLtWqGwVhZpKgEdzSBrEw/BPjXvYWIywtup+o8fGGc3Y37YeN1f9uuiytUKTfSiEfvA09qivhZp+FfZMV76Opbsgw+tVsN3OHzY3MzBzEBfYSG4C6lopvu9z00H3wAKPVX3NLzKubBRna7Ak+qDQgYDjQRVStcvmuXTlPYamMwVxRoXWPHBzYJiuD6yfkOwNnu5/CHpiOjygwvkoQEY6f0QFdS6bEu6iJBOSohhWhIecyqC2IOGVapR6X9yjabRppUAQNNXJztdqM3WDsJWafqANLsFlIgVrcRojLm7wIDAQAB",
//   "auth-server-url" : "http://localhost:8080/auth",
//   "ssl-required" : "external",
//   "resource" : "nodejs-connect",
//   "public-client" : true
// }

//let keycloak = new Keycloak({ store: memoryStore }, kcConfig);
let keycloak = new Keycloak({ store: memoryStore });

app.use(keycloak.middleware({
  logout: '/logout',
  admin: '/',
  protected: '/protected/resource'
}));

app.get('/login', keycloak.protect(), function (req, res) {
  res.render('index', {
    result: JSON.stringify(JSON.parse(req.session['keycloak-token']), null, 4),
    event: '1. Authentication\n2. Login'
  });
});

app.get('/protected/resource1', keycloak.checkSso(), function (req, res) {
  res.render('index', {
    result: JSON.stringify(JSON.parse(req.session['keycloak-token']), null, 4),
    event: '1. Access granted to Resource 1\n'
  });
});

app.get('/protected/resource2', keycloak.protect(), function (req, res) {
  res.render('index', {
    result: JSON.stringify(JSON.parse(req.session['keycloak-token']), null, 4),
    event: '1. Access granted to Resource 1\n'
  });
});
 
app.listen(3001);