import React, { Component } from 'react';
import axios from 'axios';
import LogIn from '../components/LogIn'
import Saved from '../components/savedPosts'
export default class Trending extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    }

  }


  componentDidMount = () => {
    axios.get('http://localhost:5000/users/' + this.props.userKey)
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
      <div class="trendingvids">


        {this.state.user != null &&


          <div id="userProf">
            <div>
              <p>Followers: {this.state.user.followers}, Following:   {this.state.user.following.length}</p>
            </div>
            <div>
            </div>{
              this.state.user != null &&
                <Saved currUser = {this.state.user}></Saved>

            }

          </div>

        }
      </div>
    );
  }
}