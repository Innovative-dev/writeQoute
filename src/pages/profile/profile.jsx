import React from 'react';
import * as firebase from "firebase";
import { Card, Elevation } from "@blueprintjs/core";
import SidebarTags from '../../common/sidebar-tages';
import ProfileHeader from './profile-header';
import Post from '../../common/post/post';
import Loader from "../../common/loader";

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken: null,
      userInfo:{},
      allPost:[],
      loading:true,
      postCount:0
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((authenticated) => {
      if(authenticated){
        let authToken =firebase.auth().currentUser.uid;
          if (authToken) {
            this.setState({ authToken: authToken},()=>{
              this.getData();
            });
          }
      } 
    });
  }

  getData(){
    let uid = this.state.authToken;
    this.getUserInfo(uid);
    this.getAllPost(uid);
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
    allPost.once("value").then(data => {
      data.forEach(function (childSnapshot) {
        let childData = childSnapshot.val();
        childData.postId = childSnapshot.key;
        if(childData.uid == self.state.authToken){
          postAll.push(childData);
        }
        
      })
    }).then(() => {
      this.setState({ allPost: postAll, loading: false},()=>{
          this.setPostCountVal();
      });
    }).catch(err => {
      console.log("error" + err);
      this.setState({ loading: false });
    });
  }

  setPostCountVal(){
    if(this.state.allPost && this.state.allPost.length){
      this.setState({postCount: this.state.allPost.length});
    }
  }


  render() {
    const { allPost,loading,postCount,userInfo } =this.state;
    return(
      <main className="main-wrapper">
      <div className="container">
        <div className="row">
        <div className="col-md-4">
          <SidebarTags/>
        </div>
        <div className="col-md-7">


        <br/>
        <ProfileHeader userInfo={userInfo} postCount = {postCount}/>
        <br/>
        {loading ? 
           <div className="no-data-found-div">
           <Loader size={30} border={4}/>
           </div>
          :<div>
        {allPost && allPost.length ? <div>
        {allPost.map(post => (
            <Card
              key={post.postId}
              className="card post-card"
              interactive={true}
              elevation={Elevation.ONE}
            >
            <Post postData={post}/>
            </Card>
        ))}
        </div> : 
          <div className="no-data-found-div d-flex">
          <div> 
            <h3 className="text-secodary">  Nothing  Found  </h3>
          </div>
        </div> 
      }
      </div> }
        </div>
      </div>
      </div>
    </main>
    );
  }
}
export default EditProfile;  
