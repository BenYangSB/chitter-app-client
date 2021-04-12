import React, { Component } from 'react';
import Lst from './Lst';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';




export default class Exercise extends Component {

    constructor(props) {
        super(props);

        this.state = { image: null, rating: 1 };
    }


    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }



    render() {
        const { rating } = this.state;
        return (

            
            <div className="card" id="recipe">

                {console.log(this.props.exercise.numRatings)}
                <h className="recipePoster">{this.props.exercise.username}</h>
                <h className="recipeTitle">{this.props.exercise.description}</h>

                    {
                        this.props.exercise.numRatings == 0 ? <div>No ratings yet!</div> :
                        <div>{(this.props.exercise.totalRating/this.props.exercise.numRatings).toFixed(1)} &#11088;
                        </div>
                    }

                {/* <p className="recipeTime">Time to make : {this.props.exercise.duration} minutes</p>
                <img src=""></img>
                <Lst ingList={this.props.exercise.ingredients}></Lst> */}

                <br></br>


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
                        {
                            !this.props.dontShowBtn && !this.props.showUnSave &&
                            <button onClick={() => this.props.handleSave(this.props.exercise._id)} className="saveBtn">&#x21e9;</button>

                        }
                        {this.props.showUnSave &&
                            <button class="unSaveBtn" onClick={() => {this.props.unSave(this.props.exercise._id)}}>&#10683;
                            </button>}
                    </p>
                }



            </div>
        );
    }



}