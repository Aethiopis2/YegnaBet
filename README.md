# YegnaBet --- Mobile Testing on a Local Network

This guide explains how to run the YegnaBet customer-facing React
application on a physical mobile phone while the frontend, ASP.NET Core
API, and PostgreSQL database continue running on a development computer.

The setup is intended for **local development and testing only**. It
does not deploy YegnaBet to the internet and does not expose PostgreSQL
to the phone.

------------------------------------------------------------------------

## 1. How the local setup works

The phone and development computer must be connected to the same Wi-Fi
network.

``` text
┌──────────────────────────────┐
│       Samsung phone          │
│                              │
│  Chrome                      │
│  http://<PC-LAN-IP>:5173     │
└──────────────┬───────────────┘
               │
        Same Wi-Fi network
               │
┌──────────────▼───────────────┐
│       Development PC         │
│                              │
│  React / Vite                │
│  0.0.0.0:5173                │
│                              │
│  ASP.NET Core API            │
│  0.0.0.0:<API-PORT>          │
│  ├── REST endpoints          │
│  └── SignalR hub             │
│                              │
│  PostgreSQL                  │
│  localhost:5432              │
└──────────────────────────────┘
```

Replace `<PC-LAN-IP>` and `<API-PORT>` with the actual values on the
development computer.

Example values used throughout this guide:

-   PC LAN IPv4 address: `192.168.1.25`
-   React/Vite port: `5173`
-   ASP.NET Core API port: `5000`
-   PostgreSQL port: `5432`

These are examples, not assumptions about the actual project
configuration.

### Important networking rule

`localhost` always refers to the device making the request.

Therefore:

-   On the PC, `http://localhost:5000` refers to the API on the PC.
-   On the phone, `http://localhost:5000` refers to port 5000 on the
    phone itself.
-   From the phone, use the PC's LAN address, such as
    `http://192.168.1.25:5000`.

The API should continue connecting to PostgreSQL locally. The phone does
not need direct database access.

------------------------------------------------------------------------

## 2. Find the development computer's LAN address

On Windows, open Command Prompt or PowerShell and run:

``` powershell
ipconfig
```

Find the active Wi-Fi adapter and its `IPv4 Address`.

Example:

``` text
Wireless LAN adapter Wi-Fi:

   IPv4 Address. . . . . . : 192.168.1.25
```

Use the IPv4 address belonging to the network to which the phone is
connected. Do not use an address from a disconnected adapter, VPN, or
virtual network adapter.

You can check connectivity by opening the PC's address from the phone
after the frontend has been started.

If the PC's address changes after reconnecting to Wi-Fi, update the
frontend API URL and CORS origin accordingly. A DHCP reservation on the
router can make the address stable, but it is optional for basic
testing.

------------------------------------------------------------------------

## 3. Configure the React/Vite development server

Vite normally binds to localhost. A phone on the LAN cannot reach that
listener. Configure Vite to listen on all network interfaces.

### Option A --- Run with a command-line flag

From the frontend project directory:

``` powershell
npm run dev -- --host 0.0.0.0
```

### Option B --- Configure `vite.config.ts`

Add or merge the following `server` settings into the existing
`defineConfig` configuration. Do not replace unrelated Vite plugins,
aliases, or existing settings.

``` typescript
server: {
  host: "0.0.0.0",
  port: 5173,
  strictPort: true
}
```

`strictPort: true` prevents Vite from silently selecting another port if
5173 is already occupied. This keeps the URL consistent with the
configured API/client environment.

Start the frontend:

``` powershell
npm run dev
```

Then open this address on the phone:

``` text
http://<PC-LAN-IP>:5173
```

For the example IP:

``` text
http://192.168.1.25:5173
```

------------------------------------------------------------------------

## 4. Configure the frontend API base URL

The browser on the phone must send API requests to the PC's LAN address,
not to `localhost`.

Find the central API base URL configuration. In the reviewed project,
the API base URL was identified in:

``` text
yegnabet-web/src/types/api.ts
```

Check the current source before editing because the exact location or
name may have changed.

For a simple local test, the base URL should resolve to:

``` typescript
export const BASE_URL_STRING =
  "http://192.168.1.25:5000";
```

Use the actual PC IP and API port. Ensure the existing Axios instance
uses this shared base URL rather than defining another hardcoded
`localhost` address.

### Search for other localhost references

Search the frontend source for:

-   `localhost`
-   `127.0.0.1`
-   hardcoded API hostnames
-   hardcoded upload or image URLs
-   hardcoded SignalR hub URLs

A frontend API base URL change does not automatically fix unrelated
absolute URLs. Images, uploaded files, avatars, downloads, and other
API-hosted resources must also use a host reachable from the phone.

Prefer one shared API base URL for API and API-hosted resources where
the existing project design supports it. Avoid changing unrelated URL
construction without checking its current behavior.

