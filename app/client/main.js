import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import Relay from "react-relay";
import useRelay from "react-router-relay";
import {applyRouterMiddleware, browserHistory, Router} from "react-router";
import injectTapEventPlugin from "react-tap-event-plugin";

import Routes from "./common/components/Routes";


injectTapEventPlugin();

Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer('/graphql', {
        credentials: 'same-origin'
    })
);

ReactDOM.render(
    <Router
        history={browserHistory}
        routes={Routes}
        render={applyRouterMiddleware(useRelay)}
        environment={Relay.Store}
    />,
    document.getElementById('app')
);

