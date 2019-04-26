var saml2 = require('saml2-js');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
 
// Create service provider
var sp_options = {
  entity_id: "http://localhost:3000/metadata.xml",
  private_key: fs.readFileSync("key-file.pem").toString(),
  certificate: fs.readFileSync("cert-file.crt").toString(),
  assert_endpoint: "http://localhost:3000/assert",
  audience: "demo",
  allow_unencrypted_assertion: true
};
var sp = new saml2.ServiceProvider(sp_options);
 
// Create identity provider
let realm = "master"
let client = "demo"
let baseUrl = "http://localhost:8080"
let loginUrl = `${baseUrl}/auth/realms/${realm}/protocol/saml/clients/${client}`
var idp_options = {
  sso_login_url: loginUrl,
  sso_logout_url: `${baseUrl}/logout`,
  certificates: [fs.readFileSync("cert-file-idp.crt").toString()]
};
var idp = new saml2.IdentityProvider(idp_options);
 
// ------ Define express endpoints ------
 
// Endpoint to retrieve metadata
app.get("/metadata.xml", function(req, res) {
  res.type('application/xml');
  res.send(sp.create_metadata());
});
 
// Starting point for login
app.get("/login", function(req, res) {
  console.log('/login called')
  sp.create_login_request_url(idp, {}, function(err, login_url, request_id) {
    if (err != null)
      return res.send(500);
    console.log(`login redirected to: ${login_url}`)
    res.redirect(login_url);
  });
});
 
// Assert endpoint for when login completes
app.post("/assert", function(req, res) {
  console.log('/assert called', req.body)
  var options = {request_body: req.body};
  sp.post_assert(idp, options, function(err, saml_response) {
    if (err != null) {
      console.error(err)
      return res.sendStatus(500);
    }
 
    // Save name_id and session_index for logout
    // Note: In practice these should be saved in the user session, not globally.
    name_id = saml_response.user.name_id;
    session_index = saml_response.user.session_index;
 
    console.log('saml_response', saml_response)
    res.json({username: saml_response.user.name_id});
  });
});
 
// Starting point for logout
app.get("/logout", function(req, res) {
  var options = {
    name_id: name_id,
    session_index: session_index
  };
 
  sp.create_logout_request_url(idp, options, function(err, logout_url) {
    if (err != null)
      return res.send(500);
    res.redirect(logout_url);
  });
});
 
app.listen(3000);