------------------------------------------------------------------------

## 5. Configure ASP.NET Core to listen on the LAN

The API must bind to a network interface that accepts connections from
the phone.

### Option A --- `launchSettings.json`

Open the API project's:

``` text
Properties/launchSettings.json
```

Find the HTTP launch profile and set its application URL to:

``` json
"applicationUrl": "http://0.0.0.0:5000"
```

Keep the existing profile name, environment variables, launch settings,
and other profiles. Only adjust the HTTP profile that you intend to use.

### Option B --- Environment variable

For a PowerShell session, you can instead set:

``` powershell
$env:ASPNETCORE_URLS = "http://0.0.0.0:5000"
```

Then start the API from that same PowerShell session.

Use one consistent port between the API listener, frontend base URL,
CORS configuration, and SignalR URL.

------------------------------------------------------------------------

## 6. Configure CORS for the phone's frontend origin

CORS checks the browser origin. When the app is opened on the phone, the
origin is the PC LAN address and Vite port, not `localhost`.

For example:

``` text
http://192.168.1.25:5173
```

The API's CORS policy must allow both the existing local development
origin and the phone-facing origin.

Example:

``` csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("web", policy =>
        policy.WithOrigins(
            "http://localhost:5173",
            "http://192.168.1.25:5173"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});
```

Important:

-   Replace the example IP with the actual PC LAN address.
-   Preserve the policy name used by the existing application.
-   Preserve any existing origins that are still required.
-   Keep `AllowCredentials()` if required by the existing SignalR/client
    authentication configuration.
-   Do not combine `AllowAnyOrigin()` with credentialed CORS.
-   Ensure the existing `app.UseCors(...)` middleware remains in the
    correct place in the ASP.NET Core pipeline, before endpoint
    execution and with the application's existing
    authentication/authorization ordering respected.

CORS is not a substitute for authentication or authorization. The API
must continue validating JWTs and resource permissions.

------------------------------------------------------------------------

## 7. HTTPS and development certificates

A development HTTPS certificate installed on the PC is not automatically
trusted by the phone. If the phone accesses an HTTPS endpoint using an
untrusted development certificate, the browser or SignalR connection may
fail.

For an initial isolated LAN test, HTTP can be simpler. If the
application currently redirects HTTP to HTTPS, review:

``` csharp
app.UseHttpsRedirection();
```

A development-only configuration may avoid redirecting local HTTP
requests:

``` csharp
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
```

Only use this if it matches the application's intended development
setup. Do not remove HTTPS redirection globally as a shortcut, and do
not use plain HTTP for a public deployment or over an untrusted network.

If HTTPS is required for the test, configure a certificate that the
phone trusts and use HTTPS consistently for the frontend, API, and
SignalR connection.

------------------------------------------------------------------------

## 8. SignalR and realtime messaging

YegnaBet already uses SignalR through the existing `BrokerHub` and the
`/hubs/broker` endpoint.

The phone must connect to the API host reachable over the LAN. With the
example configuration:

``` text
http://192.168.1.25:5000/hubs/broker
```

If the frontend constructs the hub URL from the shared
`BASE_URL_STRING`, changing that base URL should also change the hub
host. Verify the actual SignalR connection code rather than assuming all
URLs use the shared value.

Check the following:

1.  The API is listening on the LAN interface.
2.  The hub endpoint is mapped and reachable.
3.  The frontend uses the PC LAN IP, not `localhost`.
4.  The existing JWT is supplied using the project's current SignalR
    authentication approach.
5.  CORS allows the phone's frontend origin.
6.  Windows Firewall permits the API port on the private network.
7.  The browser/network allows the WebSocket connection. SignalR may use
    other transports as fallback depending on configuration.

Do not create a second hub merely for mobile testing. The phone is
another client of the same application and should use the existing
realtime infrastructure.

------------------------------------------------------------------------

## 9. Windows Defender Firewall

Even when Vite and ASP.NET Core listen on all interfaces, Windows
Firewall can block incoming connections.

Create inbound TCP rules for the development ports:

  Port     Purpose
  -------- ------------------------------
  `5173`   Vite development server
  `5000`   ASP.NET Core API and SignalR

Use the actual API port if it is not 5000.

Recommended restrictions:

-   Apply the rules to the **Private** network profile only.
-   Limit remote addresses to the local subnet if practical.
-   Do not create public-network rules unless there is a specific,
    reviewed requirement.
-   Do not expose PostgreSQL port `5432` to the phone.

You can manage rules through:

1.  Windows Defender Firewall with Advanced Security.
2.  Inbound Rules.
3.  New Rule.
4.  Port.
5.  TCP and the relevant local port.
6.  Allow the connection.
7.  Select Private.
8.  Give the rule a clear name, such as `YegnaBet Vite LAN` or
    `YegnaBet API LAN`.

