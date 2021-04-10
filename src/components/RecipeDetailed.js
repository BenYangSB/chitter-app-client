import React, { useState, useEffect } from 'react';
import List from './Lst';
import { getCurrUserKey } from './localStorageFunctions';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';


const RecipeDetailed = (props) => {

    const params = useParams(); // used to get the id from the url
    const [recipe, setRecipe] = useState(null);
    const [rating, setRating] = useState(1);

    useEffect(() => {
        console.log(params.id)
        axios.get('http://localhost:5000/exercises/' + params.id)
            .then(response => {
                console.log(response.data)
                setRecipe(response.data);
            })
            .catch(err => console.log("Error: " + err));
    }, []);

    const deleteExercise = (id) => {
        axios.delete('https://chitterr-app-api.herokuapp.com/exercises/' + id)
            .then(response => { console.log(response.data) });
    };

    const onStarClick = (nextValue, prevValue, name) => {
        console.log("HERE");
        setRating(nextValue);
    }

    return (
        <div className="recipeDetailedContainer">
            <div className="space"></div>
            {recipe != null &&
                <div className="recipeDetailedCard">
                    <div className='recipeTitleDetailed'>{recipe.description}</div>
                    <div className="recipePosterDetailed">{recipe.username}</div>
                    <p className="recipeTime">Time to make : {recipe.duration} minutes</p>
                    <div className="recipeDetIngredients"><List ingList={recipe.ingredients} /></div>
                    <div className="instructionsTitle">Instructions:</div>
                    <div className="instructions">{recipe.instructions}</div>
                    {recipe.image != undefined &&
                        <img className="recipeDetImg" alt="Image of Recipe" src={recipe.image} />}
                    {
                        (getCurrUserKey() == recipe.userKey && getCurrUserKey() != 'none') &&
                        <p className="editDelete detailedEditDelete">
                            <Link to={"/edit/" + params.id}>&#9999;</Link> | <Link to='/feed'  onClick={() => { deleteExercise(recipe._id) }}><a href="#">&#128465;</a></Link>
                        </p>
                    }



                <div>
                    <h2>Your Rating: {rating}</h2>
                    <StarRatingComponent 
                    name="rate1" 
                    starCount={10}
                    value={rating}
                    onStarClick={onStarClick}
                    />
                </div>
                </div>
            }



            <div className="space"></div>
        </div>
    );
}

export default RecipeDetailed;