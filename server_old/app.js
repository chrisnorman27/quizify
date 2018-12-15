'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const routes = require('./routes');
const clientUrl = require('./util/urls');

const port = process.env.PORT || 8888;

const app = express();

app.set('port', port);
app.use(logger('dev'))
    .use(
        session({
            store: new RedisStore({
                host: 'redis',
                url: process.env.REDIS_URL
            }),
            secret: 'quizify',
            cookie: { maxAge: 600000 },
            resave: false,
            saveUninitialized: false
        })
    )
    .use(cookieParser())
    .use(cors({ origin: clientUrl, credentials: true }))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(express.static(path.resolve(__dirname, '../public')))
    .use('/', routes);

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
    console.log('Client url: ' + clientUrl);
});