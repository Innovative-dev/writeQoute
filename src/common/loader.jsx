import React from 'react';
import {Card, Elevation } from "@blueprintjs/core";

const Loader = (props) => {
        const {size,border } = props;
    return  <div className="loading-spinner-wrapper" 
             style={{width: size? size+'px' : '17px',height: size? size+'px' : '17px', 
             border: border ? border+'px solid #dbdbdb' : '2px solid #dbdbdb'}}></div>;

}

export default Loader;