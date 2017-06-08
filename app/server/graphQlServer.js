import express from "express";
import graphQLHTTP from "express-graphql";
import cookieSession from "cookie-session";
import multer from "multer";
import _ from "lodash";
import fs from "fs";
import path from "path";
import sanitize from "sanitize-filename";
import mongoose from "mongoose";

import Schema from "../graphql/schema";
import {ANONYMOUS_TOKEN_DATA, createAnonymousToken, decodeToken} from "./authentication";

function loadSessionData(req) {
    if (req.session && req.session.token) {
        return new Promise((resolve) => {
            let tokenData = null;
            try {
                tokenData = decodeToken(req.session.token);
            }
            catch (err) {
                log(err)
            }

            resolve(tokenData);
        });
    }
    else {
        return new Promise((resolve) => {
            resolve(null);
        });
    }
}

function getSessionData(req, res, next) {
    loadSessionData(req).then(tokenData => {
        console.log("TOKEN DATA: ");
        console.log(tokenData);
        if (!tokenData) {
            tokenData = ANONYMOUS_TOKEN_DATA;
            req.session.token = createAnonymousToken();
        }

        req.tokenData = tokenData;
        next();
    }).catch((err) => {
        res.sendStatus(400)
    });
}


export default function createGraphQlServer(port, database) {
    // Expose a GraphQL endpoint
    const graphQLServer = express();

    mongoose.connect('mongodb://localhost:27017/test');

    graphQLServer.use(cookieSession({
        name: 'session',
        keys: ['id', 'token']
    }));

    const storage = multer.memoryStorage();

    const multerMiddleware = multer({storage: storage}).fields([{name: 'image'}]);

    const uploadMiddleWare = (req, res, next) => {
        multerMiddleware(req, res, () => {
            const files = _.values(req.files);

            if (!files || files.length === 0) {
                log('upload middleware: no files');
                next();
                return;
            }

            // Parse variables so we can add to them. (express-graphql won't parse them again once populated)
            req.body.variables = JSON.parse(req.body.variables);

            files.forEach(fileArray => {
                const file = fileArray[0];
                const filename = Date.now() + '_' + sanitize(file.originalname.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, ''));

                // save file to disk
                const filePath = path.join(__dirname, '../graphql/testData/images', filename);
                fs.writeFileSync(filePath, file.buffer);

                // add files to graphql input. we only support single images here
                req.body.variables.input_0[file.fieldname] = '/images/' + filename;
            });

            next();
        });
    };

    graphQLServer.use('/graphql', uploadMiddleWare);

    graphQLServer.use('/graphql', getSessionData, graphQLHTTP(({session, tokenData}) => ({
            graphiql: true,
            pretty: true,
            schema: Schema,
            context: {db: database},
            rootValue: {session, tokenData}
        })
    ));


    return graphQLServer.listen(port, () => log(
        `GraphQL Server is now running on http://localhost:${port}`
    ));

}