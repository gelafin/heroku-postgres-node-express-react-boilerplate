# Commands
<i>Heroku doesn't like Git Bash; use another terminal for Heroku commands.</i>
<hr></hr><br></br>

        npm start
Test on localhost. Run from root of project. Have to build client first if testing it too.

        npm start (from ./client dir)
Run react app on localhost.

        npm run build
Creates production-optimized build of React app.

        git push origin <FEATURE_BRANCH>
Push to a feature branch. After pushing to a feature branch, deploy by creating a PR into a branch specified in the GitHub Action .yml file.

        heroku addons
Shows info for all Heroku add-ons, such as the database

        heroku config --app APP_NAME
Shows Heroku environment variables, such as DATABASE_URL

        heroku logs --tail
View recent log output. Good for debugging and checking if Heroku acknowledges that something happened.

[Heroku database cli commands](https://devcenter.heroku.com/articles/managing-heroku-postgres-using-cli)

[postgres docs](https://www.postgresql.org/docs/14/index.html)

# Flow
1. Create feature branch from development branch
2. Test locally
    - Client-only test: change code > cd client/ > npm start
    - Server-only test: change code > switch to local db pool in database/dbUtils/connectionUtils.js (.env was troublesome, so it's commented code for now) > cd root > npm start
    - Full-stack test: same as server-only except build the client before running npm start
3. Push changes to feature branch
4. Merge feature branch into development branch - picked up by GH Action and deployed to Staging App
5. Address any addressables noticed in the Staging app
6. Merge Staging branch into main - picked up by GH Action and deployed to Prod App

# History
<i>Use this space to list important or hard-to-remember setup steps, for reference</i>
* Used `npx create-react-app` to initialize React app in client/
* Followed this [Express-React setup structure](https://daveceddia.com/deploy-react-express-app-heroku/)

<i>The below steps should be done when starting a new project</i>
* Used `npm init` to initialize Node app in root
* Used official Node Heroku [buildpack](https://devcenter.heroku.com/articles/buildpacks) by running `heroku buildpacks:set heroku/nodejs`
* Used `heroku addons:create heroku-postgresql:hobby-dev` to create free Postgres database
* Used `heroku addons:attach REPLACE_WITH_PRODUCTION_APP_NAME::DATABASE --app REPLACE_WITH_STAGING_APP_NAME` as described in [Heroku db docs](https://devcenter.heroku.com/articles/heroku-postgresql#sharing-heroku-postgres-between-applications) to share the database with the Staging app. This can be undone if we want a separate db for the Staging app--see Heroku docs link
