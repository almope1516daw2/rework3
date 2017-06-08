import React from "react";
import Relay from "react-relay";
import AppBar from "material-ui/AppBar";
import * as ReactBootstrap from "react-bootstrap";

import IconButton from "material-ui/IconButton";
import PersonIcon from "material-ui/svg-icons/social/person";

import LogoutMutation from "../../../mutation/LogoutMutation";
import logout from "../../../common/logout";

function _logout(user) {
    logout(user,
        {
            onFailure: (transaction) => {
                console.log('onFailure');
                console.log(transaction.getError());
            },
            onSuccess: (response) => location.assign(location.protocol + '//' + location.host)
        }
    );
}

function getUserMenu(props, router) {
    const user = props.viewer.user ? props.viewer.user : {};

    return (
        <IconButton
            onClick={() => router.push('/')}
        >
          <PersonIcon />
        </IconButton>
    )

}

const Header = (props, context) => (
    /*<AppBar
        title="Relay Authentication"
        onLeftIconButtonTouchTap={props.toggleNavigation}
        iconElementRight={getUserMenu(props, context.router)}
    />*/

    /*<nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <img src="images/logo-estirado.png" id="logo"></img>
            </div>

            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">


                <ul class="nav navbar-nav navbar-right">
                    <li><a href="#">Incidencias</a></li>
                    <li><a href="#">Sign In</a></li>

                </ul>
            </div>
        </div>
    </nav>*/

    <ReactBootstrap.Navbar>
        <ReactBootstrap.Navbar.Header>
            <ReactBootstrap.Navbar.Brand>
                <img src="./images/logo-estirado.png" id="logo"/>
            </ReactBootstrap.Navbar.Brand>
            <ReactBootstrap.Navbar.Toggle />
        </ReactBootstrap.Navbar.Header>
        <ReactBootstrap.Navbar.Collapse>

            <ReactBootstrap.Nav pullRight>
                <ReactBootstrap.NavItem eventKey={1} onSelect={props.toggleNavigation}>Link Right</ReactBootstrap.NavItem>
                <ReactBootstrap.NavItem eventKey={2} href="#">Link Right</ReactBootstrap.NavItem>
            </ReactBootstrap.Nav>
        </ReactBootstrap.Navbar.Collapse>
    </ReactBootstrap.Navbar>

);

Header.contextTypes = {
    router: React.PropTypes.object.isRequired,
};

export default Relay.createContainer(Header, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                user {
                    firstName,
                    lastName,
                    role,
                    ${LogoutMutation.getFragment('user')}
                },
            }
        `,
    }
});

