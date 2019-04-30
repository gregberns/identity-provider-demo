# OAuth Workflow

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

## Example:

Call 1:
```
http://localhost:3000/login

302 Redirect 
Location: http://localhost:8080/auth/realms/master/protocol/openid-connect/auth?client_id=demo-oauth&state=ee4332aa-f3dc-4abf-8244-7d7ac160e7ef&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fauth_callback%3D1&scope=openid&response_type=code
```

Call 2:
```
http://localhost:8080/auth/realms/master/protocol/openid-connect/auth?client_id=demo-oauth&state=ee4332aa-f3dc-4abf-8244-7d7ac160e7ef&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fauth_callback%3D1&scope=openid&response_type=code

302 Redirect
Location: http://localhost:3000/login?auth_callback=1&state=ee4332aa-f3dc-4abf-8244-7d7ac160e7ef&session_state=6483dd71-f46f-40e4-80d2-dca4c80a99d9&code=dc72ab15-8417-494a-9db1-611f658dd235.6483dd71-f46f-40e4-80d2-dca4c80a99d9.8d14e474-9447-48f2-b49b-59a6c5d8b07e

Set-Cookie: KC_RESTART=eyJhbGciOiJIU...
Set-Cookie: KC_RESTART=; Version=1; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Max-Age=0; Path=/auth/realms/master/; HttpOnly
Set-Cookie: KEYCLOAK_IDENTITY=eyJhbGciOiJIUzI1N
Set-Cookie: KEYCLOAK_SESSION=master/cb3dc7b5-c475-4ca9-8198-ad7e04889adf/6483dd71-f46f-40e4-80d2-dca4c80a99d9; Version=1; Expires=Sat, 27-Apr-2019 02:51:09 GMT; Max-Age=36000; Path=/auth/realms/master/
Set-Cookie: KEYCLOAK_REMEMBER_ME=; Version=1; Comment=Expiring cookie; Expires=Thu, 01-Jan-1970 00:00:10 GMT; Max-Age=0; Path=/auth/realms/master/; HttpOnly
```

Response:

