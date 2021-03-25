import React, { Component } from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


class LogIn extends Component {
    render() {
        return (
            <div>
                <span id="loginout">
                    <div>Signed In!</div>
                    <button onClick={() => {this.props.signOut()}}>Sign out!</button>
                    <h1 id="welcome">Welcome {this.props.displayName}</h1>
                    <img id="pfp"
                        alt="profile picture"
                        src={this.props.profilePic}
                    />
                </span>
            </div>
        )
    }
}

export default LogIn;