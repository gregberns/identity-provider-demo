# Identity Provider Demo






Steps:

* Standup Identity Provider
* Connect to IDP with 3rd Party service for SSO
* Identity Provider provides OAuth token
* Hook up Reverse-Proxy to handle API token validation

Future:
* [Adding a Custom Theme to KeyCloak](https://github.com/jboss-dockerfiles/keycloak/blob/master/server/README.md#adding-a-custom-theme)


## Test LDAP Configuration

This repo will use an LDAP instance which contains a pre-populated set of 'people'

https://github.com/rroemhild/docker-test-openldap

Examples:

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
* Go to "Manage" > "Users" on the left panel

You should see the users that have been added! Success!



## Service Provider Setup

* Go to Configure > Clients
* Select "Create"
  * "Client ID": "demo"
  * "Client Protocol": "saml"
  * "Client SAML Endpoint": "http://localhost:3000/"
  * "IDP Initiated SSO URL Name": "demo"
  * "Fine Grain SAML Endpoint Configuration" > "Assertion Consumer Service POST Binding URL" : "http://localhost:3000/assert"
  * "Fine Grain SAML Endpoint Configuration" > "Logout Service POST Binding URL": "http://localhost:3000/logout" 

"Sign Assertion" True
"Encrypt Assertions: true


* Save
* Once created, go into "SAML Keys" tab
* Copy the certificate key to `service-provider/cert-file.crt` and the private key to `service-provider/key-file.pem`
* Then go to `Configure > Realm Settings > Keys > RSA256 > Certificate` and copy the cert to `service-provider/cert-file-idp.crt`




## Reverse-Proxy OpenId/OAuth Token Validation

Integrating Traefik with an OpenID Connect service
https://github.com/containous/traefik/pull/3216