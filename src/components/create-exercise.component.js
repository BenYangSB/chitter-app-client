import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ImageUploader from 'react-images-upload';
import IMGS from './PostPicture'
import DefaultImg from '../assets/img1.jpeg'
import EditRecipeForm from './editRecipeForm';

export default class CreateExercise extends Component {
  constructor(props) {
    super(props);

    this.textAreaRef = React.createRef();
  
  }

  componentDidMount() {

    // axios.get('http://localhost:5000/users/')
    //   .then(response => {
    //     if (response.data.length > 0) {
    //       this.setState({
    //         users: response.data.map(user => user.username),
    //       })
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   })

  }

 


  render() {
    return (

      <div class="createR">

        <div>
          <br></br>
          <br></br>
        </div>
        <div className="createRecipe">
          <h3>Post a new recipe!</h3>
          <EditRecipeForm
            isEdit={false}
            currUser={this.props.currUser}
            username={this.props.username}
            userKey={this.props.userKey}
          />
        </div>
      </div>

    )
  }
}