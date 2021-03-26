import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav id = "navBAR"className="navbar navbar-expand-lg navbar-dark bg-blue">
        <Link to="/" className="navbar-brand">Chitter</Link>

        {this.props.isSignedIn && 
          <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
            <Link to="/user/recipies" className="nav-link">My Recipies</Link>
            </li>
            <li className="navbar-item">
            <Link to="/create" className="nav-link">Create new Recipe</Link>
            </li>
            <li className="navbar-item">
            <Link to="/user/discover" className="nav-link">Discover Other Chefs</Link>
            </li>
            <li className="navbar-item">
            <Link to="/user/trending" className="nav-link">Trending</Link>
            </li>
            <li className="navbar-item">
            <Link to= {"/user/profile/" + this.props.userKey } className="nav-link">My profile</Link>
            </li>
            <li className="navbar-item">
            <Link to= {"/feed"} className="nav-link">My Feed</Link>
            </li>
          </ul>
          </div>
        }

      </nav>
    );
  }
}