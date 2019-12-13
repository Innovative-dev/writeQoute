import React from 'react';
import { NavLink } from 'react-router-dom';
import LogOut from '../components/auth/logout';
import { withRouter } from 'react-router-dom';


class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  addQoute = () => {
    if(this.props.authenticated) {
      this.props.history.push('/add-qoute')
    } else {
      alert("Please login to write qoute.");
    }
  }

  render(){
    const userinfo = this.props.userInfo ? this.props.userInfo : '';
    const username = userinfo.username ? userinfo.username : '';
    const photoURL = userinfo.photoURL ? userinfo.photoURL : '';
    
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand">
          <i className="fa fa-book" ></i>
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <NavLink className="nav-link" to='/home'>Home</NavLink>
            </li>
            <li className="nav-item">
              <a className="nav-link">Explore</a>
            </li>
            <li className="nav-item px-3" data-toggle="modal">
              <a className="nav-link" onClick={this.addQoute}>
                <svg height="34px" viewBox="0 0 512 512" width="34px" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink"><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="256" x2="256" y1="0" y2="512"><stop offset="0" stopColor="#2af598" /><stop offset="1" stopColor="#009efd" /></linearGradient><path d="m437.019531 74.980469c-48.351562-48.351563-112.640625-74.980469-181.019531-74.980469s-132.667969 26.628906-181.019531 74.980469c-48.351563 48.351562-74.980469 112.640625-74.980469 181.019531s26.628906 132.667969 74.980469 181.019531c48.351562 48.351563 112.640625 74.980469 181.019531 74.980469s132.667969-26.628906 181.019531-74.980469c48.351563-48.351562 74.980469-112.640625 74.980469-181.019531s-26.628906-132.667969-74.980469-181.019531zm-181.019531 397.019531c-119.101562 0-216-96.898438-216-216s96.898438-216 216-216 216 96.898438 216 216-96.898438 216-216 216zm20-236.019531h90v40h-90v90h-40v-90h-90v-40h90v-90h40zm0 0" fill="url(#a)" /></svg>
              </a>
            </li>
            {this.props.authenticated ?
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <img className="header-avatar" src={photoURL ? photoURL : 'https://wowsciencecamp.org/wp-content/uploads/2018/07/dummy-user-img-1.png'} />
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                {username ? 
                  <a className="dropdown-item">{username}</a>
                  : '' }

                  <a className="dropdown-item">Set Preference</a>
                  <div className="dropdown-divider"></div>
                  <LogOut history={this.props.history} />
                </div>
              </li>
              :
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">Login</NavLink>
              </li>
            }
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
    );
  };
}

export default withRouter(Header);
