/*
 *  Some boilerplate snippets adapted from https://daveceddia.com/deploy-react-express-app-heroku/
 */
'use strict';
import express from 'express';
import path, { dirname } from 'path'; // dirname to avoid hardcoding __dirname
import { fileURLToPath } from 'url'; // to avoid hardcoding __dirname
import baseRouter from './routers/baseRouter.js';

const app = express();
app.set('port', 3000);

// define ES6 equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// enable parsing of req query params
app.use(express.urlencoded({ extended: true }));

// enable parsing of req body
app.use(express.json());

// use routing defined in baseRouter
app.use('/api', baseRouter);

// default GET route handler
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// if none of the above were triggered, the page doesn't exist or support the request verb
app.use((req, res) => {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

// start listening
const port = process.env.PORT || app.get('port');
app.listen(port, () => {
  console.log(
    'Express listening on the current server from port ' + port + '; press Ctrl-C to terminate.'
  );
});
