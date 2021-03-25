import React, { Component } from 'react';
import Lst from '../components/Lst';
import { Link } from 'react-router-dom';

const Exercise = props => {
    return (
        <div class="card" id="recipe">


            <h>{props.exercise.username}</h>
            <p>Dish : {props.exercise.description}</p>
            <p>Time to make : {props.exercise.duration} minutes</p>

            <Lst ingList={props.exercise.ingredients}></Lst>

            <br></br>

            <p>{props.exercise.date.substring(0, 10)}</p>
            {
                props.exercise.userKey == props.currentKey || (props.currUser != null && props.currUser!= undefined && props.exercise.userKey == props.currUser.userKey )  &&
                <p>
                    <Link to={"/edit/" + props.exercise._id}>edit</Link> | <a href="#" onClick={() => { props.deleteExercise(props.exercise._id) }}>delete</a>
                </p>
            }

        </div>
    );

};

export default Exercise;