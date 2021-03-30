import React, { Component } from 'react';
import Lst from '../components/Lst';
import { Link } from 'react-router-dom';
import axios from 'axios';



export default class Exercise extends Component {

    constructor(props) {
        super(props);

        this.state = { image: null };
    }


    render() {
        return (
            <div className="card" id="recipe">

                <h className="recipePoster">{this.props.exercise.username}</h>
                <h className="recipeTitle">{this.props.exercise.description}</h>

                <p className="recipeTime">Time to make : {this.props.exercise.duration} minutes</p>
                <img src=""></img>
                <Lst ingList={this.props.exercise.ingredients}></Lst>

                <br></br>

                { this.props.exercise.image != undefined &&
                    console.log("https://chitterr-app-api.herokuapp.com/image/picture/" + this.props.exercise.image)
                }
                { this.props.exercise.image != undefined &&
                    <img className="awsImage" src={this.props.exercise.image} />
                }
                {/* <p>{this.props.exercise.date.substring(0, 10)}</p> */}
                {   !this.props.showMore &&
                    ((this.props.exercise.userKey == this.props.currentKey) || (this.props.currUser != null && this.props.currUser != undefined && this.props.exercise.userKey == this.props.currUser.userKey)) &&
                    <p class="editDelete">
                        <Link to={"/edit/" + this.props.exercise._id}>&#9999;</Link> | <a href="#" onClick={() => { this.props.deleteExercise(this.props.exercise._id) }}>&#128465;</a>
                    </p>
                }
                {   this.props.showMore &&
                    // ((this.props.exercise.userKey == this.props.currentKey) || (this.props.currUser != null && this.props.currUser != undefined && this.props.exercise.userKey == this.props.currUser.userKey)) &&
                    <p class="more">
                        {/* <Link to={"/edit/" + this.props.exercise._id}>&#10158;</Link> */}
                        <Link to={"/recipe/" + this.props.exercise._id}>&#10158;</Link>
                    </p>
                }

            </div>
        );
    }



}