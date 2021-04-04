import React, { Component } from 'react';
import Exercise from './exercise';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { createPrinter } from 'typescript';

class Saved extends Component {
    constructor(props) {
        super(props);

        this.state = {
            savedRecipes: [],
            displayedRecipes: [],
        }
    }

    componentDidMount = () => {

        if (this.props.currUser != null || this.props.currUser != undefined) {

        axios.get('http://localhost:5000/users/'+ this.props.currUser.userKey)
        .then(response => {
        if (response.data.length > 0) {         
            this.setState({
                savedRecipes: response.data[0].saved
            })

            this.state.savedRecipes.map((recipe) => {
                axios.get('http://localhost:5000/exercises/'+ recipe)
                .then(response => {
                        let temp = this.state.displayedRecipes;
                        
                        temp.push(response.data)
                        this.setState({
                            displayedRecipes: temp
                        })
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
        return this.state.displayedRecipes.map(currentexercise => {
            if (currentexercise == undefined || currentexercise == undefined)
                return null;
            return <Exercise showMore = {true} currUser = {this.props.currUser} ingList={this.ingList()} currentKey={this.props.userKey} exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
        })
    };


    render() {
        return (
            <div class="myRecipes">
                <div className="feed-title">Saved Recipes</div>
                {
                    console.log(this.state.displayedRecipes)
                }
                <div className="feed-total">
                    {this.exerciseList()}
                </div>
            </div>
            
        )
    }
};

export default Saved;