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

  // componentDidMount() {
  //   axios.get('https://chitterr-app-api.herokuapp.com/exercises/'+this.props.match.params.id)
  //     .then(response => {
  //       console.log(response.data)
  //       this.setState({
  //         username: response.data.username,
  //         userKey: response.data.userKey,
  //         description: response.data.description,
  //         duration: response.data.duration,
  //         date: response.data.date,
  //         instructions: response.data.instructions,
  //         ingredients: response.data.ingredients.join(),
  //         image: response.data.image
  //       })   
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     })

  //   axios.get('https://chitterr-app-api.herokuapp.com/users/')
  //     .then(response => {
  //       if (response.data.length > 0) {
  //         this.setState({
  //           users: response.data.map(user => user.username),
  //         })
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })

  // }

  // onChangeIngredients(e) {
  //   this.setState({
  //     ingredients: e.target.value
  //   })
  // }

  // onChangeUsername(e) {
  //   this.setState({
  //     username: e.target.value
  //   })
  // }

  // onChangeDescription(e) {
  //   this.setState({
  //     description: e.target.value
  //   })
  // }

  // onChangeDuration(e) {
  //   this.setState({
  //     duration: e.target.value
  //   })
  // }

  // onChangeDate(date) {
  //   this.setState({
  //     date: date
  //   })
  // }

  // onSubmit(e) {
  //   e.preventDefault();

  //   let temp = this.state.ingredients.split(',')
  //   const exercise = {
  //     username: this.state.username,
  //     userKey: this.state.userKey,
  //     description: this.state.description,
  //     instructions: this.state.instructions,
  //     duration: this.state.duration,
  //     date: this.state.date,
  //     ingredients: temp,
  //     image: this.state.image
  //   }

  //   console.log(exercise);

  //   axios.post('https://chitterr-app-api.herokuapp.com/exercises/update/' + this.props.match.params.id, exercise)
  //     .then(res => console.log(res.data));

  // }

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
        username={this.props.username}
        userKey={this.props.userKey}
      />
    </div>
    )
  }
}