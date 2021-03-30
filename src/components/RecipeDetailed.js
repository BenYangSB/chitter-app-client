import React, { useState, useEffect, useParams } from 'react';
import List from './Lst';
import {getCurrUserKey} from './localStorageFunctions';
import axios from 'axios';
import {Link} from 'react-router-dom'


const RecipeDetailed = () => {

    const params = useParams(); // used to get the id from the url
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        console.log(params.id)
        axios.get('http://localhost:5000/exercises/' + params.id)
            .then(response => {
                console.log(response.data)
                setRecipe(response.data);
            })
            .catch(err => console.log("Error: " + err));
    }, []);

    const ingList = (ingredients) => {
        if (ingredients == undefined)
            return;

        ingredients.map(ing => {
            return <li>{ing}</li>
        })
    };

    const deleteExercise = (id) => {
        axios.delete('https://chitterr-app-api.herokuapp.com/exercises/' + id)
            .then(response => { console.log(response.data) });

        this.setState({
            exercises: this.state.exercises.filter(el => el._id !== id)
        })
    };

    return (
        <div>
            hello
            {recipe != null &&
                <div className="card">
                    <div className='recipeTitleDetailed'>{recipe.description}</div>
                    <div className="recipePosterDetailed">{recipe.username}</div>
                    <p className="recipeTime">Time to make : {this.props.exercise.duration} minutes</p>
                    <List ingList={ingList(recipe.ingredients)} />
                    <div className="instructionsTitle">Instructions:</div>
                    <div className="instructions">{recipe.instructions}</div>
                    {recipe.image != undefined &&
                        <img alt="Image of Recipe" src={recipe.image} />}
                    {
                        (getCurrUserKey() == recipe.userKey && getCurrUserKey() != 'none') &&
                        <p class="editDelete">
                            <Link to={"/edit/" + params.id}>&#9999;</Link> | <a href="#" onClick={() => { deleteExercise(recipe._id) }}>&#128465;</a>
                        </p>
                    }
                </div>
            }
        </div>
    );
}

export default RecipeDetailed;