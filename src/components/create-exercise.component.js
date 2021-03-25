import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class CreateExercise extends Component {
  constructor(props) {
    super(props);

    this.onChangeIngredients = this.onChangeIngredients.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      ingredients: '',
      description: '',
      duration: 0,
      date: new Date(),
      users: []
    }
  }

  componentDidMount() {
    axios.get('https://chitterr-app-api.herokuapp.com/users/')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            users: response.data.map(user => user.username),
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })

  }


  onChangeIngredients(e){
    this.setState({
        ingredients: e.target.value
    })
  }
  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  onChangeDuration(e) {
    this.setState({
      duration: e.target.value
    })
  }

  onChangeDate(date) {
    this.setState({
      date: date
    })
  }

  onSubmit(e) {
    e.preventDefault();

    var temp  = this.state.ingredients.split(",");

    const exercise = {
      username: this.props.userName,
      userKey: this.props.userKey,
      description: this.state.description,
      duration: this.state.duration,
      date: this.state.date,
      ingredients: temp
    }

    console.log(exercise);

    axios.post('https://chitterr-app-api.herokuapp.com/exercises/add', exercise)
      .then(res => console.log(res.data));

      this.setState({
          description: "",
          duration: 0
      })
  }

  render() {
    return (
    <div className = "createRecipe">
      <h3>Post New Recipe!</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group"> 
          <label>Username: {this.props.userName}</label>
        </div>
        <div className="form-group"> 
          <label>Description: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
              />
        </div>
        <div className="form-group">
          <label>Ingredients (separate by commas): </label>
          <input 
              type="text" 
              className="form-control"
              value={this.state.ingredients}
              onChange={this.onChangeIngredients}
              />
        </div>
        <div className="form-group">
          <label>Duration (in minutes): </label>
          <input 
              type="text" 
              className="form-control"
              value={this.state.duration}
              onChange={this.onChangeDuration}
              />
        </div>
        <div className="form-group">
          <label>Date: </label>
          <div>
            <DatePicker
              selected={this.state.date}
              onChange={this.onChangeDate}
            />
          </div>
        </div>

        <div className="form-group">
          <input type="submit" value="Create Exercise Log"  id="submitBtn" />
        </div>
      </form>
    </div>
    )
  }
}