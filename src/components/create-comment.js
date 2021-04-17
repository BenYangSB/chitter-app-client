
import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import StarRatingComponent from 'react-star-rating-component';
import firebase from 'firebase';

class Comment extends React.Component {

    constructor(props) {
        super(props);
        const currentUser = firebase.auth().currentUser;
        this.state = {
            currentUser: null,
            username : currentUser.displayName,
            userKey : currentUser.uid,
            isSignedIn: false,
            rating: "NA",
            comment: "nice recipe!",
            comments: []
        }
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
    handleTab = (event) => {
        if (event.key === 'Tab' && !event.shiftKey) {  // key clicked was tab
            event.preventDefault();

            document.execCommand('insertText', false, "\t");

            return false;
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        const commentObj = {    // prbly will save other stuff
            text: this.state.comment,
            username: this.state.username,
            userKey: this.state.userKey
        };
        let newComments = this.state.comments;
        newComments.push(commentObj);
        this.setState({
            comments: newComments
        })

    }


    render() {
        return (


            <div>
                <div class="card" id="newcomment">
                    <div>
                        <h2>Your Rating: {this.state.rating} stars</h2>
                        <StarRatingComponent
                            name="rate1"
                            starCount={10}
                            value={this.state.rating}
                            onStarClick={this.onStarClick}
                        />

                        <button class="rateBtn" onClick={() => this.props.onButtonClick(this.state.rating)}>&#10003;</button>
                    </div>

                    <div className="editeRecipeForm">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Comment:</label>
                                <textarea
                                    required
                                    className="form-control"
                                    value={this.state.comment}
                                    onChange={this.onChangeComment}
                                    onKeyDown={this.handleTab}
                                />
                            </div>
                            <input type="submit" value="Submit!" id="submitBtn" />
                        </form>


                    </div>

                </div>
                {this.state.comments && this.state.comments.map(comment => {
                    return (<div className="comment">
                        <div className="commentPoster">{comment.username}</div>
                        <br/>
                        <div className="commentText">{comment.text}</div>
                    </div>)
                })}
                <div className="space"></div>
                <div className="space"></div>


            </div>




        );
    }
}

export default Comment;