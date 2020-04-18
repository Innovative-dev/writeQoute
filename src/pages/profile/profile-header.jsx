import React from 'react';
import { Card, Elevation } from "@blueprintjs/core";
import BgImg from '../../assets/img/bg.jpg';

  const HomeAside = props => {
    const { postCount,userInfo} = props;
    return (
      <Card className="aside-profile"
        style={{ backgroundImage: `url(${BgImg})` }}
        interactive={true} elevation={Elevation.ONE}>
        <div className="text-center">
          <div className="row">
            <div className="col-md-3">
            {userInfo?.photoURL ? (
              <img className="header-avatar extra-big" src={userInfo?.photoURL} />
              ) : (
                <img className="header-avatar" src="./user.png" />
              )}  
            </div>
            <div className="col-md-9">
              <h3 className="mt-0 c-white">{userInfo?.username}</h3>

              <h4  className="mt-0 c-white">Your Have Posted {postCount ? postCount : 0} Qoutes</h4>
            </div>
          </div>
        </div>
        </Card>

    );
  };

export default HomeAside;