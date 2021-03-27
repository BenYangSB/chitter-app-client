import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ImageUploader from 'react-images-upload';
import IMGS from './PostPicture'
import DefaultImg from '../assets/img1.jpeg'
export default class CreateExercise extends Component {
  constructor(props) {
    super(props);

    this.onChangeIngredients = this.onChangeIngredients.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setImages = this.setImages.bind(this);

    this.state = {
      ingredients: '',
      description: '',
      duration: 0,
      date: new Date(),
      users: [],
      pictures: [],
      multerImage: null,
    }
    this.onDrop = this.onDrop.bind(this);

  }

  setDefaultImage(uploadType) {
    if (uploadType === "multer") {
      this.setState({
        multerImage: DefaultImg
      });
    } 
  }

    // function to upload image once it has been captured
  // includes multer and firebase methods
  uploadImage(e, method) {
      let imageObj = {};
    
      let imageFormObj = new FormData();

      imageFormObj.append("imageName", "multer-image-" + Date.now());
      imageFormObj.append("imageData", e.target.files[0]);

      // stores a readable instance of 
      // the image being uploaded using multer
      this.setState({
        multerImage: URL.createObjectURL(e.target.files[0])
      });

      axios.post("http://localhost:5000/image/uploadmulter", imageFormObj)
        .then((data) => {
          if (data.data.success) {
            alert("Image has been successfully uploaded using multer");
            this.setDefaultImage("multer");
          }
        })
        .catch((err) => {
          alert("Error while uploading image using multer");
          this.setDefaultImage("multer");
        });
  
  }


  setImages(input) {
    this.setState({
      pictures: input
    })
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
  onDrop(picture) {
    this.setState({
        pictures: this.state.pictures.concat(picture),
    });
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

        <div className="process">
            <h4 className="process__heading">Process: Using Multer</h4>
            <p className="process__details">Upload image to a node server, connected to a MongoDB database, with the help of multer</p>

            <input type="file" className="process__upload-btn" onChange={(e) => this.uploadImage(e, "multer")} />
            <img src={this.state.multerImage} alt="upload-image" className="process__image" />
        </div>
        {
          console.log(this.state.pictures)
        }

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
          <input type="submit" value="Post my recipe!"  id="submitBtn" />
        </div>
      </form>
    </div>
    )
  }
}