------------------------------------------------------------------------

## 10. Start the application

Start services in this order:

1.  Start PostgreSQL on the development computer.
2.  Start `YegnaBet.API` in Visual Studio using the intended
    HTTP/Development profile.
3.  Confirm the API starts without database or configuration errors.
4.  Start the React frontend:

``` powershell
npm run dev
```

5.  Connect the phone to the same Wi-Fi network.
6.  Open Chrome on the phone.
7.  Navigate to:

``` text
http://<PC-LAN-IP>:5173
```

For the example IP:

``` text
http://192.168.1.25:5173
```

The API and database remain on the development computer. The phone only
uses the web frontend and API.

------------------------------------------------------------------------

## 11. Mobile testing checklist

### Network and application access

-   [ ] Phone and PC are connected to the same Wi-Fi.
-   [ ] Vite is listening on `0.0.0.0`.
-   [ ] ASP.NET Core is listening on `0.0.0.0`.
-   [ ] The frontend opens using the PC LAN IP.
-   [ ] API requests reach the PC.
-   [ ] No frontend requests unexpectedly target phone-local
    `localhost`.
-   [ ] Images and uploaded resources load.
-   [ ] No CORS errors appear in browser debugging tools or API logs.

### Customer experience

-   [ ] Homepage loads.
-   [ ] Listings and images load.
-   [ ] Search and filters work.
-   [ ] Listing details open.
-   [ ] Login and registration work.
-   [ ] The Message Broker action prompts for login when the customer is
    anonymous.
-   [ ] The existing animated login dialog remains functional.
-   [ ] After login, the intended employee conversation opens.
-   [ ] Sending a message works.
-   [ ] Existing listing and viewing-request actions still work.
-   [ ] Light and dark themes remain usable.
-   [ ] Layout fits the phone viewport without horizontal overflow.

### Realtime messaging

-   [ ] SignalR connects successfully.
-   [ ] A message sent from another browser arrives without refreshing.
-   [ ] Unread count updates.
-   [ ] Opening the conversation marks messages as read.
-   [ ] Read state updates for the other participant as designed.
-   [ ] Reconnecting after a temporary network interruption restores
    access to persisted messages.

------------------------------------------------------------------------

## 12. Troubleshooting

  ---------------------------------------------------------------------------
  Symptom                 Likely cause            What to check
  ----------------------- ----------------------- ---------------------------
  Phone cannot open the   Vite only listens on    Start with `--host 0.0.0.0`
  frontend                localhost               

  Frontend opens but API  API binding or firewall Check API URL, listener,
  fails                                           port and firewall

  Browser reports CORS    LAN origin is not       Add
  failure                 allowed                 `http://<PC-LAN-IP>:5173`
                                                  to the existing CORS policy

  API redirects to HTTPS  Development HTTPS       Check launch profile and
                          redirection             `UseHttpsRedirection()`

  Login fails on phone    Wrong API host, CORS or Inspect the actual failed
                          cookie/token            request and authentication
                          assumptions             response

  SignalR fails while     Hub URL, JWT, CORS or   Inspect `/hubs/broker`
  REST works              WebSocket issue         connection and server logs

  Images do not load      Absolute URLs still use Search image and upload URL
                          localhost               construction

  Works on Wi-Fi but not  The PC is not publicly  Expected for LAN-only
  mobile data             reachable               testing

  It stopped working      PC LAN IP changed       Run `ipconfig` again and
  after reconnecting                              update the LAN
  Wi-Fi                                           configuration
  ---------------------------------------------------------------------------

------------------------------------------------------------------------

## 13. Security boundaries

This configuration is for local development on a trusted private
network.

-   Do not expose PostgreSQL to the phone.
-   Do not expose the development API or Vite server to the public
    internet.
-   Do not disable JWT validation or authorization to make testing
    easier.
-   Do not use permissive credentialed CORS.
-   Do not put production secrets in frontend code.
-   Do not use HTTP over an untrusted network.
-   Keep development-only configuration separate from production
    configuration.

For production, use a proper HTTPS domain, production hosting,
restrictive CORS, secure authentication settings, and a
deployment-specific configuration.

------------------------------------------------------------------------

## 14. Quick reference

  Component      Example address
  -------------- ----------------------------------------
  Customer app   `http://192.168.1.25:5173`
  API            `http://192.168.1.25:5000`
  SignalR        `http://192.168.1.25:5000/hubs/broker`
  PostgreSQL     `localhost:5432` from the API host

Replace the example IP and ports with the actual values in your
environment.

### Final principle

The mobile phone is simply another browser client. Keep the existing
application architecture, authentication, API contracts, database
access, and SignalR hub. For local mobile testing, the essential changes
are network binding, the frontend's API host, CORS, development HTTPS
handling where necessary, and firewall access.
