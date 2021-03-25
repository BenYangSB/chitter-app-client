import React, { Component } from 'react';
import axios from 'axios';

export default class CreateUser extends Component {
  constructor(props) {
    super(props);

    // this.onFollow = this.onFollow.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      users: [],
      currentUser: null
    }
  }


  onFollow = (input) =>{

    console.log("HWEHFHDSGFSDJFGSDGFWDFJG")

    if(input.userKey == this.state.userKey || this.state.currentUser == null || this.state.currentUser == undefined)
      return;

    let temp = (this.state.currentUser.following);
    // console.log(temp);
    if(!temp.includes(input.userKey)){
        temp.push(input.userKey)

        console.log(temp);
        const userUpdatedFollow = {
          username: this.state.currentUser.username,
          userKey: this.state.currentUser.userKey,
          following: temp,
          followers: this.state.currentUser.followers,
        }

        axios.post('https://chitterr-app-api.herokuapp.com/users/update/' + this.state.currentUser._id, userUpdatedFollow)
        .then(res => console.log(res.data));

        const userUpdatedFollowers = {
          username: input.username,
          userKey: input.userKey,
          following: input.following,
          followers: input.followers+1,
        }
        axios.post('https://chitterr-app-api.herokuapp.com/users/update/' + input._id, userUpdatedFollowers)
        .then(res => console.log(res.data));
    }

    this.readUsers();
  }
  onUnFollow = (input) =>{

    console.log(this.state.currentUser)

    if(input.userKey == this.state.userKey || this.state.currentUser == null || this.state.currentUser == undefined)
      return;

    // console.log(this.state.currentUser);
    let temp = (this.state.currentUser.following);
    // console.log(temp);
    let index = temp.indexOf(input.userKey);
    if(index > -1){
        temp.splice(index,1)

        console.log(temp);
        const userUpdatedFollow = {
          username: this.state.currentUser.username,
          userKey: this.state.currentUser.userKey,
          following: temp,
          followers: this.state.currentUser.followers,
        }

        axios.post('https://chitterr-app-api.herokuapp.com/users/update/' + this.state.currentUser._id, userUpdatedFollow)
        .then(res => console.log(res.data));

        const userUpdatedFollowers = {
          username: input.username,
          userKey: input.userKey,
          following: input.following,
          followers: input.followers-1,
        }
        axios.post('https://chitterr-app-api.herokuapp.com/users/update/' + input._id, userUpdatedFollowers)
        .then(res => console.log(res.data));
    }

    this.readUsers();
  }

  readUsers = () => {
    axios.get('https://chitterr-app-api.herokuapp.com/users/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data.map(user => user ),
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })

      console.log(this.state.currentUser);
  }

  componentDidMount() {
    this.readUsers();
    console.log(this.props.userKey)
    axios.get('https://chitterr-app-api.herokuapp.com/users/' + this.props.userKey)
      .then(response => {
        if (response.data != null && response.data.length > 0) {
          this.setState({
            currentUser: response.data[0],
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })

      console.log(this.state.currentUser);
  }
  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username
    }

    console.log(user);

    axios.post('https://chitterr-app-api.herokuapp.com/users/add', user)
      .then(res => console.log(res.data));

    this.setState({
      username: ''
    })
  }

  render() {
    return (
      <div class = "absFeed">
              {
                this.state.users.map((user)=> {
                  return <div class= "follow"> 
                      {console.log(user.username)}

                      {user.username + " -> " + user.followers}
                      {   this.state.currentUser != null && !this.state.currentUser.following.includes(user.userKey) ?
                        
                          <button id = "followBtn" onClick = {()=> this.onFollow(user)}>
                          Follow!
                          </button>   
                          :
                          <button id = "followBtn" onClick = {()=> this.onUnFollow(user)}>
                          UnFollow!
                          </button>   
                      }
          
                  </div>;
                })
              }
      </div>
    )
  }
}