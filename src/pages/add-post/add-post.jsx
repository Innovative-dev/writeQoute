import React from "react";
import classNames from "classnames";
import * as firebase from "firebase";
import {
  Slider,
  Popover,
  Card,
  Elevation,
  Position,
  Classes,
  EditableText,
  Dialog,
  InputGroup,
  Tab,
  TabId,
  Tabs
} from "@blueprintjs/core";
import { SketchPicker } from "react-color";
import CreatableSelect from "react-select/creatable";

import { Colors, BackgroundImages, Tags } from "./helpers";

class AddPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      postText: "",
      captionText: "",
      selectedBgImg: "",
      selectedBgColor: "",
      selectTextAligStyle: "left",
      colors: Colors,
      bgImg: BackgroundImages,
      tags: [],
      tagSuggestions: Tags,
      activeIndex: false,
      textColor: "#fff",
      textSizeSelector: false,
      textSize: 26,
      fontBold: true,
      fontItalic: false,
      textDecoration: false,
      alignItems: "center",
      isOpen: false,
      navbarTabId: "bgImage",
      authToken:null,
      userInfo: {}
    };
  }

  post = () => this.db.ref(`all-post/post`);

  componentDidMount() {
    let defaultImgUrl = "https://cdn.pixabay.com/photo/2016/03/04/17/51/brick-1236403_1280.jpg";
    let defaultBgColor = "rgb(123, 31, 162)";
    if (this.state.bgImg) {
      let lenght = this.state.bgImg.length;
      let random = Math.floor(Math.random() * lenght);
      this.setState({ selectedBgImg: this.state.bgImg[random] });
    } else {
      this.setState({ selectedBgImg: defaultImgUrl });
    }
    if (this.state.colors) {
      let lenght = this.state.colors.length;
      let random = Math.floor(Math.random() * lenght);
      this.setState({ selectedBgColor: this.state.colors[random] });
    } else {
      this.setState({ selectedBgColor: defaultBgColor });
    }
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
  handleChange = newValue => {
    this.setState({ tags: newValue }, () => {
      console.group("Value Changed" + JSON.stringify(this.state.tags));
    });
  };

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  onTextColorChange = color => {
    this.setState({ textColor: color.hex });
  };
  onTextSizeChange = event => {
    this.setState({ textSize: event.target.value });
  };
  handleTagDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  }

  handleTagAddition(tag) {
    const tags = [].concat(this.state.tags, tag);
    this.setState({ tags });
  }
  getChangeHandler = value => {
    return this.setState({ textSize: value });
  };

  onBgChange(item, index, type) {
    this.setState({ activeIndex: index });
    if (type === "bgImg") {
      this.setState({ selectedBgImg: item });
    } else if (type === "bgColor") {
      this.setState({ selectedBgColor: item });
      this.setState({ selectedBgImg: "" });
    }
  }
  onTextAlignChange(type) {
    this.setState({ selectTextAligStyle: type });
  }
  onItemAlignChange(type) {
    this.setState({ alignItems: type });
  }
  onFontChange = font => {
    console.log(font);
    if (font === "bold") {
      this.setState({ fontBold: !this.state.fontBold });
    } else if (font === "italic") {
      this.setState({ fontItalic: !this.state.fontItalic });
    } else if (font === "underline") {
      this.setState({ textDecoration: !this.state.fontItalic });
    }
  };
  postTextChange = value =>
    this.setState({ postText: value }, () => {
      console.log("posg TEt " + this.state.postText);
    });
  captionTextChange = event => {
    this.setState({ captionText: event.target.value });
  };

  submitPost = () => {
    if(this.state.authToken){
    let allPost = firebase.database().ref("all-post");
    let fontWeight = this.state.fontBold ? "bold" : "normal";
    let textStyle = this.state.fontItalic ? "italic" : "normal";
    if (this.state.postText.length < 10) {
      alert("Please write more than 10 character !");
      return;
    }
    let username = this.state.userInfo?.username ? this.state.userInfo.username : '';
    let photoURL = this.state.userInfo?.photoURL ? this.state.userInfo.photoURL : "https://image.flaticon.com/icons/svg/149/149071.svg";
    var today = new Date();
    var date = today.toGMTString().substr(5,11);
    var time = today.toTimeString().substr(0,8);
    var time12H = new Date('2020-01-01T' + time + 'Z')
    .toLocaleTimeString({},
      {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
    );  
    let postDate = date + ', ' + time12H;
    let body = {
      uid: this.state.authToken,
      username: username,
      photoURL: photoURL,
      postDate: postDate,
      postText: this.state.postText.replace(/ /g, "-"),
      captionText: this.state.captionText,
      tags: this.state.tags,
      Style: {
        backgroundColor: this.state.selectedBgColor,
        backgroundImage: "url(" + this.state.selectedBgImg + ")",
        alignItems: this.state.alignItems,
        fontSize: this.state.textSize,
        color: this.state.textColor,
        textAlign: this.state.selectTextAligStyle,
        fontWeight: fontWeight,
        textStyle: textStyle,
        textDecoration: this.state.textDecoration
      }
    };
    allPost
      .push()
      .set(body)
      .then(() => {
        alert("Your post added successfully !");
        this.props.history.push("/home");
      })
      .catch(err => {
        alert(err + " !");
      });
    } else{
      alert("Please login first !");
    }
  };

  textAreaAdjust() {
    let textarea = window.document.getElementById("textWrapper");
    let content = window.document.getElementById("postContent");
    let height = textarea.scrollHeight;
    textarea.addEventListener(
      "keypress",
      function() {
        console.log("textAreaAdjust " + height);
        if (height > 400) {
          console.log("exceed");
          let textSize = content.style.fontSize.replace("px", "");
          content.style.fontSize = textSize - 1 + "px";
        }
      },
      false
    );
  }

  handleOpen = () => this.setState({ isOpen: true });
  handleClose = () => this.setState({ isOpen: false });
  handleNavbarTabChange = navbarTabId => this.setState({ navbarTabId });

  render() {
    const {
      email,
      tagSuggestions,
      alignItems,
      selectedBgImg,
      selectedBgColor,
      selectTextAligStyle,
      textColor,
      activeIndex,
      textDecoration,
      textSizeSelector,
      textSize,
      fontBold,
      fontItalic
    } = this.state;

    const colorSelector = (
      <SketchPicker
        color={textColor}
        onChangeComplete={this.onTextColorChange}
      />
    );

    const fontSizeSelector = (
      <div className="col-md-12">
        <Slider
          min={7}
          max={56}
          stepSize={1}
          labelStepSize={1}
          onChange={this.getChangeHandler}
          value={this.state.textSize}
        />
      </div>
    );

    const BgImage = () => (
      <div className="bg-theme-list d-flex">
        {this.state.bgImg.map((item, i) => (
          <div
            key={i}
            onClick={() => this.onBgChange(item, i, "bgImg")}
            className="box"
            style={{ backgroundImage: "url(" + item + ")" }}
          >
            <div
              className="check"
              style={
                activeIndex === i ? { display: "flex" } : { display: "none" }
              }
            >
              <span className="bp3-icon-selection"></span>
            </div>
          </div>
        ))}
      </div>
    );

    const SolidColorBg = () => (
      <div className="bg-theme-list d-flex">
        {this.state.colors.map((item, i) => (
          <div
            key={i}
            onClick={() => this.onBgChange(item, i, "bgColor")}
            className="box"
            style={{ backgroundColor: item }}
          >
            <div
              className="check"
              style={
                activeIndex === i ? { display: "flex" } : { display: "none" }
              }
            >
              <span className="bp3-icon-selection"></span>
            </div>
          </div>
        ))}
      </div>
    );
    return (
      <main className="add-post-page">
        <div className=" v-h100 d-flex content-center items-center">
          <div className="col-lg-8 col-md-12 col-content">
            <Card className="w-100" elevation={Elevation.TWO}>
              <header
                className="c-black-d d-flex content-between items-center"
                ref={this.setWrapperRef}
              >
                <div className="head">Add Post</div>
                <div className="text-right btn-row">
                  <div className="bp3-button-group .modifier">
                    <a
                      className="bp3-button bp3-icon-bold"
                      // className={this.state.fontBold ? "btn btn-secondary" : "btn btn-outline-secondary"}
                      onClick={() => this.onFontChange("bold")}
                    ></a>
                    <a
                      className="bp3-button bp3-icon-italic"
                      //  className={this.state.fontItalic ? "btn btn-secondary" : "btn btn-outline-secondary"}
                      onClick={() => this.onFontChange("italic")}
                    ></a>
                    <a
                      className="bp3-button bp3-icon-underline"
                      onClick={() => this.onFontChange("underline")}
                    ></a>
                  </div>
                  <div className="bp3-button-group .modifier">
                    <a
                      className="bp3-button bp3-icon-alignment-top"
                      onClick={() => this.onItemAlignChange("flex-start")}
                    ></a>
                    <a
                      className="bp3-button bp3-icon-alignment-vertical-center"
                      onClick={() => this.onItemAlignChange("center")}
                    ></a>
                    <a
                      className="bp3-button bp3-icon-alignment-bottom"
                      onClick={() => this.onItemAlignChange("flex-end")}
                    ></a>
                  </div>
                  <div className="bp3-button-group .modifier">
                    <a
                      className="bp3-button bp3-icon-align-left"
                      onClick={() => this.onTextAlignChange("left")}
                    ></a>
                    <a
                      className="bp3-button bp3-icon-align-center"
                      onClick={() => this.onTextAlignChange("center")}
                    ></a>
                    <a
                      className="bp3-button bp3-icon-align-right"
                      onClick={() => this.onTextAlignChange("right")}
                    ></a>
                  </div>

                  <Popover
                    popoverClassName="fontPopover"
                    content={fontSizeSelector}
                    position={Position.BOTTOM}
                    usePortal={true}
                  >
                    <button className="bp3-button btn bp3-minimal bp3-icon-paragraph">
                      <span>Font Size</span>
                    </button>
                  </Popover>
                  <Popover content={colorSelector} position={Position.AUTO}>
                    <button
                      className="bp3-button btn bp3-minimal bp3-icon-tint"
                      style={{ backgroundColor: textColor }}
                    >
                      <span>Text Color</span>
                    </button>
                  </Popover>
                  <button
                    onClick={this.handleOpen}
                    className="bp3-button btn bp3-minimal bp3-icon-mountain"
                  >
                    <span>Add Background</span>
                  </button>
                </div>

                <Dialog
                  icon="mountain"
                  onClose={this.handleClose}
                  title="Choose Background"
                  {...this.state}
                >
                  <div className={Classes.DIALOG_BODY}>
                    <Tabs
                      id="TabsExample"
                      key={this.state.vertical ? "vertical" : "horizontal"}
                      renderActiveTabPanelOnly={this.state.activePanelOnly}
                      vertical={this.state.vertical}
                      s
                    >
                      <Tab
                        id="bgImage"
                        title="Background Image"
                        panel={<BgImage />}
                      />
                      <Tab
                        id="solidColorBg"
                        title="Solid Color"
                        panel={<SolidColorBg />}
                      />
                      <Tabs.Expander />
                    </Tabs>
                  </div>
                </Dialog>
              </header>

              <div
                className="content d-flex content-center items-center"
                id="postContent"
                style={{
                  backgroundImage: "url(" + selectedBgImg + ")",
                  backgroundColor: selectedBgColor,
                  alignItems: alignItems,
                  textAlign: selectTextAligStyle,
                  color: textColor,
                  fontSize: textSize + "px",
                  fontWeight: fontBold ? "bold" : "normal",
                  fontStyle: fontItalic ? "italic" : "normal",
                  textDecoration: textDecoration ? "underline" : "none"
                }}
              >
                <EditableText
                  className="EditableText w-100 "
                  placeholder="Add your qoute here..."
                  selectAllOnFocus={false}
                  multiline={true}
                  minLines={1}
                  onChange={this.postTextChange}
                />
              </div>

              <div className="footer">
                <EditableText
                  placeholder="Add your caption here..."
                  selectAllOnFocus={false}
                  multiline={true}
                  minLines={1}
                />
                <br />
                <CreatableSelect
                  isMulti
                  onChange={this.handleChange}
                  options={tagSuggestions}
                  placeholder="Search Tags here..."
                />
                <br />
                <div className="text-right">
                  <button
                    className="main-button primary-bg"
                    onClick={this.submitPost}
                  >
                    Save add Proceed
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    );
  }
}
export default AddPost;
