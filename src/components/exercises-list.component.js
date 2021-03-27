import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Exercise from '../components/exercise';
import axios from 'axios';


export default class ExercisesList extends Component {
  constructor(props) {
    super(props);

    this.deleteExercise = this.deleteExercise.bind(this)

    this.state = {exercises: []};
  }

  componentDidMount() {
    // console.log(this.props.currUser);

    let tempUser = {
      username: "henry chu",
      userKey: "4",
      following: ["1","xstGsReFpIOkeu46CxbBlaE9skr1","4"],
      followers: 0
    }

    let following = [];
    if(this.props.currUser != null && this.props.currUser != undefined){
      following = this.props.currUser.following;
    }
    // console.log(following)


    following.forEach(followingUserKey => {
        axios.get('https://chitterr-app-api.herokuapp.com/exercises/feed/' + followingUserKey)
        .then(response => {
          // console.log(response);
          let temp = this.state.exercises;

          response.data.forEach(element => {
              console.log(element);
              temp.push(element);
          });
          console.log("temp: "+ temp[0]);
          this.setState({ exercises: temp })
        })
        .catch((error) => {
          console.log(error);
        })
    });

  }

  ingList(ingredients) {
    if(ingredients == undefined)
      return;

    ingredients.map(ing => {
      return <li>{ing}</li>
    })
  }

  deleteExercise(id) {
    axios.delete('https://chitterr-app-api.herokuapp.com/exercises/'+id)
      .then(response => {});

    this.setState({
      exercises: this.state.exercises.filter(el => el._id !== id)
    })
  }

  exerciseList() {
    return this.state.exercises.map(currentexercise => {
      if(currentexercise == undefined)
        return null;
      return <Exercise ingList = {this.ingList()} currentKey = {this.props.currentUserKey} exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id}/>;
    })
  }

  render() {
    return (
      <div className = "absFeed">
        <div className = "feed-title">Feed</div>

        <div className = "feed-total">
            {/* {console.log(this.props.currUser.following)} */}
            { this.exerciseList() }
        </div>
      </div>

    )
  }
}