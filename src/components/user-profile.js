import React, { Component } from 'react';
import axios from 'axios';
import LogIn from '../components/LogIn'
import Saved from '../components/savedPosts'
import firebase from 'firebase'

export default class Trending extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    }

  }


  componentDidMount = () => {
    axios.get('https://chitterr-app-api.herokuapp.com/users/' + this.props.match.params.id)
      .then(response => {
        if (response.data.length >0 && response.data[0] != undefined) {
          this.setState({
            user: response.data[0],
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  followList = () => {

    if(this.state.user == undefined)
      return;

    return this.state.user.following.map(foll => {
      return <p>Following {foll}</p>;
    })
  }
  render() {
    return (
      <div>


        {this.state.user != null &&


          <div id="userProf">
            
              <p class = "followCount">Followers: {this.state.user.followers}, Following:   {this.state.user.following.length}</p>
            
            <div>
            </div>{
              this.state.user != null &&
                <div>
                    <Saved currUser = {this.state.user}></Saved>
                </div>
                
            }

          </div>

        }
      </div>
    );
  }
}