import React, { Component } from 'react';
import Exercise from './exercise';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { createPrinter } from 'typescript';
import BlueLoadingBar from '../assets/BlueLoadingBar.svg'

class Saved extends Component {
    constructor(props) {
        super(props);

        this.state = {
            savedRecipes: [],
            displayedRecipes: [],
            currUser: this.props.currUser,
            loading : true
        }
    }

    componentDidMount = () => {
        this.reReadEverythingFromDatabase();
        // if (this.state.currUser != null || this.state.currUser != undefined) {

        //     axios.get('http://localhost:5000/users/' + this.state.currUser.userKey)
        //         .then(response => {
        //             if (response.data.length > 0) {
        //                 this.setState({
        //                     savedRecipes: response.data[0].saved,
        //                     currUser : response.data[0]
        //                 })

        //                 this.state.savedRecipes.map((recipeId) => {
        //                     axios.get('http://localhost:5000/exercises/' + recipeId)
        //                         .then(response => {
        //                             let temp = this.state.displayedRecipes;

        //                             temp.push(response.data)
        //                             this.setState({
        //                                 displayedRecipes: temp
        //                             })
        //                             // console.log(this.state.displayedRecipes)
        //                         })
        //                         .catch((error) => {
        //                             console.log(error);
        //                         })
        //                 })
        //             }
        //         })
        //         .catch((error) => {
        //             console.log(error);
        //         })
        // }
    };

    reReadEverythingFromDatabase = () => {
        if (this.state.currUser != null || this.state.currUser != undefined) {

            axios.get('http://localhost:5000/users/' + this.state.currUser.userKey)
                .then(response => {
                    if (response && response.data && response.data.length > 0) {
                        this.setState({
                            savedRecipes: response.data[0].saved,
                            currUser : response.data[0]
                        })

                        this.state.savedRecipes.map((recipeId) => {
                            axios.get('http://localhost:5000/exercises/' + recipeId)
                                .then(response => {
                                    let temp = this.state.displayedRecipes;

                                    temp.push(response.data)
                                    this.setState({
                                        displayedRecipes: temp
                                    })
                                    setTimeout(() => {this.setState({loading : false})}, 100);
                                    // console.log(this.state.displayedRecipes)
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    updateCurrUser = () => {
        axios.get('http://localhost:5000/users/' + this.state.currUser.userKey)
            .then(response => {
                if (response != null && response.data != null && response.data.length > 0) {
                    this.setState({ currUser: response.data[0] });
                }
            })
    }

    ingList = (ingredients) => {
        if (ingredients == undefined)
            return;

        ingredients.map(ing => {
            return <li>{ing}</li>
        })
    };

    deleteExercise = (id) => {
        axios.delete('https://chitterr-app-api.herokuapp.com/exercises/' + id)
            .then(response => { 
                console.log(response.data)
                // this.updateCurrUser();
                this.reReadEverythingFromDatabase(); 
            });

        this.setState({
            exercises: this.state.exercises.filter(el => el._id !== id)
        })
    };

    exerciseList = () => {
        return this.state.displayedRecipes.map(currentexercise => {
            if (currentexercise == undefined || currentexercise == undefined)
                return null;
            return <Exercise dontShowBtn={true} showMore={true} currUser={this.props.currUser} ingList={this.ingList()} currentKey={this.props.userKey} exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
        })
    };


    render() {
        return (
            <div className="myRecipes">
                <div className="feed-title">Saved Recipes</div>
                {
                    console.log(this.state.displayedRecipes)
                }
                <div className="feed-total">
                    {this.state.loading && <img className="loadingBar" src={BlueLoadingBar}/>}
                    {!this.state.loading && this.state.displayedRecipes.length == 0 &&
                        <div className="emptyMsg">No saved posts yet!</div>
                    }
                    {this.exerciseList()}
                </div>
            </div>

        )
    }
};

export default Saved;