
import React from 'react';
import { Container, Row, Card, Col } from 'reactstrap';
import * as firebase from 'firebase';
import FeatherIcon from 'feather-icons-react';
import { __esModule } from 'feather-icons-react/build/IconInner';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allPost: [],
      commentsList: false,
      loading: true,
      error: false,
      likeActiveClass: true,
      showComments: '',
      commentText: '',
      usersList: []
    }

  }



  componentDidMount() {
      this.getAllPost();
  }
  getAllPost(){
    let allPost = firebase.database().ref("all-post");
    let postAll = [];
    allPost.once("value").then(data => {
      data.forEach(function (childSnapshot) {
        let childData = childSnapshot.val();
        console.log("childData" + JSON.stringify(childData))
        childData.postId = childSnapshot.key;
        postAll.push(childData);
      })
    }).then(() => {
      this.setState({ allPost: postAll });
      this.setState({ loading: false });
      console.log(this.state.allPost, this.state.allPost.length);
      console.log("isAuthed = = + " + JSON.stringify(this.props.userInfo));
    }).catch(err => {
      console.log("error" + err);
      this.setState({ loading: false });
      this.setState({ loading: true });
    });
  }

  openComments = (postId) => {
      if(this.state.showComments === postId){
        this.setState({ showComments: '' });
      } else{
        this.setState({ showComments: postId });
      }
  }
  showComments = (comments,postId )=> {
    let list = Object.values(comments);
    let listKey = Object.keys(comments);
    list.map( (item,index) => {
        item.key=listKey[index];
    })
    
      return(
        list.map((item) =>
          <div className="row m-0 mt-3 comment-box" key={item.key}>
            <div className="col-1 p-0 ">
              <img className="header-avatar" alt="img" src={item.photoURL ? item.photoURL : ''} alt='user img' />
            </div>
            <div className="col-11 p-0">
              <small><a className="font-weight-bold mr-2">{item.username ? item.username : ''}</a>
                <span>{item.comment ? item.comment : ''}</span>
              </small>
              <div className="d-flex">
                <a className="text-secondary mr-1"><FeatherIcon icon="calendar" size="13" /></a>
                <small className="text-muted" style={{'margin-top': '2px'}}>{item.date}, {item.time}</small>
                <a className="text-danger cursor-pointer ml-1" onClick={()=>this.deleteComment(postId,item.key)}>
                  <FeatherIcon icon="trash-2" size="13" /></a>
              </div>
            </div>
          </div>
        )
      );
  }
  deleteComment(postId,commentId){
    console.log("postId ="+postId+" commentId="+commentId);

    let comments = firebase.database().ref(`all-post/${postId}/comments/${commentId}`);
    comments.remove().then(() => {
      this.getAllPost();
    }).catch(() => {
      alert("Something is wrong !");
    });
  }

  onCommentInputChange = (event) => {
    this.setState({ commentText: event.target.value })
  }

  focusOnComment() {
    this.setState({ focusOnComment: true })
  }
  addCommentToPostEnter(event, postId, userId, photoURL, username) {
    var code = event.keyCode || event.which;
    if (code === 13) { //13 is the enter keycode
      if (this.state.commentText) {
        this.addCommentToPost(postId, userId, photoURL, username);
      } else {
        alert('Please write some text first!');
      }
    }
  }

  addCommentToPost(postId, userId, photoURL, username) {
    if (!this.props.userInfo) {
      alert('Please login first');
      return;
    }
    let postComments = firebase.database().ref(`all-post/${postId}/comments`);
    let date = (new Date()).toString().split(' ').splice(1,3).join(' ');
    let time = new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();
    let body = {
      userId: userId,
      comment: this.state.commentText,
      photoURL: photoURL,
      username: username,
      date: date,
      time: time,
    }
    postComments.push().set(body).then(() => {
      this.setState({ commentText: '' });
      alert('comment is added please refresh to see your comments!');
      document.getElementById('commentBox').value = '';
      this.getAllPost();
    }).catch((error) => {
      alert('something is wrong !');
    })
  }


  likePost(postId, userId, photoURL, username,liked) {
    if (!this.props.userInfo) {
      alert('Please login first');
      return;
    }
    
    let postLikes = firebase.database().ref(`all-post/${postId}/likes/${userId}`);
    if(!liked){
    let body = {
      like: userId,
      photoURL: photoURL,
      username: username,
    }
    postLikes.set(body).then(() => {
      console.log("done");
      this.getAllPost();
    }).catch((error) => {
      console.log("something is wrong !" + error);
    })
  } else{
    
    postLikes.remove().then(() => {
      this.getAllPost();
    }).catch((error) => {
      console.log("something is wrong !" + error);
    });
  }
  }

  retunDate = (date, time) => {
    var today = new Date();
    var currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (currentDate === date) { //if same day
      let splitFetchTime = time.split(':');
      let splitCurrTime = currentTime.split(':');
      if (splitFetchTime[0] === splitCurrTime[0]) { //if hour equal

        if (splitFetchTime[1] === splitCurrTime[1]) { //if min equal

          if (splitFetchTime[2] === splitCurrTime[2]) { //if sec equal
            return 'Just now';
          } else {
            let val = splitCurrTime[2] - splitFetchTime[2];
            return Math.abs(val) + ' second ago';
          }
        }
        else {//if min not equal
          let val = splitCurrTime[1] - splitFetchTime[1];
          return Math.abs(val) + ' min ago';
        } //min
      } else { //if hour not equal
        let val = splitCurrTime[0] - splitFetchTime[0];
        return Math.abs(val) + ' hour ago';
      } //hour 
    } else { //if date are not same
      let splitFetchDate = date.split('-');
      let splitCurrDate = currentDate.split('-');
      if (splitFetchDate[0] === splitCurrDate[0]) { //if year equal

        if (splitFetchDate[1] === splitCurrDate[1]) { //if month equal

          let val = splitCurrDate[2] - splitFetchDate[2];
          let day = val > 1 ? ' days' : 'day';
          return Math.abs(val) + day + ' ago';

        }
        else {//if month not equal
          let val = splitCurrDate[1] - splitFetchDate[1];
          let month = val > 1 ? 'months' : 'month';
          return 'Before ' + Math.abs(val) + month + ' ago';
        } //month
      } else { //if year not equal
        let val = splitCurrDate[0] - splitFetchDate[0];
        return 'Before ' + Math.abs(val) + ' year';
      } //year
    }
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

  getuser() {
    let allPost = firebase.database().ref("users/iTpG6pqJvtaqQtfLStaDH34b2d32");

    allPost.once("value").then(data => {
      // data.forEach(function (childSnapshot) {
      // let childData = childSnapshot.val();
      // console.log("childData" + JSON.stringify(childData))
      // childData.postId = childSnapshot.key;
      // postAll.push(childData);
      // })

      console.log("getUser " + JSON.stringify(data));
    }).then(() => {
      // this.setState({ usersList: postAll });
      // this.setState({ loading: false });
      // console.log(this.state.usersList, this.state.usersList.length);
      // console.log("isAuthed = = + " + JSON.stringify(this.props.userInfo));
    }).catch(err => {
      console.log("error" + err);
      // this.setState({ loading: false });
      // this.setState({ loading: true });
    });

  }




  render() {
    const userinfo = this.props.userInfo ? this.props.userInfo : '';
    const username = userinfo.username ? userinfo.username : '';
    const photoURL = userinfo.photoURL ? userinfo.photoURL : '';
    const userId = userinfo.userId ? userinfo.userId : '';

    return (
      <Container>
        <Row className="py-5">
          <Col md="4">
            {userinfo ? <div>
              <Card className="p-2">
                <div className="d-flex px-3 py-1 my-1">
                  <div>
                    <img className="header-avatar big" alt="img" src={photoURL ? photoURL : 'https://wowsciencecamp.org/wp-content/uploads/2018/07/dummy-user-img-1.png'} />
                  </div>
                  <div className="ml-3 font-17 mt-2">
                    {username ?
                      <a className="text-primary d-block mt-1">{username}</a>
                      : ''}

                  </div>
                </div>
                <div className="d-flex px-3 py-1 my-1 justify-content-between">
                  <div className="line-h14 text-center">
                    <h5 className="font-w-600 m-0">13</h5>
                    <small>Qoutes</small>
                  </div>
                  <div className="line-h14 text-center">
                    <h5 className="font-w-600 m-0">13</h5>
                    <small>Followers</small>
                  </div>
                  <div className="line-h14 text-center">
                    <h5 className="font-w-600 m-0">13</h5>
                    <small>Following</small>
                  </div>
                </div>
              </Card>
              <br />
            </div> : ''}
            <Card className="p-3">
              <h3 className="font-w-600 mb-2">Trending Hashtags
              <FeatherIcon icon="copy" size="22" />
              </h3>
              <div className="line-h16 mb-1">
                <a className="font-18 font-w-600  text-primary d-block mt-1">Dashara</a>
                <small>123213k qoutes</small>
              </div>
              <div className="line-h16 mb-1">
                <a className="font-18 font-w-600  text-primary d-block mt-1">Cricket</a>
                <small>513k qoutes</small>
              </div>

              <div className="line-h16 mb-1">
                <a className="font-18 font-w-600  text-primary d-block mt-1">Dashara</a>
                <small>123213k qoutes</small>
              </div>
              <div className="line-h16 mb-1">
                <a className="font-18 font-w-600  text-primary d-block mt-1">Cricket</a>
                <small>513k qoutes</small>
              </div>
              <div className="line-h16 mb-1">
                <a className="font-18 font-w-600  text-primary d-block mt-1">Dashara</a>
                <small>123213k qoutes</small>
              </div>
              <div className="line-h16 mb-1">
                <a className="font-18 font-w-600  text-primary d-block mt-1">Cricket</a>
                <small>513k qoutes</small>
              </div>


            </Card>
          </Col>

          <Col md="7">
            {/* <button className="btn btn-info" onClick={() => this.getuser()}>Test user info</button> */}
            {this.state.loading ?
              <Card>
                <h4>Loading Data</h4>
              </Card>
              :
              <div>
                {this.state.error ?
                  <Card>
                    <h4>Something went wrong !</h4>
                  </Card>
                  : ''
                }
                {
                  this.state.allPost.length > 0 ?
                    <div>
                      {this.state.allPost.map((item, i) =>
                        <Card className="post-card" key={i}>
                          <div className="d-flex px-3 py-1 my-1 header">
                            <div>
                              <img className="header-avatar" src={item.photoURL} />
                            </div>
                            <div className="ml-3 line-h16">
                              <a className="text-primary d-block">{item.username}</a>
                              <small className="">{this.retunDate(item.postDate, item.postTime)}</small>
                            </div>
                          </div>
                          <pre style={item.Style} className="text-wrapper">
                            {item.postText.replace(/-/g, ' ')}
                          </pre>
                          <div className="py-2 px-3 footer">
                            <pre className="font-14 mb-1">
                              {item.captionText}
                            </pre>
                            {item.tags ?
                              <div className="tag f-w-600 font-13 mb-1">

                                {item.tags.map((tag, i) =>
                                  <span className="text-primary" key={i}>{'#' + tag.name + ' '}</span>
                                )}

                              </div>
                              : ''}
                            <hr className="my-2" />
                            <div className="d-flex justify-content-between">
                              <div>

                                {/* { item.likes ? this.checkPostLike(item.likes,userId) : ''} */}

                                <a className="font-15 mr-3"
                                  style={this.checkPostLike(item.likes, userId) ? { color: 'red' } : { color: 'gray' }}
                                  onClick={() => this.likePost(item.postId, userId, photoURL, username, this.checkPostLike(item.likes, userId))}>
                                  <FeatherIcon icon="thumbs-up" size="22" /></a>

                                <a className="text-secondary font-15 mr-3" onClick={() => { this.commentBox.focus() }}>
                                  <FeatherIcon icon="message-square" size="22" /></a>
                              </div>
                              <div>
                                <a className="text-secondary font-15 "><FeatherIcon icon="share" size="22" /></a>
                              </div>
                            </div>
                            <div className="d-flex">
                              <button className="btn btn-sm pl-0">
                                {item.likes ? Object.values(item.likes).length + '  ' : '0 '} Likes
                             </button>
                              <button className="btn btn-sm " onClick={() => this.openComments(item.postId)}>
                                {item.comments ? Object.values(item.comments).length + '  ' : '0 '}comments</button>
                            </div>
                            {this.state.showComments === item.postId ?
                              <div className="comment-list" style={this.state.showComments === item.postId ? { 'display': 'block' } : { display: 'none' }}>
                                {item.comments ?
                                  <div>
                                    {this.showComments(item.comments,item.postId )}
                                   
                                  </div>
                                  : <small className="text-center"> No comments yet !</small>
                                }


                              </div>

                              : ''}

                            <div className="row m-0 mt-3 comment-box">
                              <div className="col-1 p-0 ">
                                <img className="header-avatar" alt="img" src={photoURL ? photoURL : 'https://wowsciencecamp.org/wp-content/uploads/2018/07/dummy-user-img-1.png'} />
                              </div>
                              <div className="col-11 p-0">
                                <input className="form-control rounded w-0"
                                  id="commentBox"
                                  ref={(focus) => this.commentBox = focus}
                                  placeholder="type your comment" onChange={this.onCommentInputChange}
                                  onKeyPress={(event) => this.addCommentToPostEnter(event, item.postId, userId, photoURL, username)}
                                />
                              </div>
                            </div>

                          </div>
                        </Card>
                      )
                      }
                    </div>
                    :
                    <Card>
                      <h5>No Data Found!</h5>
                    </Card>
                }
              </div>
            }


          </Col>
        </Row>
      </Container>
    );
  }
}
export default Home;  