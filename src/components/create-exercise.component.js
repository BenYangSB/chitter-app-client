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
    this.onChangeInstructions = this.onChangeInstructions.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setImages = this.setImages.bind(this);

    this.state = {
      ingredients: '',
      description: '',
      instructions: 'empty',
      duration: 0,
      date: new Date(),
      users: [],
      pictures: [],
      multerImage: null,
      imageId: "",
      imgdata: null
    }
    this.onDrop = this.onDrop.bind(this);

  }

  componentDidMount() {

    axios.get('http://localhost:5000/users/')
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

  setDefaultImage(uploadType) {
    if (uploadType === "multer") {
      this.setState({
        multerImage: DefaultImg
      });
    }
  }

  uploadImageChange(e, method) {
    console.log("SUBMITTING IMAGE")

    this.setState({
      multerImage: URL.createObjectURL(e.target.files[0])
    });
  }

  // function to upload image once it has been captured
  // includes multer and firebase methods
  uploadImage(e, method) {

    console.log("adding image")

    if (e == null || e == undefined)
      return;
    let imageObj = {};

    let imageFormObj = new FormData();

    if (imageFormObj == undefined || e.target.files == null)
      return;

    let imgId = "multer-image-" + Date.now()
    imageFormObj.append("image", e.target.files[0]);
    imageFormObj.append("imageName", imgId);

    console.log(imgId);

    this.setState({
      imageId: imageFormObj.imageName
    })

    console.log("adding image")
    // stores a readable instance of 
    // the image being uploaded using multer
    this.setState({
      multerImage: URL.createObjectURL(e.target.files[0])
    });

    console.log(this.state.multerImage)

    axios.post('http://localhost:5000/image/uploadmulter', imageFormObj)
      .then((data) => {
        console.log(data.data.Location)
        this.setState({
          imgdata: data.data.Location
        })
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

  onChangeIngredients(e) {
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

  onChangeInstructions(e) {
    this.setState({
      instructions: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.state.imgdata == undefined || this.state.imgdata == null) {
      alert("please include an image");
      return;
    }

    if (this.state.instructions == '') {
      alert("please include instructions");
      return;
    }

    this.uploadImage(e, "multer");

    var temp = this.state.ingredients.split(",");

    const exercise = {
      username: this.props.userName,
      userKey: this.props.userKey,
      description: this.state.description,
      duration: this.state.duration,
      date: this.state.date,
      ingredients: temp,
      image: this.state.imgdata,
      instructions: this.state.instructions,
    }

    console.log(exercise);
    //    axios.post('https://chitterr-app-api.herokuapp.com/exercises/add', exercise)

    let recipeObjectId = null;

    axios.post('http://localhost:5000/exercises/add/', exercise)
      .then(res => {
        console.log(res.data)
        recipeObjectId = res.data;   // this does not give u the object id (not working)

        const newSaved = this.props.currUser.saved ? this.props.currUser.saved : [];
        newSaved.push(recipeObjectId);
        const userUpdateRecipes = {
          username: this.props.currUser.username,
          userKey: this.props.currUser.userKey,
          following: this.props.currUser.following,
          followers: this.props.currUser.followers,
          saved : newSaved
          // saved: this.props.currUser.saved == undefined || this.props.currUser.saved == null ? [] : this.props.currUser.saved
        }
        axios.post('http://localhost:5000/users/update/' + this.props.currUser._id, userUpdateRecipes)
          .then(res => {
            console.log(res.data)
          });
      });

    this.setState({
      description: "",
      duration: 0,
      instructions: '',
      ingredients: []
    })
  }


  onDrop(picture) {
    this.setState({
      pictures: this.state.pictures.concat(picture),
    });
  }

  handleTab = (event) => {
    if (event.keyCode === 9) {  // key clicked was tab
      event.preventDefault();
      let newInstructions = this.state.instructions;
      newInstructions = newInstructions + "\t";
      this.setState({
        instructions: newInstructions
      });
    }
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
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Username: {this.props.userName}</label>
            </div>
            <div className="form-group">
              <label>Description:</label>
              <input type="text"
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
              <label>Instructions: </label>
              <textarea
                className="form-control"
                value={this.state.instructions}
                onChange={this.onChangeInstructions}
                onKeyDown={this.handleTab}
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
              <p className="process__details">Upload an image!</p>

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
              <input type="submit" value="Post my recipe!" id="submitBtn" />
            </div>
          </form>
        </div>
      </div>

    )
  }
}