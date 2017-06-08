import Relay from "react-relay";

export default class LoginMutation extends Relay.Mutation {

    getMutation () {
        return Relay.QL`mutation { login }`;
    }

    getVariables() {
        return {
            email: this.props.email,
            password: this.props.password,
            id: this.props.user.id
        };
    }

    getFatQuery () {
        return Relay.QL`
            fragment on LoginPayload {
                user {
                    email,
                    role,
                    firstName,
                    lastName
                }
            }
        `;
    }

    getConfigs() {
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                user: this.props.user.id
            }
        }];
    }

    static fragments = {
        user: () => Relay.QL`
            fragment on User {
                id,
            }
        `
    }
}