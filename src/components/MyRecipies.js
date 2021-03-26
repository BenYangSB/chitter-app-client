import React, { Component } from 'react';
import Exercise from '../components/exercise';
import { Link } from 'react-router-dom';
import axios from 'axios';

class MyRecipies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            exercises: []
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

                    this.setState({ exercises: newExercises });
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
            return <Exercise currUser = {this.props.currUser} ingList={this.ingList()} currentKey={this.props.userKey} exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
        })
    };


    render() {
        return (
            <div class="myRecipes">
                <div className="feed-title">My Recipes</div>
                <div className="feed-total">
                    {this.exerciseList()}
                </div>
            </div>
            
        )
    }
};

export default MyRecipies;