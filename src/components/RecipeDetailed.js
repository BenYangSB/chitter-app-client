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
    const [nutrition, setNutrition] = useState(null);

    useEffect(() => {
        console.log(params.id)
        axios.get('https://chitterr-app-api.herokuapp.com/exercises/' + params.id)
            .then(response => {
                console.log(response.data)
                setRecipe(response.data);
                const recipeBody = {
                    "ingredients": response.data.ingredients,
                    "description": response.data.description,
                    "instructions": response.data.instructions,
                    "servings": response.data.servings    // might be null,
                };
                const nutritionEtagAndId = response.data.nutritionEtagAndId // might be null
                console.log(recipeBody);
                if (nutritionEtagAndId && nutritionEtagAndId.etag && nutritionEtagAndId.id) {  // already have nutrition data in database
                    console.log("looking in database for nutrition")
                    axios.get('http://localhost:5000/nutrition/db/recipe/' + nutritionEtagAndId.id)
                        .then(nutriResponse => {
                            setNutrition(nutriResponse.data);
                        })
                        .catch(err => console.log(err))
                }
                else { // send recipe to api, get nutrition data, save that data to the database
                    console.log("looking in api for nutri info")
                    let etag = (response.data.nutritionEtagAndId && response.data.nutritionEtagAndId.etag) ? response.data.nutritionEtagAndId : "none";
                    axios.post('http://localhost:5000/nutrition/api/recipe', recipeBody, {params : {etag : etag}})
                        .then(nutriResponse => {
                            if (nutriResponse.alreadyInDatabase) {  // should not happen
                                axios.get('http://localhost:5000/nutrition/db/recipe/' + nutritionEtagAndId.id)
                                    .then(nutriResponse => {
                                        setNutrition(nutriResponse.data);
                                        console.log("found nutri data in database")
                                    })
                                    .catch(err => console.log(err))
                            }
                            else {
                                setNutrition(nutriResponse.data);
                                console.log("got nutri data from api")
                                // add etag to exercise
                                const updatedRecipe = {
                                    username: response.data.username,
                                    userKey: response.data.userKey,
                                    description: response.data.description,
                                    duration: response.data.duration,
                                    date: response.data.date,
                                    ingredients: response.data.ingredients,
                                    image: response.data.image,
                                    instructions: response.data.instructions,
                                    servings: response.data.servings,
                                    totalRating: response.data.totalRating,
                                    numRatings: response.data.numRatings,
                                    nutritionEtagAndId: {etag : nutriResponse.data.etag, id : nutriResponse.data.id}
                                }
                                console.log("Updated recipe nutritionEtagAndId: " + updatedRecipe.nutritionEtagAndId.etag + " | " + updatedRecipe.nutritionEtagAndId.id)
                                axios.post('http://localhost:5000/exercises/update/' + response.data._id, updatedRecipe)
                                    .then(response => { console.log("Successful update to db of nutri data") })
                                    .catch(err => console.log('Error: ' + err))
                            }

                            console.log("Finished API Post Request")
                        })
                        .catch(err => console.log("Error: " + err))
                }

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

    const onButtonClick = () => {
        console.log("Posting rating!")
        let updatedRec = recipe;
        updatedRec.numRatings = updatedRec.numRatings == undefined ? 1 : updatedRec.numRatings + 1;
        updatedRec.totalRating = updatedRec.totalRating == undefined ? 1 : updatedRec.totalRating + rating;

        axios.post('https://chitterr-app-api.herokuapp.com/exercises/update/' + recipe._id, updatedRec)
            .then(response => { console.log(response.data) });
    }

    return (
        <div className="recipeDetailedContainer">
            <div className="space"></div>
            {recipe != null &&
                <div className="recipeDetailedCard">
                    <div className='recipeTitleDetailed'>{recipe.description}</div>
                    {
                        recipe.numRatings == 0 ? <div>No ratings yet!</div> :
                            <div>Rating from {recipe.numRatings} users : {(recipe.totalRating / recipe.numRatings).toFixed(1)} &#11088;
                        </div>
                    }

                    <div className="recipePosterDetailed">{recipe.username}</div>
                    <p className="recipeTime">Time to make : {recipe.duration} minutes</p>
                    <div className="recipeDetIngredients"><List ingList={recipe.ingredients} /></div>
                    <div className="instructionsTitle">Instructions:</div>
                    <div className="instructions">{recipe.instructions}</div>
                    {recipe.servings && <div className="servings">{recipe.servings} servings!</div>}
                    {recipe.image != undefined &&
                        <img className="recipeDetImg" alt="Image of Recipe" src={recipe.image} />}
                    {
                        (getCurrUserKey() == recipe.userKey && getCurrUserKey() != 'none') &&
                        <p className="editDelete detailedEditDelete">
                            <Link to={"/edit/" + params.id}>&#9999;</Link> | <Link to='/feed' onClick={() => { deleteExercise(recipe._id) }}><a href="#">&#128465;</a></Link>
                        </p>
                    }
                    {nutrition &&
                        <div>Calories: {nutrition.calories}</div>
                        && <NutritionCard nutrition={nutrition} />
                    }



                    <div>
                        <h2>Your Rating: {rating}</h2>
                        <StarRatingComponent
                            name="rate1"
                            starCount={10}
                            value={rating}
                            onStarClick={onStarClick}
                        />

                        <button onClick={onButtonClick}>Rate!</button>
                    </div>
                </div>
            }



            <div className="space"></div>
        </div>
    );
}

export default RecipeDetailed;

export const NutritionCard = (props) => {
    return (
        <div className="nutritionCard">
            <div className="calories"> Calories: {props.nutrition.calories}</div>
            <div className="carbs">Carbs: {props.nutrition.totalNutrientsKCal.CHOCDF_KCAL.quantity} cal ({props.nutrition.totalDaily.CHOCDF.quantity} %) {props.nutrition.totalNutrients.CHOCDF.quantity}g</div>
            <div className="proteins">Protein: {props.nutrition.totalNutrientsKCal.PROCNT_KCAL.quantity} cal ({props.nutrition.totalDaily.PROCNT.quantity} %) {props.nutrition.totalNutrients.PROCNT.quantity}g</div>
            <div className="fat">Fat: {props.nutrition.totalNutrientsKCal.FAT_KCAL.quantity} cal ({props.nutrition.totalDaily.FAT.quantity} %) {props.nutrition.totalNutrients.FAT.quantity}g</div>
            <div id="edamam-badge" data-color="white"></div>
        </div>
    );
}