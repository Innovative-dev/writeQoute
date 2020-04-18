import React from "react";
import { Card, Elevation } from "@blueprintjs/core";
import HomeAside from "./home-aside";
import SidebarTags from "../../common/sidebar-tages";
import Post from "../../common/post/post";
import PostComments from "../../common/post/post-comments";
import PostLikes from "../../common/post/post-likes";
import PostFooter from "../../common/post/post-footer";
import Loader from "../../common/loader";
import * as firebase from "firebase";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allPost: [],
      userInfo:{},
      loading: true,
      error: false,
      likeActiveClass: true,
      comments: [],
      showComments: false,
      showLikes: false,
      commentText: "",
      usersList: [],
      isOpen: false,
      authenticated: false,
      authToken:'',
      commentLoading:'',
      postCount:0,
    };
  }

  componentDidMount() {
    this.getAllPost();
    firebase.auth().onAuthStateChanged((authenticated) => {
      if(authenticated){
        this.setState({authenticated: true});
        let authToken =firebase.auth().currentUser.uid;
        if (authToken) {
          this.setState({ authToken: authToken});
          this.getUserInfo(authToken);
        }
      } else {
        this.setState({authenticated: false});
      }
    });
  }
  getUserInfo(uid){
    firebase.database().ref(`users/${uid}`).once("value").then(data => {
          this.setState({userInfo: data.val()})
      })
  }
  getAllPost() {
    let allPost = firebase.database().ref("all-post");
    let postAll = [];
    var self = this;
    let count = 0;
    allPost.once("value").then(data => {
      data.forEach(function (childSnapshot) {
        let childData = childSnapshot.val();
        childData.postId = childSnapshot.key;
        if(childData.uid == self.state.authToken){
          count = + 1;
        }
        postAll.push(childData);
      })
    }).then(() => {
      this.setState({ allPost: postAll, loading: false, postCount: count });
    }).catch(err => {
      console.log("error" + err);
      this.setState({ loading: false });
    });
  }


  openComments = postId => {
    if (this.state.showComments === postId) {
      this.setState({ showComments: "" });
    } else {
      this.setState({ showComments: postId });
    }
    this.setState({ showLikes: "" });
  };
  openLikes = postId => {
    if (this.state.showLikes === postId) {
      this.setState({ showLikes: "" });
    } else {
      this.setState({ showLikes: postId });
    }
    this.setState({ showComments: "" });
  };
  showComments = (comments,postId) => {
    let commentlist = Object.values(comments);
    let listKey = Object.keys(comments);
    let finalArray = [];
    let requests = commentlist.forEach((item, index) => {
      item.commentId = listKey[index];
      let uid = item.userId;
    });
    return commentlist.map(comment => 
          <PostComments key={comment.commentId} comment={comment} 
                        loading ={this.state.commentLoading}
           removeComment={() => this.removeComment(comment.commentId,postId)} />);
  };

  showLikes = (Likes) => {
    let likeList = Object.values(Likes);
    return likeList.map(likes => <PostLikes key={likes.like} likes={likes}  />);
  };

  onCommentInputChange = (event) => {
    this.setState({ commentText: event.target.value })
  }
  addCommentOnEnter(event, postId) {
    var code = event.keyCode || event.which;
    if (code === 13) { //13 is the enter keycode
      if (this.state.commentText) {
        this.addCommentToPost(postId);
      } else {
        alert('Please write some text first!');
      }
    }
  }
  addCommentToPost(postId) {
    if (!this.state.authenticated) {
      alert('Please login first');
      return;
    } 
    let userId = this.state.authToken;
    let postComments = firebase.database().ref(`all-post/${postId}/comments`);
    var today = new Date();
    var date = today.toGMTString().substr(5,11);
    var time = today.toTimeString().substr(0,8);
    var time12H = new Date('2020-01-01T' + time + 'Z')
    .toLocaleTimeString({},
      {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
    );  
    let commentDate = date + ', ' + time12H;
    let username = this.state.userInfo?.username ? this.state.userInfo.username : '';
    let photoURL = this.state.userInfo?.photoURL ? this.state.userInfo.photoURL : "https://image.flaticon.com/icons/svg/149/149071.svg";
    let body = {
      userId: userId,
      comment: this.state.commentText,
      commentDate: commentDate,
      username: username,
      photoURL: photoURL
    }
    this.setState({commentLoading: postId});
    postComments.push().set(body).then(() => {
      this.setState({commentText: '', commentLoading: ''});
      this.getAllPost();
    }).catch((error) => {
      console.log("Something went wrong !");
      this.setState({commentLoading: ''});
    })
  }

  removeComment = (commentId,postId) =>  {
      let comments = firebase.database().ref(`all-post/${postId}/comments/${commentId}`); 
      this.setState({commentLoading: commentId});
      comments.remove().then(() => {
        this.getAllPost();
      }).catch(() => {
        this.setState({commentLoading: ''});
        alert("Something is wrong !");
      });
  }

  checkPostLike = (item, userId) => {
    if (item) {
      var list = Object.values(item);
      if (list.find(x => x.like === userId)) {
        return true;
      } else { return false; };
    } else {
      return false;
    }
  }

  likePost(postId,liked) {
    if (!this.state.authenticated) {
      alert('Please login first');
      return;
    }
    let userId = this.state.authToken;
    let postLikes = firebase.database().ref(`all-post/${postId}/likes/${userId}`);
    if(!liked){
    let username = this.state.userInfo?.username ? this.state.userInfo.username : '';
    let photoURL = this.state.userInfo?.photoURL ? this.state.userInfo.photoURL : "https://image.flaticon.com/icons/svg/149/149071.svg";
    let body = { like: userId,
                 username: username,
                  photoURL:photoURL
                }
    postLikes.set(body).then(() => {
      this.getAllPost();
    }).catch((error) => {
      console.log("something is wrong !" );
    })
  } else{
    postLikes.remove().then(() => {
      this.getAllPost();
    }).catch((error) => {
      console.log("something is wrong !" + error);
    });
  }
  }

  render() {
    const { allPost,userInfo,authToken,commentLoading, showComments,showLikes,commentText,loading,postCount } = this.state;
    return (
      <main className="main-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4">
              <HomeAside userInfo={userInfo} postCount={postCount} />
              <br />
              <SidebarTags /> 
              <br />
            </div>
            {loading ? 
                <div className="col-lg-7 col-md-8 no-data-found-div">
                    <Loader size={30} border={4}/>
                </div> :
            <div className="col-lg-7 col-md-8">
              {!allPost.length ? (
                <div className="no-data-found-div d-flex">
                <div> 
                  <h3 className="text-secodary">  No Data Found  </h3>
                </div>
              </div> 
              ) : (
                <div>
                  {allPost.map(post => (
                    <Card
                      key={post.postId}
                      className="card post-card"
                      interactive={true}
                      elevation={Elevation.ONE}
                    >
                      <Post
                        postData={post}
                        showComments={() => this.openComments(post.postId)}
                        showLikes = {() => this.openLikes(post.postId)}
                      />
                      <PostFooter 
                        onLike={() => this.likePost(post.postId, this.checkPostLike(post.likes, authToken))}
                        commentText ={commentText}
                        userInfo={userInfo}
                        postId={post.postId}
                        onCommentInputChange={this.onCommentInputChange}
                        commentLoading = {commentLoading}
                        liked = {this.checkPostLike(post.likes, authToken)}
                        postComment={(event) => this.addCommentOnEnter(event, post.postId)}
                      />

                      {showComments === post.postId ? (
                        <div
                          className="comment-list"
                          style={
                            showComments === post.postId
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          {post.comments ? (
                            <div>
                              {this.showComments(
                                post.comments,post.postId
                              )}
                            </div>
                          ) : (
                            <div className="no-data-found-div d-flex sm">
                            <div> 
                              <h4 className="text-secodary">No comments yet !</h4>
                            </div>
                          </div> 
                          )}
                        </div>
                      ) : (
                        ""
                      )}

                       {showLikes === post.postId  ? (
                        <div
                          className="comment-list"
                          style={
                            showLikes === post.postId
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          {post.likes ? (
                            <div>
                              {this.showLikes(
                                post.likes
                              )}
                            </div>
                          ) : (
                             <div className="no-data-found-div d-flex sm">
                             <div> 
                               <h4 className="text-secodary">No likes yet !</h4>
                             </div>
                           </div> 
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div> }
          </div>
        </div>
      </main>
    );
  }
}
export default Home;
