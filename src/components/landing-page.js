import React, { Component } from 'react';
import axios from 'axios';
import LogIn from '../components/LogIn'
import MyRecipies from '../components/MyRecipies'
import firebase from 'firebase'
export default class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    }

  }


  componentDidMount = () => {

  }


  render() {
    return (
      <div>
        
        
        <div class = "landingImage">
            { this.props.currUser != undefined &&

                <span class = "greeting">Hello {this.props.currUser.username} !
                 
                                 
                 <br></br>

                Explore your favorite recipes or post you own!
                 </span>
                
            }



        </div>
        <div class = "landingImage">


            <span id = "loginout2">
                  <button class = "sobtn"onClick={() => firebase.auth().signOut()}>Sign out!</button>
                  <h1 id = "welcome">Welcome {firebase.auth().currentUser.displayName}</h1>
                  <img id = "pfp"
                    alt="profile picture"
                    src={firebase.auth().currentUser.photoURL}
                  />
            </span>
        </div>


        
      </div>
    );
  }
}