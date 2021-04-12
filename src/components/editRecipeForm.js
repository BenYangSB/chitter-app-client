import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DefaultImg from '../assets/img1.jpeg';
import { Route, Link } from 'react-router-dom';

class editRecipeForm extends Component {
    constructor(props) {
        super(props);
        // props needed : username, userKey, currUser, isEdit
        // optional props (recommended for for edit exercise):
        //    match
        //    ingredients, description, instructions, duration, date, multerImage 
        //         Not sure about these : imageId, imgData

        this.textAreaRef = React.createRef();
        this.state = {
            username: this.props.username,
            ingredients: '',
            description: '',
            instructions: 'empty',
            duration: 0,
            date: new Date(),
            users: [],
            pictures: [],
            multerImage: null,
            imageId: "",
            imgdata: null,
            recipeId: null
        }
    }
    componentDidMount() {

        // don't need this i think
        // axios.get('http://localhost:5000/users/')
        //     .then(response => {
        //         if (response.data.length > 0) {
        //             this.setState({
        //                 users: response.data.map(user => user.username),
        //             })
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })
        if (this.props.isEdit) {
            axios.get('https://chitterr-app-api.herokuapp.com/exercises/' + this.props.match.params.id)
                .then(response => {
                    console.log(response.data)
                    console.log("date from new Date: "+ this.state.date);
                    console.log("Date created form mongodb: " + new Date(response.data.date));
                    this.setState({
                        username: response.data.username,
                        userKey: response.data.userKey,
                        description: response.data.description,
                        instructions: response.data.instructions,
                        ingredients: response.data.ingredients.join(),
                        duration: response.data.duration,
                        date: new Date(response.data.date),
                        imgdata: response.data.image,
                        multerImage: response.data.image
                    })
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    }

    setDefaultImage = (uploadType) => {
        if (uploadType === "multer") {
            this.setState({
                multerImage: DefaultImg
            });
        }
    }

    uploadImageChange = (e, method) => {
        console.log("SUBMITTING IMAGE")

        this.setState({
            multerImage: URL.createObjectURL(e.target.files[0])
        });
    }

    // function to upload image once it has been captured
    // includes multer and firebase methods
    uploadImage = (e, method) => {

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


    setImages = (input) => {
        this.setState({
            pictures: input
        })
    }

    onChangeIngredients = (e) => {
        this.setState({
            ingredients: e.target.value
        })
    }
    onChangeDescription = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    onChangeDuration = (e) => {
        this.setState({
            duration: e.target.value
        })
    }

    onChangeDate = (date) => {
        this.setState({
            date: date
        })
    }

    onChangeInstructions = (e) => {
        this.setState({
            instructions: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();

        let error = false;
        let errorMsg = "";
        if (this.state.imgdata == undefined || this.state.imgdata == null) {
            // alert("please include an image");
            // return;
            errorMsg = errorMsg + "Please include an image."
            error = true;
        }

        if (this.state.instructions == '') {
            // alert("please include instructions");
            // return;
            errorMsg = errorMsg + "Please include instructions."
            error = true;
        }
        if (error) {
            alert(errorMsg);
            return;
        }

        this.uploadImage(e, "multer");

        var temp = (this.state.ingredients != undefined && this.state.ingredients != null && this.state.ingredients != "") ? this.state.ingredients.split(",") : [];

        const exercise = {
            username: this.props.username,
            userKey: this.props.userKey,
            description: this.state.description,
            duration: this.state.duration,
            date: this.state.date,
            ingredients: temp,
            image: this.state.imgdata,
            instructions: this.state.instructions,
            totalRatings : this.props.currUser.totalRatings,
            numRatings : this.props.currUser.numRatings
        }

        console.log(exercise);
        //    axios.post('https://chitterr-app-api.herokuapp.com/exercises/add', exercise)

        let recipeObjectId = null;

        if (!this.props.isEdit) {
            axios.post('http://localhost:5000/exercises/add/', exercise)
                .then(res => {
                    console.log(res.data)
                    recipeObjectId = res.data;   // this gives u the object id of the newExercise

                    const newSaved = this.props.currUser.saved ? this.props.currUser.saved : [];
                    newSaved.push(recipeObjectId);
                    const userUpdateRecipes = {
                        username: this.props.currUser.username,
                        userKey: this.props.currUser.userKey,
                        following: this.props.currUser.following,
                        followers: this.props.currUser.followers,
                        saved: newSaved,
                        // saved: this.props.currUser.saved == undefined || this.props.currUser.saved == null ? [] : this.props.currUser.saved
                    }
                    axios.post('http://localhost:5000/users/update/' + this.props.currUser._id, userUpdateRecipes)
                        .then(res => {
                            console.log(res.data + "Successful post!")
                        });
                });

                // clear form
                this.setState({
                    description: "",
                    duration: 0,
                    instructions: '',
                    ingredients: [],
                    multerImage: null
                })
        }
        else {
            // console.log("updating recipe..." + this.props.match.params.id);
            axios.post('http://localhost:5000/exercises/update/' + this.props.match.params.id, exercise)
                .then(response => {console.log("Successful update")})
                .catch(err => console.log('Error: ' + err))
        }
    }


    onDrop = (picture) => {
        this.setState({
            pictures: this.state.pictures.concat(picture),
        });
    }

    handleTab = (event) => {
        if (event.key === 'Tab' && !event.shiftKey) {  // key clicked was tab
            event.preventDefault();

            document.execCommand('insertText', false, "\t");

            return false;

            // kinda works
            // const { selectionStart, selectionEnd } = event.target;  // get cursor position

            // let newInstructions = this.state.instructions;
            // newInstructions = newInstructions + "";
            // this.setState(prevState => ({
            //   instructions: prevState.instructions.substring(0, selectionStart) + "\t" + prevState.instructions.substring(selectionEnd)
            // }),
            // update the cursor position after adding the tab (doesn't work)
            // () => {
            // if (this.textAreaRef.current )
            //   this.textAreaRef.current.selectionStart =  selectionStart + 1;
            // if (this.textAreaRef.current)
            //   this.textAreaRef.current.selectionEnd = selectionStart + 1;
            // }
            // );
        }
    }
    render() {
        return (
            <div className="editeRecipeForm">
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: {this.state.username}</label>
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
                            required
                            className="form-control"
                            value={this.state.ingredients}
                            onChange={this.onChangeIngredients}
                        />
                    </div>
                    <div className="form-group">
                        <label>Instructions: </label>
                        <textarea
                            required
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
                        // console.log(this.state.pictures)
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
        )
    }
}

export default editRecipeForm;