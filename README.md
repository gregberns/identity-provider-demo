# Identity Provider Demo

## Purpose

Demonstrate:

* Standing up an Identity Provider (IDP)(user login provider)
* Import users from an LDAP instance via User Federation
* Connect a SAML Service Provider to support user authentication
* (hopefully) Use SAML auth to create OAuth JWT token

## Auth Mechanisms

Some docs to help understand SAML and OAuth:

* [How does SAML work](./docs/saml-workflow.md)

* [How does OAuth work and ways to](./docs/oauth-workflow.md)

## ToDo

* Standup Identity Provider (Complete)
* Connect to IDP with 'Service Provider' for SSO (Complete)
* Identity Provider provides OAuth token (Complete)
* Hook up Reverse-Proxy to handle API token validation ([using 'forward-auth'](https://github.com/gregberns/forward-auth))

Future:
* [Adding a Custom Theme to KeyCloak Login](https://github.com/jboss-dockerfiles/keycloak/blob/master/server/README.md#adding-a-custom-theme)


## Test LDAP Configuration

This repo will use an LDAP instance which contains a pre-populated set of 'people'.

[LDAP Container used](https://github.com/rroemhild/docker-test-openldap)

LDAP things:

```
dc=planetexpress,dc=com
ou=people,dc=planetexpress,dc=com
cn=Hubert J. Farnsworth,ou=people,dc=planetexpress,dc=com
```

## Configuring KeyCloak

Using KeyCloak as the Idenity Provider
https://github.com/jboss-dockerfiles/keycloak

Configuring the Image:
https://github.com/jboss-dockerfiles/keycloak/blob/master/server/README.md

### Configuring an LDAP User Federation Provider

First:

```
docker-compose up
```

Wait for the services to spin up. This may take a minute.

Go to `http://localhost:8080`

Then:

* Open KeyCloak Admin console
* Go to "User Federation"
* "Add Provider" > "ldap"
* Add configuration details
  * Vendor: "Other"
  * Connection Url: "LDAP://ldap"
  * Users DN: "ou=people,dc=planetexpress,dc=com"
  * Bind DN: "cn=admin,dc=planetexpress,dc=com"
  * Bind Credential: "GoodNewsEveryone"
* Test the "Connection URL"
* Test the Authentication
* Save
* "Syncronize all users"
* Go to "Manage" > "Users" on the left panel > Click "View all users"

You should see the users that have been added! Success!

## Service Provider Setup

Incomplete:

This configuration needs to be improved, it may not be completely correct.

* Go to Configure > Clients
* Select "Create"
  * "Client ID": "demo"
  * "Client Protocol": "saml"
  * "Client SAML Endpoint": "http://localhost:3000/"
* "Save"
* Update properties:
  * "IDP Initiated SSO URL Name": "demo"
  * "Sign Assertion" true
  * "Encrypt Assertions: false - This needs to be off for now
* Update "Fine Grain SAML Endpoint Configuration" properties
  * "Assertion Consumer Service POST Binding URL": "http://localhost:3000/assert"
  * "Logout Service POST Binding URL": "http://localhost:3000/logout" 
  
* Save
* Once created, go into "SAML Keys" tab
* Copy the certificate key to `service-provider/cert-file.crt` and the private key to `service-provider/key-file.pem`
* Then go to `Configure > Realm Settings > Keys > RSA256 > Certificate` and copy the cert to `service-provider/cert-file-idp.crt`


### OAuth/OpenId Service Provider

* Go to Configure > Clients
* Select "Create"
  * Client Id = "demo-oauth"
  * Client Protocol = "openid-connect"
  * Root Url: "http://localhost:8080/auth"
* Save
* "Valid Redirect URIs" : http://localhost:3001/

## Reverse-Proxy OpenId/OAuth Token Validation

To look at:

[Integrating Traefik with an OpenID Connect service](https://github.com/containous/traefik/pull/3216)
