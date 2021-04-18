import React, { useState, useEffect } from 'react';
import List from './Lst';
import { getCurrUserKey } from './localStorageFunctions';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import Comment from './create-comment';
import EdamamAttribution from '../assets/edamamBadge.png';

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
                    axios.post('http://localhost:5000/nutrition/api/recipe', recipeBody, { params: { etag: etag } })
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
                                    nutritionEtagAndId: { etag: nutriResponse.data.etag, id: nutriResponse.data.id }
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

    const onButtonClick = (rate) => {
        console.log("Posting rating!")
        let updatedRec = recipe;
        updatedRec.numRatings = updatedRec.numRatings == undefined ? 1 : updatedRec.numRatings + 1;
        updatedRec.totalRating = updatedRec.totalRating == undefined ? 1 : updatedRec.totalRating + rate;

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
                    
                    {nutrition &&
                        <NutritionCard nutrition={nutrition} />
                    }

                    {
                        (getCurrUserKey() == recipe.userKey && getCurrUserKey() != 'none') &&
                        <p className="editDelete detailedEditDelete">
                            <Link to={"/edit/" + params.id}>&#9999;</Link> | <Link to='/feed' onClick={() => { deleteExercise(recipe._id) }}><a href="#">&#128465;</a></Link>
                        </p>
                    }


                </div>
            }



            <div className="space"></div>

            <Comment onButtonClick={onButtonClick}></Comment>

        </div>
    );
}

export default RecipeDetailed;

export const NutritionCard = (props) => {
    return (
        
        <div className="nutritionCard">
            {console.log(props.nutrition)}
            <div className="nutritionTitle">Nutrition Facts</div>
            
            <div className="servings">{props.nutrition.yield} servings</div>
            <div className="servingSize"><div className="servingSizeTxt">Serving size</div><div className="servingSizeQ">({Math.round(props.nutrition.totalWeight / props.nutrition.yield)}g)</div></div>
            
            <div className="thickHorizontalBar"></div>

            <div className="amntPerServing">Amount per serving</div>
            <div className="caloriesRow">
                    <div className="caloriesTitle">Calories</div> <div className="caloriesQ">{Math.round(props.nutrition.calories/props.nutrition.yield)}</div>
            </div>

            <div className="dailyValContainer"><div className="dailyValue">% Daily Value</div></div>
            <div className="nutritionSubContainer">
                <div className="totalFat nutritionRow"><div className="miniTitle">Total Fat </div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.FAT.quantity)}g</div><div className="percent">{Math.round(props.nutrition.totalDaily.FAT.quantity)}%</div></div>
                    <div className="nutritionRow"><div className="indent">Saturated Fat {Math.round(props.nutrition.totalNutrients.FASAT.quantity)}g</div><div className="percent">{Math.round(props.nutrition.totalDaily.FASAT.quantity)}%</div></div>
                    <div className="nutritionRow"><div className="indent italicize">Trans</div><div className="transFat"> Fat {Math.round(props.nutrition.totalNutrients.FATRN.quantity)}g</div></div>
                <div className="nutritionRow"><div className="miniTitle">Cholesterol</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.CHOLE.quantity)}mg</div> <div className="percent">{Math.round(props.nutrition.totalDaily.CHOLE.quantity)}%</div></div>
                <div className="nutritionRow"><div className="miniTitle">Sodium</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.NA.quantity)}mg</div> <div className="percent">{Math.round(props.nutrition.totalDaily.NA.quantity)}%</div></div>
                <div className="nutritionRow"><div className="miniTitle">Total Carbohydrate</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.CHOCDF.quantity)}g</div> <div className="percent">{Math.round(props.nutrition.totalDaily.CHOCDF.quantity)}%</div></div>
                    <div className="nutritionRow"><div className="indent">Dietary Fiber {Math.round(props.nutrition.totalNutrients.FIBTG.quantity)}</div><div className="percent">{Math.round(props.nutrition.totalDaily.FIBTG.quantity)}%</div></div>
                    <div className="nutritionRow"><div className="indent">Total Sugars {Math.round(props.nutrition.totalNutrients.SUGAR.quantity)}</div></div>
                <div className="nutritionRow"><div className="miniTitle">Protein</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.PROCNT.quantity)}g</div> <div className="percent">{Math.round(props.nutrition.totalDaily.PROCNT.quantity)}%</div></div>

                <div className="thickHorizontalBar"></div>
                
                {/*A C D E K Iron Calcium Potassium Magnesium Zinc*/}
                <div className="nutritionRow"><div className="normalTxt">Vitamin A</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.VITA_RAE.quantity)}mcg</div> <div className="percent">{Math.round(props.nutrition.totalDaily.VITA_RAE.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Vitamin C</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.VITC.quantity)}mg</div> <div className="percent">{Math.round(props.nutrition.totalDaily.VITC.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Vitamin D</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.VITD.quantity)}mcg</div> <div className="percent">{Math.round(props.nutrition.totalDaily.VITD.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Vitamin E</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.TOCPHA.quantity)}mg</div> <div className="percent">{Math.round(props.nutrition.totalDaily.TOCPHA.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Vitamin K</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.VITK1.quantity)}mcg</div> <div className="percent">{Math.round(props.nutrition.totalDaily.VITK1.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Iron</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.FE.quantity)}mg</div> <div className="percent">{Math.round(props.nutrition.totalDaily.FE.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Calcium</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.CA.quantity)}mg</div> <div className="percent">{Math.round(props.nutrition.totalDaily.CA.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Potassium</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.K.quantity)}mg</div> <div className="percent">{Math.round(props.nutrition.totalDaily.K.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Magnesium</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.MG.quantity)}mg</div> <div className="percent">{Math.round(props.nutrition.totalDaily.MG.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Zinc</div> <div className="quantity">{Math.round(props.nutrition.totalNutrients.ZN.quantity)}mg</div> <div className="percent">{Math.round(props.nutrition.totalDaily.ZN.quantity)}%</div></div>

                
                <div id="edamamAttributionContainer"><a href="http://developer.edamam.com" target="_blank" id="edamamAttributionLink">Powered By <img id="edamamAttribution" src={EdamamAttribution} /></a></div>
            </div>
        </div>
    );
}