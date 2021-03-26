import React, { Component } from 'react';
import axios from 'axios';
import LogIn from '../components/LogIn'
import MyRecipies from '../components/MyRecipies'
export default class Trending extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    }

  }


  componentDidMount = () => {
    axios.get('https://chitterr-app-api.herokuapp.com/users/' + this.props.userKey)
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            user: response.data.map(user => user),
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  followList = () => {
    return this.state.user[0].following.map(foll => {

      return <p>Following {foll}</p>;
    })
  }
  render() {
    return (
      <div class="trendingvids">


        {this.state.user != null &&


          <div id="userProf">
            <div>
              <p>Followers: {this.state.user[0].followers}, Following:   {this.state.user[0].following.length}</p>
            </div>
            <div>
            </div>
            <MyRecipies currUser = {this.state.user[0]}></MyRecipies>

          </div>

        }
      </div>
    );
  }
}