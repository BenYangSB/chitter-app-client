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
        if (this.props.userKey != null || this.props.userKey != undefined) {
            axios.get('https://chitterr-app-api.herokuapp.com/exercises/myRecipes/' + this.props.userKey)
                .then(response => {
                    let newExercises = this.state.exercises;
                    
                    response.data.forEach(exercise => {
                        newExercises.push(exercise);
                    });

                    this.setState({ exercises: newExercises });
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    ingList = (ingredients) => {
        if (ingredients == undefined)
            return;

        ingredients.map(ing => {
            return <li>{ing}</li>
        })
    }

    deleteExercise = (id) => {
        axios.delete('https://chitterr-app-api.herokuapp.com/exercises/' + id)
            .then(response => { console.log(response.data) });

        this.setState({
            exercises: this.state.exercises.filter(el => el._id !== id)
        })
    }
    exerciseList = () => {
        return this.state.exercises.map(currentexercise => {
            if (currentexercise == undefined)
                return;
            console.log("HERE");
            console.log(currentexercise)
            return <Exercise ingList={this.ingList()} currentKey={this.props.currentUserKey} exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
        })
    }


    render() {
        return (
            <div>
                <div className="">My Recipes</div>
                <div className="myRecipes">
                    {this.exerciseList()}
                </div>
            </div>
        )
    }
}

export default MyRecipies;