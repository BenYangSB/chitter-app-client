import React, { Component } from 'react';
import Exercise from './exercise';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BlueLoadingBar from '../assets/BlueLoadingBar.svg';
import firebase from 'firebase'

class MyRecipies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            exercises: [],
            loading: true,
            currentUserKey : firebase.auth().currentUser.uid
        }
    }

    componentDidMount = () => {

        if (this.props.currUser != null || this.props.currUser != undefined) {

            //use this after backend is deployed
            // axios.get('https://chitterr-app-api.herokuapp.com/exercises/myRecipes/' + this.props.userKey)

            axios.get('https://chitterr-app-api.herokuapp.com/exercises/myRecipes/' + this.props.currUser.userKey)
                .then(response => {
                    let newExercises = this.state.exercises;
                    console.log(response);

                    response.data.forEach(exercise => {
                        newExercises.push(exercise);
                    });

                    this.setState({ 
                        exercises: newExercises
                     });
                     setTimeout(() => {this.setState({loading : false})}, 50);
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    };

    ingList = (ingredients) => {
        if (ingredients == undefined)
            return;

        ingredients.map(ing => {
            return <li>{ing}</li>
        })
    };

    deleteExercise = (id) => {
        axios.delete('https://chitterr-app-api.herokuapp.com/exercises/' + id)
            .then(response => { console.log(response.data) });

        this.setState({
            exercises: this.state.exercises.filter(el => el._id !== id)
        })
    };

    exerciseList = () => {
        return this.state.exercises.map(currentexercise => {
            if (currentexercise == undefined || currentexercise == undefined)
                return null;
            return <Exercise display = {true} currUser = {this.props.currUser} ingList={this.ingList()} currentKey={this.state.userKey} exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
        })
    };


    render() {
        return (
            <div class="myRecipes">
                <div className="feed-title">My Recipes</div>
                <div className="feed-total">
                    {this.state.loading &&
                        <img className="loadingBar" src={BlueLoadingBar}/>
                    }
                    {!this.state.loading && this.state.exercises.length == 0 &&
                        <div className="emptyMsg">No recipes yet! Add some recipes!</div>
                    }
                    {this.exerciseList()}
                </div>
            </div>
            
        )
    }
};

export default MyRecipies;