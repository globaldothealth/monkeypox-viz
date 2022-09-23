# Global.health Monkeypox visualization

Global.health Monkeypox visualization

https://map.monkeypox.global.health

**Main technologies and libraries used in this project**

-   React (Create React App)
-   Typescript
-   Reduxjs toolkit
-   Styled components
-   React Router
-   Mapbox
-   Mui
-   Cypress
-   Craco

## Development

http://dev-map.monkeypox.global.health.s3-website.eu-central-1.amazonaws.com/country

Once you clone the project, you can use npm to install all the dependencies by running:

#### `npm install`

In order to run this project in development mode `.env.development` file is needed in the main project directory. All the environment variables needed can be found in `.env.example` file. In order to get required api keys and variables please contact one of the project's owners.

You can start the development server by running:

#### `npm start`

## Deployment

Deployments are set up to happen automatically. If a deploy pushes to a website using a Cloudfront distribution, an invalidation will need to be created to apply changes.
