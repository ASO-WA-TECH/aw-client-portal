# Client Portal

The client poral, as the name already suggests will be the client facing platform that our users will be interacting with.

## How to get started

(TBA)

## Database configuration

Our chosen DB is Airtable. You should create a .env file to store the dev secrets in order to run the DB in dev.

### apiClient.ts

This file returns an apliClient is made up of the BASE ID of the DB, as well as the seceret token (which is retrieved from the .env file). This is the URL with the appropriate header to connect on to the Airtable DB.

### httpService.ts

This a utlity functions for all the HTTP requests that we can use throughout the application. Each function generic and expects a tablename as a type of string. This can be interchangeable depending on the table.
