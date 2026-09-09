# YegnaBet
A general-purpose broker application with payment integration and advanced financial system

# Setup
## Backend
Open YegnaBet.API.slnx file in Visual Studio 2026 Community Edition. 
Opne Nuget packet manager console and select YegnaBet.Infrastructure as migration project for packet manager.
The type the follwing lines:
```
Add-Migration InitialCreate
Update-Database
```

Now you should have an empty database in Postgres SQL called `yegnabet` ready to rock.

Build the project using Visual Studio. The main server files are contained in YegnaBet.API.

## Frontend
Open directory for yegnabet-web using terminal. Then type the following to begin running the frontend server
in developer mode
```
npm run dev
```