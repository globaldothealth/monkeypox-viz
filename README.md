# Global.health map

This is a source code for the Global.health map

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

Once you clone the project, you can use npm to install all the dependencies by running:

#### `npm install`

In order to run this project in development mode `.env.development` file is needed in the main project directory. All the environment variables needed can be found in `.env.example` file. In order to get required api keys and variables please contact one of the project's owners.

You can start the development server by running:

#### `npm start`

## Deployment

Before making production deployments to main branch make sure to include `.env.production` file in project's dorectory containing all the production keys and env variables.

There are Github actions setup in `/.github/workflows` directory. After pushing commits to either main or develop branch those actions perform automatic deployment to AWS S3. The application can be accessed under those urls:

-   Dev: http://dev-react-map.covid-19.global.health.s3-website.us-east-2.amazonaws.com/
-   Prod: `to be created`
