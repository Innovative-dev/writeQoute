
import React from 'react';
import {Card, Elevation,Icon } from "@blueprintjs/core";

import userDefaultImg from '../../assets/img/user-default.png';

const PostLikes = (props) =>{
    const { likes } =props
    console.log("likess"+JSON.stringify(likes));
    return(
                <div className="comment-list">
                <header>
                  <div> 
                    <img className="header-avatar" alt="img" src={likes?.photoURL ? likes.photoURL : userDefaultImg } />
                  </div>
                  <div>
                <h4><a>{likes?.username}</a> </h4>   
                      <span className="bp3-icon bp3-icon-heart bp3-intent-danger" ></span>
                  </div>

              </header>
              </div>
    );
}

export default PostLikes;