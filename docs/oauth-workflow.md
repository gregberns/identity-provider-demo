



## Attribution

https://alexbilbie.com/guide-to-oauth-2-grants/
https://auth0.com/docs/flows/concepts/auth-code

## OAuth Terms

OAuth terms (taken from the core spec):

* Resource owner (a.k.a. the User) - An entity capable of granting access to a protected resource. When the resource owner is a person, it is referred to as an end-user.
* Resource server (a.k.a. the API server) - The server hosting the protected resources, capable of accepting and responding to protected resource requests using access tokens.
* Client - An application making protected resource requests on behalf of the resource owner and with its authorization. The term client does not imply any particular implementation characteristics (e.g. whether the application executes on a server, a desktop, or other devices).
* Authorization server - The server issuing access tokens to the client after successfully authenticating the resource owner and obtaining authorization.

## OAuth Grants

Grants (“methods”) for a client application to acquire an access token (which represents a user’s permission for the client to access their data) which can be used to authenticate a request to an API endpoint.



### Grant Types

* Authorization Code Grant
* Client Credentials Grant
* Implicit Flow Grant
* Resource Owner Credentials Grant

#### Authorization Code Grant

Because regular web apps are server-side apps where the source code is not publicly exposed, they can use the Authorization Code Flow (defined in defined in OAuth 2.0 RFC 6749, section 4.1), which exchanges an Authorization Code for a token. Your app must be server-side because during this exchange, you must also pass along your application's Client Secret, which must always be kept secure, and you will have to store it in your client.

[Source](https://auth0.com/docs/flows/concepts/auth-code)

![OAuth Authorization Code Grant](./APIgw_Oauth_web_server_flow.png)
[Source](https://docs.axway.com/bundle/APIGateway_762_OAuthUserGuide_allOS_en_HTML5/page/Content/OAuthGuideTopics/oauth_flows_auth_code.htm)

#### Client Credentials Grant

With machine-to-machine (M2M) applications, such as CLIs, daemons, or services running on your back-end, the system authenticates and authorizes the app rather than a user. For this scenario, typical authentication schemes like username + password or social logins don't make sense. Instead, M2M apps use the Client Credentials Flow (defined in OAuth 2.0 RFC 6749, section 4.4), in which they pass along their Client ID and Client Secret to authenticate themselves and get a token.

[Source](https://auth0.com/docs/flows/concepts/client-credentials)

#### Implicit Flow Grant

During authentication, single-page applications (SPAs) have some special requirements. Since the SPA is a public client, it is unable to securely store information such as a Client Secret. As such a special authentication flow exists called the OAuth 2.0 Implicit Flow (defined in OAuth 2.0 RFC 6749, section 4.2). Using the Implicit Flow streamlines authentication by returning tokens without introducing any unnecessary additional steps.

[Source](https://auth0.com/docs/flows/concepts/implicit)

#### Resource Owner Password Grant

The Resource Owner Password Grant (defined in RFC 6749, section 4.3) can be used directly as an authorization grant to obtain an Access Token, and optionally a Refresh Token. This grant should only be used when there is a high degree of trust between the user and the application and when other authorization flows are not available.

[Source](https://auth0.com/docs/api-auth/grant/password)

### Determine What type to use

Use [this guide](https://auth0.com/docs/api-auth/which-oauth-flow-to-use) to help guide you on the flow to use.


## Refresh Tokens

A Refresh Token contains the information required to obtain a new Access Token or ID Token.
Typically, a user needs a new Access Token when gaining access to a resource for the first time, or after the previous Access Token granted to them expires.

Refresh Tokens:

* Are subject to strict storage requirements to ensure that they are not leaked
* Can be revoked by the Authorization Server
* You can only get a Refresh Token if you are implementing the Authorization Code Flow

[Source](https://auth0.com/docs/tokens/refresh-token/current)
