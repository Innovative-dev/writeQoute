import React from 'react';
import {Card, Elevation } from "@blueprintjs/core";

const SidebarTags = () =>{
    return(
        <Card interactive={true} elevation={Elevation.ONE}>
        <h3 className="text-ingradient c-black-b">TOP TRENDING HASHTAGS</h3>

        <h5><a href="#">Motivational</a> <small className="gray-color">(123 Qoutes)</small></h5>
        <h5><a href="#">Stories</a> <small className="gray-color">(12 Qoutes)</small></h5>
        <h5><a href="#">One-Liner</a> <small className="gray-color">(13 Qoutes)</small></h5>
        <h5><a href="#">Motivational</a> <small className="gray-color">(123 Qoutes)</small></h5>
        <h5><a href="#">Stories</a> <small className="gray-color">(12 Qoutes)</small></h5>
        <h5><a href="#">One-Liner</a> <small className="gray-color">(13 Qoutes)</small></h5>
        
        
    </Card>
    );
}

export default SidebarTags;