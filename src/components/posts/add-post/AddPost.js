import React from 'react';
// import { NavLink } from 'react-router-dom';
import { Container, Row, Card, Col } from 'reactstrap';
import { SketchPicker } from 'react-color';
import * as firebase from 'firebase'
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import Draggable from "react-draggable";

import ReactTags from 'react-tag-autocomplete';

class AddPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      postText: '',
      captionText:'',
      selectedBgImg: '',
      selectedBgColor: '',
      selectTextAligStyle: 'left',
      colors: [
        '#FFEBEE',
        '#FFCDD2',
        '#E57373',
        '#F44336',
        '#C62828',
        '#880E4F',
        '#F48FB1',
        '#EC407A',
        '#AB47BC',
        '#F3E5F5',
        '#7B1FA2',
        '#4A148C'
      ],
      bgImg: [
        'https://cdn.pixabay.com/photo/2016/03/04/17/51/brick-1236403_1280.jpg',
        'https://cdn.pixabay.com/photo/2018/03/22/15/03/brick-wall-3250702_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/11/21/18/11/architecture-1846939_1280.jpg',
        'https://cdn.pixabay.com/photo/2018/03/04/09/51/space-3197610_1280.jpg',
        'https://cdn.pixabay.com/photo/2014/04/08/19/38/sky-319546_1280.png',
        'https://cdn.pixabay.com/photo/2013/08/09/05/54/layer-170971_1280.jpg',
        'https://cdn.pixabay.com/photo/2017/08/07/21/52/nature-2608274_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/06/08/16/30/texture-1444067_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/12/08/19/53/fractals-1892996_1280.jpg',
        'https://cdn.pixabay.com/photo/2015/04/15/01/28/background-723053_1280.jpg',
        'https://cdn.pixabay.com/photo/2017/09/16/16/05/sea-2755901_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/11/29/01/13/background-1866485_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/10/29/10/14/abstract-1780378_1280.png',
        'https://cdn.pixabay.com/photo/2015/09/10/14/45/texture-934511_1280.jpg',
      ],
      tags: [],
      tagSuggestions: [
        { id: 1, name: "Motivation" },
        { id: 2, name: "Motivational_Qoute" },
        { id: 3, name: "Motivational_Line" },
        { id: 4, name: "Motivation_Message" },
        { id: 5, name: "Shayari" },
        { id: 6, name: "One_Liner" },
        { id: 7, name: "Poem_" },
        { id: 8, name: "qoutes" },
        { id: 9, name: "Inspire" },
        { id: 10, name: "Inspirational" },
      ],
      activeIndex: false,
      textColor: '#fff',
      colorSelector: false,
      textSizeSelector: false,
      textSize: '26px',
      fontBold: true,
      fontItalic: false
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  post = () => this.db.ref(`all-post/post`);

  componentDidMount() {
    console.log("this.props.userInfo = > "+this.props.userInfo)
    document.addEventListener('mousedown', this.handleClickOutside);
    let defaultImgUrl = 'https://cdn.pixabay.com/photo/2016/03/04/17/51/brick-1236403_1280.jpg';
    let defaultBgColor = 'rgb(123, 31, 162)';
    if (this.state.bgImg) {
      let lenght = this.state.bgImg.length;
      let random = Math.floor(Math.random() * lenght);
      this.setState({ selectedBgImg: this.state.bgImg[random] })
    } else {
      this.setState({ selectedBgImg: defaultImgUrl })
    }
    if (this.state.colors) {
      let lenght = this.state.colors.length;
      let random = Math.floor(Math.random() * lenght);
      this.setState({ selectedBgColor: this.state.colors[random] })
    } else {
      this.setState({ selectedBgColor: defaultBgColor })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  setWrapperRef(node) {
    this.wrapperRef = node;
  }
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ colorSelector: false })
      this.setState({ textSizeSelector: false })

    }
  }

  onTextColorChange = (color) => {
    this.setState({ textColor: color.hex });
  };
  openTextColorSelector = () => {
    this.setState({ colorSelector: !this.state.colorSelector })
  }
  onTextSizeChange = (event) => {
    this.setState({ textSize: event.target.value + 'px' });
  };
  openTextFonSizeSelector = () => {
    this.setState({ textSizeSelector: !this.state.textSizeSelector })
  }
  handleTagDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  handleTagAddition (tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }

  onBgChange(item, index, type) {
    this.setState({ activeIndex: index });
    if (type === 'bgImg') {
      this.setState({ selectedBgImg: item });
    } else if (type === 'bgColor') {
      this.setState({ selectedBgColor: item });
      this.setState({ selectedBgImg: '' });
    }
  }
  onTextAlignChange(type) {
    this.setState({ selectTextAligStyle: type });
  }
  onFontChange = (font) => {
    if (font === 'bold') {
      this.setState({ fontBold: !this.state.fontBold });
    } else if (font === 'italic') {
      this.setState({ fontItalic: !this.state.fontItalic });
    }
  }
  postTextChange = (event) => {
    this.setState({ postText: event.target.value });
  }
  captionTextChange = (event) => {
    this.setState({ captionText: event.target.value });
  }

  submitPost = () => {
    let allPost = firebase.database().ref("all-post");
    let fontWeight = this.state.fontBold ? 'bold' : 'normal';
    let textStyle = this.state.fontItalic ? 'italic' : 'normal';
    if (this.state.postText.length < 10) {
      alert("Please write more than 10 character !");
      return;
    }
    let userinfo = this.props.userInfo ? this.props.userInfo : '';
    let username = userinfo.username ? userinfo.username : '';
    let photoURL = userinfo.photoURL ? userinfo.photoURL : 'https://wowsciencecamp.org/wp-content/uploads/2018/07/dummy-user-img-1.png';
    let uid = localStorage.getItem("Authtoken") ? localStorage.getItem("Authtoken") : firebase.auth().currentUser.uid;
    var today = new Date();
    var postDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var postTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let body = {
      uid: uid,
      postDate: postDate,
      postTime: postTime,
      username:username,
      photoURL: photoURL,
      postText: this.state.postText.replace(/ /g, '-'),
      captionText: this.state.captionText,
      tags: this.state.tags,
      
      Style: {
        backgroundColor: this.state.selectedBgColor,
        backgroundImage: "url(" + this.state.selectedBgImg + ")",
        fontSize: this.state.textSize,
        color: this.state.textColor,
        textAlign: this.state.selectTextAligStyle,
        fontWeight: fontWeight,
        textStyle: textStyle,
      }
    }
    console.log("boduy  =="+JSON.stringify( body));
    allPost.push().set(body).then(() => {
      alert("Your post added successfully !");
      this.props.history.push("/home");
    }).catch((err) => {
      alert(err + " !");
    })

  }

  textAreaAdjust(o) {
    let textarea = window.document.getElementById("postText");
    textarea.addEventListener("keypress", function () {
      if (textarea.scrollTop != 0) {
        textarea.style.height = textarea.scrollHeight + "px";
          if(textarea.scrollHeight+'px' === textarea.style.height){
            let textSize = textarea.style.fontSize.replace("px",'');
            textarea.style.fontSize = (textSize - 1)+"px"; 
          }
      }
      
    }, false);
  }
  textCaptionAdjust(o) {
    let textarea = window.document.getElementById("captionText");
    textarea.addEventListener("keypress", function () {
      if (textarea.scrollTop != 0) {
        textarea.style.height = textarea.scrollHeight + "px";
      }
    }, false);
  }



  render() {

    const activeIndex = this.state.activeIndex;
    const activeColorSelector = this.state.colorSelector ? 'block' : 'none';
    const activeTextSizeSelector = this.state.textSizeSelector ? 'block' : 'none';
    return (
      <Container className="add-post-page">


        <Row className="box-center">
          <Col md="9" className="">
            <Card className="p-2">
              <div className="d-flex px-3 py-1 my-1 justify-content-between" ref={this.setWrapperRef}>

                <div className="ml-3 mt-2">
                  <h5>Add Qoute </h5>
                </div>
                <div className="position-relative">
                  <div className="btn-group btn-group-sm ml-3" role="group" aria-label="Basic example">
                    <button type="button" className={this.state.fontBold ? "btn btn-secondary" : "btn btn-outline-secondary"}
                      onClick={() => this.onFontChange('bold')}><i className="fa fa-bold"></i></button>
                    <button type="button" className={this.state.fontItalic ? "btn btn-secondary" : "btn btn-outline-secondary"}
                      onClick={() => this.onFontChange('italic')}><i className="fa fa-italic"></i></button>
                  </div>
                  <button className="btn btn-sm border ml-3" onClick={this.openTextFonSizeSelector}>Font size</button>
                  <button className="btn btn-sm border ml-3" onClick={this.openTextColorSelector}
                    style={{ 'backgroundColor': this.state.textColor }}>Text color</button>
                  <div className="color-selector-div" style={{ display: activeColorSelector }}>
                    <i className="fa fa-times-circle-o close-btn" onClick={this.openTextColorSelector}></i>
                    <SketchPicker
                      color={this.state.textColor}
                      onChangeComplete={this.onTextColorChange}
                    />
                  </div>
                  <div className="text-size-selector rounded border py-2 px-3" style={{ display: activeTextSizeSelector }}>
                    <input type="range" min="12" className="form-control-range slider" id="slider" onChange={this.onTextSizeChange} />
                  </div>
                  <div className="btn-group btn-group-sm ml-3" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-secondary" onClick={() => this.onTextAlignChange('left')}><i className="fa fa-align-left"></i></button>
                    <button type="button" className="btn btn-secondary" onClick={() => this.onTextAlignChange('center')}><i className="fa fa-align-center"></i></button>
                    <button type="button" className="btn btn-secondary" onClick={() => this.onTextAlignChange('right')}><i className="fa fa-align-right"></i></button>
                  </div>
                  <button className="ml-3 btn btn-sm btn-info" data-toggle="modal" data-target=".bg-theme-modal">Add Background</button>
                </div>
              </div>
              <div className="qoute-cover-img"
                style={{ 'backgroundImage': 'url(' + this.state.selectedBgImg + ')', 'backgroundColor': this.state.selectedBgColor }}>
                {/* <Draggable bounds="parent"> */}
                  <textarea autoFocus={true} id="postText" className="form-control"
                    onChange={this.postTextChange}
                    onInput={() => this.textAreaAdjust(this)}
                    style={{
                      'textAlign': this.state.selectTextAligStyle,
                      'color': this.state.textColor, 'fontSize': this.state.textSize,
                      fontWeight: this.state.fontBold ? 'bold' : 'normal',
                      fontStyle: this.state.fontItalic ? 'italic' : 'normal'
                    }}
                    row="5" placeholder="add text here..."></textarea>
                {/* </Draggable> */}
              </div>
              <section className="info-sec">
                   <textarea  id="captionText" className="form-control"
                    onChange={this.captionTextChange}
                    onInput={() => this.textCaptionAdjust(this)}
                    placeholder="add caption here..."></textarea>
                    <ReactTags
                      placeholder="Search tag here..."
                      tags={this.state.tags}
                      suggestions={this.state.tagSuggestions}
                      handleDelete={this.handleTagDelete.bind(this)}
                      handleAddition={this.handleTagAddition.bind(this)} />
              </section>

              <div className="text-right mt-2">
                <button className="btn btn-sm btn-info" onClick={this.submitPost}>&nbsp;&nbsp;Next &nbsp;&nbsp;</button>
              </div>

            </Card>
          </Col>
          <div className="modal theme fade bg-theme-modal" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header pb-0">
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                      <a className="nav-link active" id="home-tab" data-toggle="tab" href="#background-img" role="tab" aria-controls="background-img" aria-selected="true">Background image</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id="profile-tab" data-toggle="tab" href="#solid-color" role="tab" aria-controls="solid-color" aria-selected="false">Solid color</a>
                    </li>
                  </ul>

                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="background-img" role="tabpanel" aria-labelledby="background-img-tab">
                      <div className="theme-list d-flex">
                        {
                          this.state.bgImg.map((item, i) =>
                            <div key={i} onClick={() => this.onBgChange(item, i, "bgImg")} className="box"
                              style={{ 'backgroundImage': 'url(' + item + ')' }} >
                              <div className="check" style={activeIndex === i ? { 'display': 'flex' } : { display: 'none' }} >
                                <i className="fa fa-check-circle"></i>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                    <div className="tab-pane fade" id="solid-color" role="tabpanel" aria-labelledby="solid-color-tab">
                      <div className="theme-list d-flex">
                        {
                          this.state.colors.map((item, i) =>
                            <div key={i} onClick={() => this.onBgChange(item, i, "bgColor")} className="box" style={{ 'backgroundColor': item }} >
                              <div className="check" style={activeIndex === i ? { 'display': 'flex' } : { 'display': 'none' }}>
                                <i className="fa fa-check-circle"></i>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-info" data-dismiss="modal">Save & Proceed</button>
                </div>
              </div>
            </div>
          </div>
        </Row>
      </Container>

    );
  }
}

export default AddPost;





