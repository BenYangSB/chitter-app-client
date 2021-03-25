import React, { Component } from 'react';
import axios from 'axios';

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
      <div class= "trendingvids">


          {this.state.user != null && 

          
          <div class = "card" id =  "createRecipe">
              <p>{"HELLO  " + this.state.user[0].username}</p>
              <div>
                  <p>Followers: {this.state.user[0].followers}</p>
              </div>
              <div>
                    Following:   {this.state.user[0].following.length}
              </div>
          </div>
          
          }
      </div>
    )
  }
}