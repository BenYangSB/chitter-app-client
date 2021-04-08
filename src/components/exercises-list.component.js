import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Exercise from './exercise';
import axios from 'axios';
import BlueLoadingBar from '../assets/BlueLoadingBar.svg';


export default class ExercisesList extends Component {
  constructor(props) {
    super(props);

    this.deleteExercise = this.deleteExercise.bind(this)
    this.handleSave = this.handleSave.bind(this)

    this.state = {
      exercises: [],
      currUser: this.props.currUser,
      loading: true
    };
  }



  componentDidMount() {
    // console.log(this.props.currUser);
  
    let tempUser = {
      username: "henry chu",
      userKey: "4",
      following: ["1", "xstGsReFpIOkeu46CxbBlaE9skr1", "4"],
      followers: 0
    }

    this.readFollowersPosts();
    // let following = [];
    // if (this.state.currUser != null && this.state.currUser != undefined) {
    //   following = this.state.currUser.following;
    // }
    // // console.log(following)


    // following.forEach(followingUserKey => {
    //   axios.get('https://chitterr-app-api.herokuapp.com/exercises/feed/' + followingUserKey)
    //     .then(response => {
    //       // console.log(response);
    //       let temp = this.state.exercises;

    //       response.data.forEach(element => {
    //         // console.log(element);
    //         temp.push(element);
    //       });
    //       // console.log("temp: " + temp[0]);
    //       this.setState({ 
    //         exercises: temp,
    //         loading: false 
    //       })
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     })
    // });

  }

  readFollowersPosts = () => {
    let following = [];
    if (this.state.currUser != null && this.state.currUser != undefined) {
      following = this.state.currUser.following;
    }
    // console.log(following)


    following.forEach(followingUserKey => {
      axios.get('https://chitterr-app-api.herokuapp.com/exercises/feed/' + followingUserKey)
        .then(response => {
          // console.log(response);
          let temp = this.state.exercises;

          response.data.forEach(element => {
            // console.log(element);
            temp.push(element);
          });
          // console.log("temp: " + temp[0]);
          this.setState({ 
            exercises: temp,
            loading: false 
          })
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

  updateCurrUser = () => {
    axios.get('https://chitterr-app-api.herokuapp.com/users/' + this.props.currentUserKey)
      .then(response => {
        if (response != null && response.data != null && response.data.length > 0)

          this.setState({
            currUser: response.data[0],
          });
      })
      .catch(err => console.log("Error: " + err));
  }

  handleSave(id) {
    console.log(this.props.currUser.userKey);
    console.log(id);

    axios.get('http://localhost:5000/users/' + this.props.currUser.userKey)
      .then(response => {
        if (response.data.length > 0) {
          let userRes = response.data[0];
          let saved = (response.data[0].saved);
          if (saved.includes(id)) {
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
              this.updateCurrUser();
              // alert("saved!")
            });
        }
      })
      .catch((error) => {
        console.log(error);
      })

  }

  unSave = (objectId) => {
    axios.get('http://localhost:5000/users/' + this.props.currUser.userKey)
      .then(response => {
        if (response.data.length > 0) {
          let userRes = response.data[0];
          let saved = (response.data[0].saved);

          for (let i = 0; i < saved.length; i++) {
            if (saved[i] == objectId) {
              saved.splice(i, 1);
            }
          }

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
              this.updateCurrUser();
              // alert("unsaved!")
            });
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  deleteExercise(id) {
    axios.delete('https://chitterr-app-api.herokuapp.com/exercises/' + id)
      .then(response => {this.readFollowersPosts()});

    this.setState({
      exercises: this.state.exercises.filter(el => el._id !== id)
    })
  }

  isSaved = (id) => {
    axios.get('http://localhost:5000/users/' + this.props.currentUserKey)
      .then(response => {
        let saved = response.data[0].saved;
        if (saved.includes(id)) {
          // console.log("saved before")
          return true;
        }
        else {
          // console.log("not saved")
          return false;
        }
      })
      .catch(err => console.log("Error: " + err));
  }

  exerciseList() {
    return this.state.exercises.map(currentexercise => {
      if (currentexercise == undefined)
        return null;
      // check if saved state
      let showUnSave = false;
      let saved = this.state.currUser.saved;
      for (let i = 0; i < saved.length; i++) {
        if (saved[i] == currentexercise._id) {
          showUnSave = true;
        }
      }
      return <Exercise handleSave={this.handleSave} unSave={this.unSave} showUnSave={showUnSave} showMore={true} display={true} ingList={this.ingList()} currUser={this.props.currUser} currentKey={this.props.currentUserKey} exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
    })
  }

  render() {
    return (
      <div class="feedWrap">
        <div className="absFeed">
          <div className="feed-title">Feed</div>

          <div className="feed-total">
            {/* {console.log(this.props.currUser.following)} */}
            {this.state.loading && 
              <img className="loadingBar" src={BlueLoadingBar}/>
            }
            {!this.state.loading && this.state.exercises.length == 0 &&
              <div className="emptyMsg">No Followers or personal recipes yet!</div>
            }
            {this.exerciseList()}
          </div>
        </div>
      </div>


    )
  }
}