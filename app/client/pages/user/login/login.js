import React from "react";
import Relay from "react-relay";
import {browserHistory} from "react-router";
import Formsy from "formsy-react";
import {FormsyText} from "formsy-material-ui";
import RaisedButton from "material-ui/RaisedButton";
import * as ReactBootstrap from "react-bootstrap";
import FaEye from "react-icons/lib/fa/eye";

import LoginMutation from "../../../mutation/LoginMutation";
import {Errors, ROLES} from "../../../../config";



export class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mail: "",
            password: "",
        };

    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    };

    login = (user) => {
        Relay.Store.commitUpdate(
            new LoginMutation({
                email: this.state.mail,
                password: this.state.password,
                user: user
            }),
            {
                onFailure: (transaction) => {
                    console.log('login failed');
                    console.log(transaction.getError().source);
                    document.getElementById("spanPasswordLogin").innerHTML = "Mail o contraseña inválido";

                    const errorMessage = transaction.getError().source.errors[0].message;
                    const formError = {};

                    switch (errorMessage) {
                        case Errors.WrongEmailOrPassword:
                            //formError.email = 'Email or password is incorrect';
                            //formError.password = 'Email or password is incorrect';
                            document.getElementById("spanPasswordLogin").innerHTML = "Mail o contraseña inválido";
                            console.log("WrongEmailOrPassword")
                            break;
                    }

                    //this.refs.form.updateInputsWithError(formError);
                },
                onSuccess: (response) => {
                    this.context.router.push('/user')
                }
            }
        );
    };

    handleChange = (event) => {
        switch (event.target.name) {
            case "mail":
                this.setState({mail: event.target.value});
                break;
            case "password":
                this.setState({password: event.target.value});
                if (event.target.value !== "") {
                    event.target.style.fontFamily = "Verdana";
                } else {
                    event.target.style.fontFamily = "Montserrat";
                }
                break;
        }
    };

    mouseoverPass = () => {
        document.getElementById('inputPasswordLogin').type = "text";
        if (document.getElementById('inputPasswordLogin').value !== "") {
            document.getElementById('inputPasswordLogin').style.fontFamily = "Montserrat";
        }
    };

    mouseoutPass = () => {
        document.getElementById('inputPasswordLogin').type = "password";
        if (document.getElementById('inputPasswordLogin').value !== "") {
            document.getElementById('inputPasswordLogin').style.fontFamily = "Verdana";
        }
    };

    render() {
        const viewerRole = this.props.viewer.user.role;
        if (viewerRole !== ROLES.anonymous) {
            this.context.router.push('/user');
            return <div/>;
        }

        const submitMargin = {marginTop: 20};

        return (


            <ReactBootstrap.Col lg={12} md={12} id="LoginForm">
                <form id="form">
                    <h2>LOGIN</h2>
                    <h3>Lorem ipsum dolor sit amet, tempor ut labore et dolor:</h3>
                    <ReactBootstrap.Row>
                        <ReactBootstrap.Col lg={6} md={6}>
                            <input onChange={this.handleChange} type="text" placeholder="Mail" name="mail"
                                   id="inputMailLogin"/><span id="spanMailLogin"> </span><br/>
                        </ReactBootstrap.Col>
                    </ReactBootstrap.Row>

                    <ReactBootstrap.Row>
                        <ReactBootstrap.Col lg={6} md={6}>
                            <input onChange={this.handleChange} type="password" placeholder="Contraseña" name="password"
                                   id="inputPasswordLogin"/>

                            <FaEye id="viewPassword" onMouseOver={this.mouseoverPass}
                                   onMouseOut={this.mouseoutPass}/><span id="spanPasswordLogin"></span><br/>
                            <ReactBootstrap.Col lg={5} md={6}>
                                ¿Contraseña olvidada?
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col lg={5} md={6}>
                                ¿Nuevo usuario? Regístrate
                            </ReactBootstrap.Col>
                        </ReactBootstrap.Col>
                    </ReactBootstrap.Row>

                    <ReactBootstrap.Row>
                        <ReactBootstrap.Col lg={6} md={6} lgOffset={6} mdOffset={6}>
                            <ReactBootstrap.Button className="button btnNext btnLogin"
                                                   onClick={() => this.login(this.props.viewer.user)}>Entrar</ReactBootstrap.Button>
                        </ReactBootstrap.Col>
                    </ReactBootstrap.Row>

                </form>
            </ReactBootstrap.Col>
        );
    }
}

const container = Relay.createContainer(LoginPage, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                user {
                    id,
                    role,
                    ${LoginMutation.getFragment('user')}
                }
            }
        `,
    }
});

export default container;
