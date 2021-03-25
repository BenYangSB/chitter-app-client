import React, { Component } from 'react';


class Lst extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>

                <h>Ingredients</h>
                {
                    this.props.ingList.map(ing => {
                        return <li>{ing}</li>
                    })
                }
            </div>
        );
    }
};

export default Lst;