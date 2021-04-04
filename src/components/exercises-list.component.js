import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Exercise from './exercise';
import axios from 'axios';


export default class ExercisesList extends Component {
  constructor(props) {
    super(props);

    this.deleteExercise = this.deleteExercise.bind(this)
    this.handleSave = this.handleSave.bind(this)

    this.state = { exercises: [] };
  }



  componentDidMount() {
    // console.log(this.props.currUser);

    let tempUser = {
      username: "henry chu",
      userKey: "4",
      following: ["1", "xstGsReFpIOkeu46CxbBlaE9skr1", "4"],
      followers: 0
    }

    let following = [];
    if (this.props.currUser != null && this.props.currUser != undefined) {
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
          console.log("temp: " + temp[0]);
          this.setState({ exercises: temp })
        })
        .catch((error) => {
          console.log(error);
        })
    });

  }

  ingList(ingredients) {
    if (ingredients == undefined)
      return;

    ingredients.map(ing => {
      return <li>{ing}</li>
    })
  }

  handleSave(id) {
      console.log(this.props.currUser.userKey);
      console.log(id);

      axios.get('http://localhost:5000/users/'+ this.props.currUser.userKey)
      .then(response => {
        if (response.data.length > 0) {
          let userRes = response.data[0];
          let saved = (response.data[0].saved);
          if(saved.includes(id)){
            alert("already saved");
            return;
          }

          saved.push(id);
          let newUser = {
            username: userRes.username,
            userKey: this.props.currUser.userKey,
            following: userRes.following,
            followers: userRes.followers,
            saved: saved,
          }

          console.log(newUser);

          axios.post('http://localhost:5000/users/update/' + this.props.currUser._id, newUser)
          .then(res => {
            alert("saved!")
          });
        }
      })
      .catch((error) => {
        console.log(error);
      })

  }


  deleteExercise(id) {
    axios.delete('https://chitterr-app-api.herokuapp.com/exercises/' + id)
      .then(response => { });

    this.setState({
      exercises: this.state.exercises.filter(el => el._id !== id)
    })
  }

  exerciseList() {
    return this.state.exercises.map(currentexercise => {
      if (currentexercise == undefined)
        return null;
      return <Exercise handleSave = {this.handleSave} showMore = {true} display={true} ingList={this.ingList()} currUser={this.props.currUser} currentKey={this.props.currentUserKey} exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
    })
  }

  render() {
    return (
      <div class="feedWrap">
        <div className="absFeed">
          <div className="feed-title">Feed</div>

          <div className="feed-total">
            {/* {console.log(this.props.currUser.following)} */}
            {this.exerciseList()}
          </div>
        </div>
      </div>


    )
  }
}