```
{
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJZcGtwRnE0cTRzaDdwUmlIaWFVM1hieFFCSndqZEk5eU84Rmx3VXZsOU1JIn0.eyJqdGkiOiIyNmE4MzIyZS00MTNhLTQwYWQtYjY2Mi1hNjgwZGIyYjIxMzAiLCJleHAiOjE1NTYyOTc1MjksIm5iZiI6MCwiaWF0IjoxNTU2Mjk3NDY5LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjpbIm1hc3Rlci1yZWFsbSIsImFjY291bnQiXSwic3ViIjoiY2IzZGM3YjUtYzQ3NS00Y2E5LTgxOTgtYWQ3ZTA0ODg5YWRmIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZGVtby1vYXV0aCIsImF1dGhfdGltZSI6MTU1NjI5NjU0Nywic2Vzc2lvbl9zdGF0ZSI6IjY0ODNkZDcxLWY0NmYtNDBlNC04MGQyLWRjYTRjODBhOTlkOSIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJjcmVhdGUtcmVhbG0iLCJvZmZsaW5lX2FjY2VzcyIsImFkbWluIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJtYXN0ZXItcmVhbG0iOnsicm9sZXMiOlsidmlldy1pZGVudGl0eS1wcm92aWRlcnMiLCJ2aWV3LXJlYWxtIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwicXVlcnktcmVhbG1zIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIn0.MJJ1gH-dILTg4xx7RvGZP4KWQtiQtSYr9A9mvJjI1eCoW1Qk4UB6j9nvwskY579lURJxkIBv2kDNdzm80n1CNQiXCnCWPwRQWtvBPQA40M_0nCLWV3p5IcRi4osj1si6-e24HfVagmwvpHaJK3UJ2GSfPo95bacIWTQzaV3AlMqaEFLNiuq5IaoWe3K2CPHeQ-tUQUwHrGw-SUCXkNiwTD3HzU9slcMpFsX-eW_DYH4eaOzBZCP8KcH759kUbTwjG8I70fo93USiu0WD--MMjaLjpQkpZCjM4BCvQKx2WQjVf0_IhmvT5AFAJiRZNxIvsyg6fybF_QQoyFGmO6-8Lg",
    "expires_in": 60,
    "refresh_expires_in": 1800,
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhMzgyYmE0My0zMGRhLTQzNWUtYjg1NC1iODRmN2RiMjA4MWMifQ.eyJqdGkiOiI3YjBhNWI3My1hMjg5LTQxNTctYWVlYi02NGM4N2JiZGEzMWUiLCJleHAiOjE1NTYyOTkyNjksIm5iZiI6MCwiaWF0IjoxNTU2Mjk3NDY5LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgvcmVhbG1zL21hc3RlciIsInN1YiI6ImNiM2RjN2I1LWM0NzUtNGNhOS04MTk4LWFkN2UwNDg4OWFkZiIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJkZW1vLW9hdXRoIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiNjQ4M2RkNzEtZjQ2Zi00MGU0LTgwZDItZGNhNGM4MGE5OWQ5IiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNyZWF0ZS1yZWFsbSIsIm9mZmxpbmVfYWNjZXNzIiwiYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7Im1hc3Rlci1yZWFsbSI6eyJyb2xlcyI6WyJ2aWV3LWlkZW50aXR5LXByb3ZpZGVycyIsInZpZXctcmVhbG0iLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiaW1wZXJzb25hdGlvbiIsImNyZWF0ZS1jbGllbnQiLCJtYW5hZ2UtdXNlcnMiLCJxdWVyeS1yZWFsbXMiLCJ2aWV3LWF1dGhvcml6YXRpb24iLCJxdWVyeS1jbGllbnRzIiwicXVlcnktdXNlcnMiLCJtYW5hZ2UtZXZlbnRzIiwibWFuYWdlLXJlYWxtIiwidmlldy1ldmVudHMiLCJ2aWV3LXVzZXJzIiwidmlldy1jbGllbnRzIiwibWFuYWdlLWF1dGhvcml6YXRpb24iLCJtYW5hZ2UtY2xpZW50cyIsInF1ZXJ5LWdyb3VwcyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.he4-god7l9B_BddKxheJUw054gcrZYsURMVjbsv7njk",
    "token_type": "bearer",
    "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJZcGtwRnE0cTRzaDdwUmlIaWFVM1hieFFCSndqZEk5eU84Rmx3VXZsOU1JIn0.eyJqdGkiOiJjNDQ0Yjk3Ni0zNTE1LTQ1N2UtODQ3NC1hNGQ5NzExNTE5ZjMiLCJleHAiOjE1NTYyOTc1MjksIm5iZiI6MCwiaWF0IjoxNTU2Mjk3NDY5LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjoiZGVtby1vYXV0aCIsInN1YiI6ImNiM2RjN2I1LWM0NzUtNGNhOS04MTk4LWFkN2UwNDg4OWFkZiIsInR5cCI6IklEIiwiYXpwIjoiZGVtby1vYXV0aCIsImF1dGhfdGltZSI6MTU1NjI5NjU0Nywic2Vzc2lvbl9zdGF0ZSI6IjY0ODNkZDcxLWY0NmYtNDBlNC04MGQyLWRjYTRjODBhOTlkOSIsImFjciI6IjAiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIn0.fjJ7peLLy4YCeGkjhJhIDdxsK8GdhrXnmmYsPoYcYa113W7fy_XFZNLmYUxIsDZ_nf6I5BiV0yuVhvVeKl2L8yNzEi-p8ToS0MXlnSBX7dLFzi_8RLpzaEiiTapt5nYoazeHEf3SN5kE13m-G9mlikLPnoL7QCKuXoQXSbo9gpcrzmX-dfS1bXQp09Wtt9Z5sriEUXtMRxFYPQh10fRnZXTnHk3uAQy36Sgx8uU_XRZaRD0u_u0_tDd_tXW-KtYDG9UCytRiMGxyZ9AMOcde0Gtg5dZjWDFbJRSQCyDS0zdoKqZCkPGOurZwZttMYqUP4pG7KMxNXTeztgJvwphv-A",
    "not-before-policy": 0,
    "session_state": "6483dd71-f46f-40e4-80d2-dca4c80a99d9",
    "scope": "openid profile email"
}
```

