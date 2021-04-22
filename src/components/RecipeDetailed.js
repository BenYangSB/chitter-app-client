import React, { useState, useEffect } from 'react';
import List from './Lst';
import { getCurrUserKey } from './localStorageFunctions';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import Comment from './create-comment';
import EdamamAttribution from '../assets/edamamBadge.png';
import { set } from 'mongoose';

const RecipeDetailed = (props) => {

    const params = useParams(); // used to get the id from the url
    const [recipe, setRecipe] = useState(null);
    const [rating, setRating] = useState(1);
    const [nutrition, setNutrition] = useState(null);

    useEffect(() => {
        console.log(params.id)
        getRecipeAndNutritionInfo();
    }, []);

    const getRecipeAndNutritionInfo = () => {
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
                // already have nutrition data in database, so look in database
                if (nutritionEtagAndId && nutritionEtagAndId.etag && nutritionEtagAndId.id) {
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
                            if (nutriResponse.data.alreadyInDatabase) {  // should not happen
                                axios.get('http://localhost:5000/nutrition/db/recipe/' + nutritionEtagAndId.id)
                                    .then(nutriResponse => {
                                        setNutrition(nutriResponse.data);
                                        console.log("found nutri data in database")
                                    })
                                    .catch(err => console.log(err))
                            }
                            else if (nutriResponse.data.recipeQualityTooLow) {
                                recipeBody.servings = null;
                                // console.log("2?")
                                axios.post('http://localhost:5000/nutrition/api/recipe', recipeBody, { params: { etag: etag } })
                                    .then(nutriResponse2 => {
                                        if (!nutriResponse2.alreadyInDatabase && !nutriResponse2.recipeQualityTooLow && nutriResponse.data.etag) {
                                            setNutrition(nutriResponse2.data);
                                            console.log("2: " + nutriResponse2.data);
                                            saveNutriDataToDB(nutriResponse2, response.data);
                                        }
                                        else if (nutriResponse2.data.recipeQualityTooLow && (response.data.ingredients.length == 1 || response.data.ingredients.length == 2)) {
                                            // console.log("3?");
                                            let ingredients = response.data.ingredients.join(" AND ");
                                            axios.get('http://localhost:5000/nutrition/api/item', { params: { ingredients: response.data.ingredients[0], etag: etag } })
                                                .then(nutriResponse3 => {
                                                    if (!nutriResponse3.alreadyInDatabase && !nutriResponse3.recipeQualityTooLow) {
                                                        setNutrition(nutriResponse3.data);
                                                        console.log("3: " + nutriResponse3.data);
                                                        saveNutriDataToDB(nutriResponse3, response.data);
                                                    }
                                                })
                                        }
                                    })
                                    .catch(err => {
                                        console.log("error: " + err);
                                    })
                            }
                            else {
                                setNutrition(nutriResponse.data);
                                console.log("got nutri data from api")
                                // add etag to exercise
                                console.log("1: " + nutriResponse.data);
                                saveNutriDataToDB(nutriResponse, response.data);
                            }

                            // console.log("Finished API Post Request")
                        })
                        .catch(err => console.log("Error: " + err))
                }

            })
            .catch(err => console.log("Error: " + err));
    }

    const saveNutriDataToDB = (nutriResponse, recipeData) => {
        const updatedRecipe = {
            username: recipeData.username,
            userKey: recipeData.userKey,
            description: recipeData.description,
            duration: recipeData.duration,
            date: recipeData.date,
            ingredients: recipeData.ingredients,
            image: recipeData.image,
            instructions: recipeData.instructions,
            servings: recipeData.servings,
            totalRating: recipeData.totalRating,
            numRatings: recipeData.numRatings,
            nutritionEtagAndId: { etag: nutriResponse.data.etag, id: nutriResponse.data.id }
        }
        console.log("Updated recipe nutritionEtagAndId: " + updatedRecipe.nutritionEtagAndId.etag + " | " + updatedRecipe.nutritionEtagAndId.id)
        axios.post('http://localhost:5000/exercises/update/' + recipeData._id, updatedRecipe)
            .then(response => { console.log("Successful update to db of nutri data") })
            .catch(err => console.log('Error: ' + err))
    }

    const deleteExercise = (id) => {
        axios.delete('http://localhost:5000/exercises/' + id)
            .then(response => { console.log(response.data) });
    };
    // 607e18d1307c5e07a81d7367
    // urn:rsg2:G3Cm4RfX5N8U2qNb790y:46505933363eb38ee189a242043f1c29

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
    const [nutrition, setNutrition] = useState(props.nutrition);

    return (

        <div className="nutritionCard">
            {console.log("nutrition is: " + typeof(nutrition.yield) + nutrition.yield)}
            {console.log(nutrition)}
            <div className="nutritionTitle">Nutrition Facts</div>

            <div className="servings">{nutrition.yield} servings</div>
            <div className="servingSize"><div className="servingSizeTxt">Serving size</div><div className="servingSizeQ">({Math.round(nutrition.totalWeight / nutrition.yield)}g)</div></div>

            <div className="thickHorizontalBar"></div>

            <div className="amntPerServing">Amount per serving</div>
            <div className="caloriesRow">
                <div className="caloriesTitle">Calories</div> <div className="caloriesQ">{Math.round(nutrition.calories / nutrition.yield)}</div>
            </div>

            <div className="dailyValContainer"><div className="dailyValue">% Daily Value</div></div>
            <div className="nutritionSubContainer">
                <div className="totalFat nutritionRow"><div className="miniTitle">Total Fat </div> <div className="quantity">{Math.round(nutrition.totalNutrients.FAT.quantity)}g</div><div className="percent">{Math.round(nutrition.totalDaily.FAT.quantity)}%</div></div>
                <div className="nutritionRow"><div className="indent">Saturated Fat {Math.round(nutrition.totalNutrients.FASAT.quantity)}g</div><div className="percent">{nutrition.totalDaily.FASAT ? Math.round(nutrition.totalDaily.FASAT.quantity) : 0}%</div></div>
                <div className="nutritionRow"><div className="indent italicize">Trans</div><div className="transFat"> Fat {nutrition.totalNutrients.FATRN ? Math.round(nutrition.totalNutrients.FATRN.quantity) : 0}g</div></div>
                <div className="nutritionRow"><div className="miniTitle">Cholesterol</div> <div className="quantity">{Math.round(nutrition.totalNutrients.CHOLE.quantity)}mg</div> <div className="percent">{Math.round(nutrition.totalDaily.CHOLE.quantity)}%</div></div>
                <div className="nutritionRow"><div className="miniTitle">Sodium</div> <div className="quantity">{Math.round(nutrition.totalNutrients.NA.quantity)}mg</div> <div className="percent">{Math.round(nutrition.totalDaily.NA.quantity)}%</div></div>
                <div className="nutritionRow"><div className="miniTitle">Total Carbohydrate</div> <div className="quantity">{Math.round(nutrition.totalNutrients.CHOCDF.quantity)}g</div> <div className="percent">{Math.round(nutrition.totalDaily.CHOCDF.quantity)}%</div></div>
                <div className="nutritionRow"><div className="indent">Dietary Fiber {Math.round(nutrition.totalNutrients.FIBTG.quantity)}</div><div className="percent">{Math.round(nutrition.totalDaily.FIBTG.quantity)}%</div></div>
                <div className="nutritionRow"><div className="indent">Total Sugars {Math.round(nutrition.totalNutrients.SUGAR.quantity)}</div></div>
                <div className="nutritionRow"><div className="miniTitle">Protein</div> <div className="quantity"> {Math.round(nutrition.totalNutrients.PROCNT.quantity)}g</div> <div className="percent">{Math.round(nutrition.totalDaily.PROCNT.quantity)}%</div></div>

                <div className="thickHorizontalBar"></div>

                {/*A C D E K Iron Calcium Potassium Magnesium Zinc*/}
                <div className="nutritionRow"><div className="normalTxt">Vitamin A</div> <div className="quantity">{Math.round(nutrition.totalNutrients.VITA_RAE.quantity)}mcg</div> <div className="percent">{Math.round(nutrition.totalDaily.VITA_RAE.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Vitamin C</div> <div className="quantity">{Math.round(nutrition.totalNutrients.VITC.quantity)}mg</div> <div className="percent">{Math.round(nutrition.totalDaily.VITC.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Vitamin D</div> <div className="quantity">{Math.round(nutrition.totalNutrients.VITD.quantity)}mcg</div> <div className="percent">{Math.round(nutrition.totalDaily.VITD.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Vitamin E</div> <div className="quantity">{Math.round(nutrition.totalNutrients.TOCPHA.quantity)}mg</div> <div className="percent">{Math.round(nutrition.totalDaily.TOCPHA.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Vitamin K</div> <div className="quantity">{Math.round(nutrition.totalNutrients.VITK1.quantity)}mcg</div> <div className="percent">{Math.round(nutrition.totalDaily.VITK1.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Iron</div> <div className="quantity">{Math.round(nutrition.totalNutrients.FE.quantity)}mg</div> <div className="percent">{Math.round(nutrition.totalDaily.FE.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Calcium</div> <div className="quantity">{Math.round(nutrition.totalNutrients.CA.quantity)}mg</div> <div className="percent">{Math.round(nutrition.totalDaily.CA.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Potassium</div> <div className="quantity">{Math.round(nutrition.totalNutrients.K.quantity)}mg</div> <div className="percent">{Math.round(nutrition.totalDaily.K.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Magnesium</div> <div className="quantity">{Math.round(nutrition.totalNutrients.MG.quantity)}mg</div> <div className="percent">{Math.round(nutrition.totalDaily.MG.quantity)}%</div></div>
                <div className="nutritionRow"><div className="normalTxt">Zinc</div> <div className="quantity">{Math.round(nutrition.totalNutrients.ZN.quantity)}mg</div> <div className="percent">{Math.round(nutrition.totalDaily.ZN.quantity)}%</div></div>

                <div className="nutritionRow" id="nutriFootnote">
                    <div id="asterik">*</div>
                    <div id="footnoteTxt">The Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</div>
                </div>

                <div id="edamamAttributionContainer"><a href="http://developer.edamam.com" target="_blank" id="edamamAttributionLink">Powered By <img id="edamamAttribution" src={EdamamAttribution} /></a></div>
            </div>
        </div>
    );
}