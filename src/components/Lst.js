import React, { Component } from 'react';


class Lst extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>

                <h className="ingredientTitle">Ingredients</h>
                {
                    this.props.ingList.map(ing => {
                        return <li className="ingredient">{ing}</li>
                    })
                }
            </div>
        );
    }
};

export default Lst;