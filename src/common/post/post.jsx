import React from 'react';
import userDefaultImg from '../../assets/img/user-default.png';

const Post = (props) =>{
      const {postData,showLikes,showComments} = props;
  return(
        <div>
              <header>
                  <div> 
                    <img className="header-avatar" alt="img" src={postData?.photoURL ? postData.photoURL : userDefaultImg } />
                  </div>

                  <div>
                  <h4><a>{postData?.username}</a></h4>
  <small>{postData?.postDate}</small>
                  </div>
              </header>
              <pre className="text-wrapper d-flex" style={postData?.Style}>{postData?.postText.replace(/-/g, ' ')}</pre>
                <div className="content">
                  <pre className="text-caption">{postData?.captionText}</pre>
                  {postData?.tags ? 
                    <div className="tags">
                      {postData.tags.map((tag,index) => (
                        <a key={index}>#{tag.label}</a>
                      ))
                      }
                    </div>
                    : '' }  
                    <hr/>
                    <div className="d-flex content-between">
                      <div>
                      <button className="bp3-button text bp3-minimal" onClick={showLikes}>{postData?.likes ? Object.values(postData.likes).length + '  ' : '0 '}  Likes</button>
                      </div>
                      <div>
                      <button className="bp3-button text bp3-minimal" onClick={showComments}>{postData?.comments ? Object.values(postData.comments).length + '  ' : '0 '} comments</button>
                      {/* <button className="bp3-button text bp3-minimal">100 share</button> */}
                      </div>
                    </div>
                    <hr/>
                </div>
                </div>
    );
}

export default Post;