
import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import StarRatingComponent from 'react-star-rating-component';

class Comment extends React.Component {

  constructor(props){
      super(props);
  }

  state = {
    currentUser: null,
    isSignedIn: false,
    rating: "NA",
    comment: "nice recipe!",
  }

  
  

  componentDidMount = () => {
   
  }

onChangeComment = (e) => {
    this.setState({
        comment: e.target.value
    })
}

onStarClick = (nextValue, prevValue, name) => {
    console.log("HERE");
    this.setState({
        rating: nextValue
    })
}


  render() {
    return (

      
        <div>
        <div class="card" id = "newcomment">
                    <div>
                        <h2>Your Rating: {this.state.rating} stars</h2>
                        <StarRatingComponent
                            name="rate1"
                            starCount={10}
                            value={this.state.rating}
                            onStarClick={this.onStarClick}
                        />

                        <button class = "rateBtn" onClick={()=>this.props.onButtonClick(this.state.rating)}>&#10003;</button>
                    </div>

                    <div className="editeRecipeForm">
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Comment:</label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.comment}
                            onChange={this.onChangeComment}
                        />
                    </div>
                   
                </form>


            </div>

        </div>
        <div className="space"></div>
        <div className="space"></div>


        </div>




    );
  }
}

export default Comment;