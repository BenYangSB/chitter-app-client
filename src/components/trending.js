import React, { Component } from 'react';
import axios from 'axios';

export default class Trending extends Component {
  constructor(props) {
    super(props);

    this.state = {
        youtubeAPIResponse : []
    }

  }


  componentDidMount() {
    let channels = ["lisa Ngyuen" , "gordon ramsay", "mikey chen"];

    channels.map((channel) => {
        axios.get('https://chitterr-app-api.herokuapp.com/users/trending', {
            headers: {
                'name' : channel,
            }
        })
        .then(res => {
            console.log(res.data.items)
            let curr = this.state.youtubeAPIResponse;
            curr = curr.concat(res.data.items);
            console.log(curr);

            this.setState({
                youtubeAPIResponse : curr
            })
        });
    })

  }


  render() {
    return (
      <div class= "trendingvids">
          {
              this.state.youtubeAPIResponse.map( (response)=>{
                  return <div>
                      <div class = "card" id = "trendingbody"> 
                          <h>
                          {response.snippet.title}
                          </h>
                          <div class = "trendingpic">
                          <img src = {response.snippet.thumbnails.high.url}></img>
                          </div>
                          {response.snippet.channelTitle}
                      </div>




                  </div>
              })
          }
      </div>
    )
  }
}