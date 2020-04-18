
import React from 'react';
import {InputGroup } from "@blueprintjs/core";
import classnames from 'classnames';
import Loader from "../loader"; 

const PostFooter = (props) => {

  function commentBox(commentId){
    document.getElementById(commentId).focus();
  }
  const { commentLoading } = props;

  const {onCommentInputChange,onLike, postComment,liked,commentText,postId,userInfo } = props;
    return(
        <div>
                    <div className="footer extra d-flex content-between">
                      <div>
                      <button
                       onClick={onLike}
                       className={classnames('bp3-button bp3-minimal ico bp3-icon-heart',
                                  liked ? ' liked' : '')}
                      ></button>
                      <button className="bp3-button bp3-minimal ico bp3-icon-comment" onClick={() => commentBox(postId)}></button>
                      </div>
                      <div>
                      {/* <button className="bp3-button bp3-minimal ico bp3-icon-social-media"></button> */}
                      </div>
                    </div>
                      <br/>
                    <div className="footer d-flex content-between">
                      <div>
                      <img className="header-avatar" alt="img" src={userInfo?.photoURL} />
                      </div>
                      <div className="input-wrapper">
                      <InputGroup
                        id={postId}
                        placeholder="Enter text here..."
                        value={commentText}
                        round={true}
                        onChange={onCommentInputChange}
                        onKeyPress={postComment}
                        />
                          { commentLoading ? <Loader size={13}/>  : ''}
                      </div>
                    </div>
                    </div>
    );
}

export default PostFooter;