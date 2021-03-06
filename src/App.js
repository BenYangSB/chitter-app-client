
import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'
import { BrowserRouter as Router, Route } from "react-router-dom";
import authMethod from './configs/authMethod'
import Navbar from "./components/navbar.component"
import ExercisesList from "./components/exercises-list.component";
import EditExercise from "./components/edit-exercise.component";
import Trending from "./components/trending";
import UserProfile from "./components/user-profile";
import MyRecipies from "./components/MyRecipies";
import LogIn from './components/LogIn'
import CreateExercise from "./components/create-exercise.component";
import axios from 'axios';
import DiscoverChefs from "./components/DiscoverChefs";
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Img1 from "./assets/img1.jpeg"
import Img2 from "./assets/img2.jpeg"
import Img3 from "./assets/img3.jpeg"
import Img4 from "./assets/img4.jpeg"
import Landing from "./components/landing-page"
import RecipeDetailed from './components/RecipeDetailed';


class App extends React.Component {
  state = {
    currentUser: null,
    isSignedIn: false,
  }
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  }

  componentDidMount = () => {
    console.log("HERE");

    firebase.auth().onAuthStateChanged(user => {

      this.setState({ isSignedIn: !!user })

      if (user) {
        const localStorage = window.localStorage;
        localStorage.setItem("currUserKey", firebase.auth().currentUser.uid);
      } else {
        const localStorage = window.localStorage;
        localStorage.setItem("currUserKey", 'none');
      }

      console.log(firebase.auth().currentUser.uid)
      const userAdd = {
        username: firebase.auth().currentUser.displayName,
        userKey: firebase.auth().currentUser.uid,
        following: [firebase.auth().currentUser.uid],   // why does the user follow themselves ?
        followers: 1,
        recipes : ["hello"]
      }

      axios.post('https://chitterr-app-api.herokuapp.com/users/add/', userAdd)
        .then(res => console.log(res.data));


      //get this user back
      axios.get('https://chitterr-app-api.herokuapp.com/users/' + userAdd.userKey)
        .then(response => {
          if (response != null && response.data != null && response.data.length > 0) {
            this.setState({
              currentUser: response.data[0],
            });
          }
        })
        .catch((error) => {
          console.log(error);
        })

    })
  }

  render() {
    return (

      <Router class="complete">


        <div class="everything">
          {this.state.isSignedIn &&

            <div>
              <Navbar isSignedIn={this.state.isSignedIn} userKey={firebase.auth().currentUser.uid} />
              <br />
              <Route exact path="/" exact component={() => <Landing currUser={this.state.currentUser}/>} />
              <Route path="/feed" exact component={() => <ExercisesList currUser={this.state.currentUser}/>} />
              <Route path="/user/recipies" component={() => <MyRecipies currUser={this.state.currentUser}/>} />
              <Route path="/user/trending" component={Trending} />
              <Route path="/edit/:id" component={(props) => <EditExercise {...props} currUser={this.state.currentUser}/>} />
              <Route path="/create" component={() => <CreateExercise currUser={this.state.currentUser}/>} />
              <Route path="/user/discover" component={() => <DiscoverChefs/>} />
              <Route path="/user/profile/:id" component={(props) => <UserProfile {...props} currUser={this.state.currentUser} />} />
              <Route path="/recipe/:id" component={(props) => <RecipeDetailed {...props} />} />
              {/* </div> */}


              <div className="logIn">
              </div>

            </div>
          }
          {
            <div class={this.state.isSignedIn ? "loggedIn" : "login"}
              style={{
                // backgroundImage: `url(${Img3})`,
                // backgroundRepeat: `url(${Img2})`,
              }}>
              {!this.state.isSignedIn &&



                <div>
                  <div class="loginpage" >


                    <p class="title">Welcome to Chitter, a website for chefs and cooking enthusiasts!</p>
                    <p class="title">Please sign in to continue. </p>

                    <StyledFirebaseAuth
                      uiConfig={this.uiConfig}
                      firebaseAuth={firebase.auth()}
                    />
                    {/* <p class = "title">Explore and post your favorite recipes!</p> */}


                  </div>



                </div>

              }
            </div>
          }



        </div>

      </Router>

    );
  }
}

export default App;