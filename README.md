## Folder Structure

- `components` folder will contain components of pages (both specific and reusable)
- `config` folder will contain constants and configs
- `pages` folder will contain views mapped with urls
- `public` folder will contain static resources like images
- `styles` folder will contain global and module specific css styles
- `services` folder will contain application logic and will serve as a glue between controllers and models
- `utils` folder will contain helper functions to perform required operations
- text

  <br />

## Setup the codebase

**Install all the packages and dependencies:**

`npm install`

Then copy the .env-sample and save it with .env file, and fill in the configuration settings.
<br />

## Run the application

**Prepare production build:**

`npm run build` Builds the app for production.

**Run the app:**

`npm start` Runs the built app in production mode.

**Run while developing:**

`npm run dev` Starts the development server.

**Check source code errors:**

`npm run lint`
