require('./logger.js');

import path from "path";
import express from "express";
import request from "request";
import historyApiFallback from "connect-history-api-fallback";

import Database from "../graphql/Database";
import createGraphQlServer from "./graphQlServer";


const IMAGE_PORT = 9000;
const GRAPHQL_PORT = 8081;
const RELAY_PORT = 3000;

createGraphQlServer(GRAPHQL_PORT, new Database());

const pathBase = path.resolve(__dirname, '../');

const imageServer = express();
imageServer.use('/images', express.static(pathBase + '/public/images'));

imageServer.listen(IMAGE_PORT);

const app = express();

app.use(historyApiFallback());
app.use('/', express.static(pathBase + '/public'));

app.use('/graphql', function (req, res) {
    req.pipe(request(`http://localhost:${GRAPHQL_PORT}/graphql`)).pipe(res);
});

app.get(/images\/.{1,}/i, function (req, res) {
    req.pipe(request(`http://localhost:${IMAGE_PORT}${req.originalUrl}`)).pipe(res);
});

if (!process.env.PRODUCTION) {


    const webpack = require('webpack');
    const config = require('../webpack.local.config.js');
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");

    const compiler = webpack(config);
    const options = {
        noInfo: true,
        stats: {colors: true},
    };

    app.use(webpackDevMiddleware(compiler, options));
    app.use(webpackHotMiddleware(compiler));
    app.use(express.static(config.output.publicPath));

    app.listen(RELAY_PORT, (err, result) => {
        if (err) {
            log(err);
        }
        else {
            log(`App is now running on http://localhost:${RELAY_PORT}`)
        }
    });

}
else {
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
        const host = server.address().address;
        const port = server.address().port;

        log('Essential React listening at http://%s:%s', host, port);
    });
}
