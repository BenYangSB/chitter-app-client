import React, { Component } from 'react';


class Lst extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>

                {this.props.ingList.length > 0 && this.props.ingList[0] != '' &&
                    <div>
                    <h className="ingredientTitle">Ingredients</h>
                    {this.props.ingList.map(ing => {
                        if (ing != '')
                            return <li className="ingredient">{ing}</li>
                    })}
                    </div>
                }
            </div>
        );
    }
};

export default Lst;