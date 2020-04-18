// import React, { Component } from 'react';
// import PropTypes from 'prop-types';

// export class Autocomplete extends Component {
//   static propTypes = {
//     options: PropTypes.instanceOf(Array).isRequired
//   };
//   state = {
//     activeOption: 0,
//     filteredOptions: [],
//     showOptions: false,
//     userInput: ''
//   };

//   onChange = (e) => {
//     console.log('onChanges');

//     const { options } = this.props;
//     const userInput = e.currentTarget.value;

//     const filteredOptions = options.filter(
//       (optionName) =>
//         optionName.toLowerCase().indexOf(userInput.toLowerCase()) > -1
//     );

//     this.setState({
//       activeOption: 0,
//       filteredOptions,
//       showOptions: true,
//       userInput: e.currentTarget.value
//     });
//   };

//   onClick = (e) => {
//     this.setState({
//       activeOption: 0,
//       filteredOptions: [],
//       showOptions: false,
//       userInput: e.currentTarget.innerText
//     });
//   };
//   onKeyDown = (e) => {
//     const { activeOption, filteredOptions } = this.state;

//     if (e.keyCode === 13) {
//       this.setState({
//         activeOption: 0,
//         showOptions: false,
//         userInput: filteredOptions[activeOption]
//       });
//     } else if (e.keyCode === 38) {
//       if (activeOption === 0) {
//         return;
//       }
//       this.setState({ activeOption: activeOption - 1 });
//     } else if (e.keyCode === 40) {
//       if (activeOption === filteredOptions.length - 1) {
//         console.log(activeOption);
//         return;
//       }
//       this.setState({ activeOption: activeOption + 1 });
//     }
//   };

//   render() {
//     const {
//       onChange,
//       onClick,
//       onKeyDown,

//       state: { activeOption, filteredOptions, showOptions, userInput }
//     } = this;
//     let optionList;
//     if (showOptions && userInput) {
//       if (filteredOptions.length) {
//         optionList = (
//           <ul className="options">
//             {filteredOptions.map((optionName, index) => {
//               let className;
//               if (index === activeOption) {
//                 className = 'option-active';
//               }
//               return (
//                 <li className={className} key={optionName} onClick={onClick}>
//                   {optionName}
//                 </li>
//               );
//             })}
//           </ul>
//         );
//       } else {
//         optionList = (
//           <div className="no-options">
//             <em>No Option!</em>
//           </div>
//         );
//       }
//     }
//     return (
//       <React.Fragment>
//         <div className="search">
//           <input
//             type="text"
//             className="search-box"
//             onChange={onChange}
//             onKeyDown={onKeyDown}
//             value={userInput}
//           />
//           <input type="submit" value="" className="search-btn" />
//         </div>
//         {optionList}

        
//       </React.Fragment>
//     );
//   }
// }

// export default Autocomplete;



// import React from 'react';
// import {Card, Elevation, InputGroup } from "@blueprintjs/core";

// class MultiSelect extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         tags: [
//            "Motivation" ,
//            "Motivational_Qoute" ,
//            "Motivational_Line" ,
//            "Motivation_Message" ,
//            "Shayari" ,
//            "One_Liner" ,
//            "Poem_" ,
//            "qoutes" ,
//            "Inspire" ,
//            "Inspirational" ,
//         ],
//         suggestions: []
//       }
//     }
  
//     searchTag = (event)=>{
//         let val = event.target.value;
//         let arr = this.state.tags;
//         console.log("valiue "+val);
//             arr.map( item=> {
//                 if(item.includes(val)){
//                     console.log("item "+item);
//                     this.setState({suggestions: [...this.state.suggestions,item ]})
//                 }
//               })
// }


//     render() {
//     return(
//       <div>
//           <InputGroup id="email-input" onChange={this.searchTag} placeholder="Search tags..." />
    

//                 {/* {this.test} */}
//               <div>
//                {this.state.suggestions ? 
//                     this.state.suggestions.map((item,index )=> (<h6 key={index}>{item}</h6>)
//                     )
//                     : ''} 
//           </div>
//       </div>
//     );
// }
// }
// export default MultiSelect;


import React, { Component } from 'react';
import PropTypes from 'prop-types';


export class Autocomplete extends Component {

    static propTypes = {
        options: PropTypes.instanceOf(Array).isRequired
    }
    state = {
        activeOption: 0,
        filteredOptions: [],
        showOptions: false,
        userInput: '',
        selectedTag:[]
      };


    onChange = (e) => { 
        const { options } = this.props;
        console.log("onChange"+options);
        const userInput = e.target.value;
        const filteredOptions = options.filter( (item) => 
                item.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );
        this.setState({
            activeOption: 0,
            filteredOptions: filteredOptions,
            showOptions: true,
            userInput: e.target.value
        });
    };

    //   onClick = (e) => {
//     this.setState({
//       activeOption: 0,
//       filteredOptions: [],
//       showOptions: false,
//       userInput: e.currentTarget.innerText
//     });
//   };

    onClick = (e) => {
        console.log(e.target.value);
        this.setState({
            activeOption: 0,
            filteredOptions: [],
            showOptions: false,
            userInput: e.currentTarget.innerText,
            selectedTag: [...this.state.selectedTag,e.target.innerText ]
          });
    }
    
      
  render() {
    const { 
            onChange,
            onKeyDown,
            onClick,
            state:{activeOption,filteredOptions,showOptions,userInput,selectedTag}
            } = this; 
    let optionList;
   
    if(showOptions && userInput){
        if(filteredOptions.length){
            optionList = (
                <ul className="options">
                    {filteredOptions.map((item,i) => {
                        let className;
                        if(i === activeOption){
                            className="option-active";
                        }
                        return(
                            <li className={className} key ={item} onClick={onClick}>
                               {item} 
                            </li>
                        )
                    })};
                </ul>
            )
        } else{
            optionList = (
                            <div className="no-options">
              <em>No Option!</em>
            </div>
            )
        }
    }
    return (
      <React.Fragment>
          <div>
              {selectedTag ? 
                selectedTag.map( (item,i) =>
                    <h6 key={i}>{item}</h6>
                )
              :''}
          </div>
        <div className="search">
          <input type="text" className="search-box" 
            onChange = {onChange}
            onKeyDown = {onKeyDown}
            value = {userInput}
          />
          <input type="submit" value="" className="search-btn" />
        </div>
        {optionList}
      </React.Fragment>
    );
  }
}
export default Autocomplete;