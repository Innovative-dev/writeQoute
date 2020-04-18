
import React from 'react';
import {Card, Elevation,InputGroup } from "@blueprintjs/core";

import userDefaultImg from '../../assets/img/user-default.png';

const PostComments = (props) =>{
    const { comment,removeComment,loading } =props
    return(
                <div className="comment-list">
                <header>
                  <div> 
                    <img className="header-avatar" alt="img" src={comment?.photoURL ? comment.photoURL : userDefaultImg } />
                  </div>

                  <div>
                <h4><a>{comment?.username}</a> <small>{comment?.comment}</small></h4>  
                <small>At {comment.commentDate}</small>
                
                      <button className="bp3-button bp3-minimal remove-btn  bp3-intent-danger" 
                        onClick={removeComment}>{loading == comment.commentId ? 'Removing' : 'Remove' } </button>
                
                  </div>

              </header>
              </div>
    );
}
export default PostComments;