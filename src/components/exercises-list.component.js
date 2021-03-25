import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Exercise from '../components/exercise';
import axios from 'axios';

// class Lst extends Component {

//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return <div>

//       <h>Ingredients</h>
//       {
//       this.props.ingList.map(ing=>{
//         return <li>{ing}</li>
//       })
//       }
//     </div>

//   }
// }
// const Exercise = props => (

//   <div class = "card" id = "recipe">


//       <h>{props.exercise.username}</h>
//       <p>Dish : {props.exercise.description}</p>
//       <p>Time to make : {props.exercise.duration} minutes</p>

//       <Lst ingList = {props.exercise.ingredients}></Lst>

//       <br></br>      
//       <p>{props.exercise.date.substring(0,10)}</p>
//       { 
//         props.exercise.userKey == props.currentKey && 
//         <p>
//         <Link to={"/edit/"+props.exercise._id}>edit</Link> | <a href="#" onClick={() => { props.deleteExercise(props.exercise._id) }}>delete</a>
//         </p>
//       }

//   </div>

// )


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
        axios.get('http://localhost:5000/exercises/feed/' + followingUserKey)
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
      <div class = "absFeed">
        <div class = "feed-title">Feed</div>

        <div class = "feed-total">
            {/* {console.log(this.props.currUser.following)} */}
            { this.exerciseList() }
        </div>
      </div>

    )
  }
}