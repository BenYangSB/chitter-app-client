import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import EditRecipeForm from './editRecipeForm';
import firebase from 'firebase';

export default class EditExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: firebase.auth().currentUser.displayName,
      userKey: firebase.auth().currentUser.uid,
      currUser : this.props.currUser,
      description: '',
      date: '',
      ingredients: '',
      duration: 0,
      image: null,
      instructions: "",
      users: []
    }
  }

  render() {
    return (
    <div class = "absFeed"> 
      <div>
          <br></br>
          <br></br>
        </div>
      <h3>Edit Recipe</h3>
      <EditRecipeForm 
        isEdit={true}
        match={this.props.match}
        currUser={this.state.currUser}
        username={this.state.username}
        userKey={this.state.userKey}
      />
    </div>
    )
  }
}