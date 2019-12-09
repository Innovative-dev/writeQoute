import React, { Component } from "react";
import Draggable from "react-draggable";
import ReactTags from 'react-tag-autocomplete';



export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [
        { id: 1, name: "Apples" },
        { id: 2, name: "Pears" }
      ],
      suggestions: [
        { id: 3, name: "Bananas" },
        { id: 2, name: "Banana2" },
        { id: 4, name: "Mangos" },
        { id: 5, name: "Lemons" },
        { id: 6, name: "Apricots" }
      ]
    }
  }

  handleDelete (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  handleAddition (tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }
  

textAreaAdjust(o) {
  var textarea = null;
            textarea = window.document.querySelector("textarea");
            textarea.addEventListener("keypress", function() {
                if(textarea.scrollTop != 0){
                    textarea.style.height = textarea.scrollHeight + "px";
                }
            }, false);
}

  render = () => {
    const { disabled } = this.state;
    return (
      <div className="container"  style={{width: '400px',height: '400px'}}>
        <Draggable  bounds="parent">
          <div style={{ width: 200,height: 400 }}>
            <textarea autoFocus={true} onKeyUp={()=> this.textAreaAdjust(this)} placeholder="Enter text here..."></textarea>
          </div>
        </Draggable>

        <ReactTags
        tags={this.state.tags}
        suggestions={this.state.suggestions}
        handleDelete={this.handleDelete.bind(this)}
        handleAddition={this.handleAddition.bind(this)} />
        

      </div>
    );
  };
}