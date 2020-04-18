import React from "react";
import { Card, Elevation } from "@blueprintjs/core";

const HomeAside = props => {
  const { userInfo,postCount } = props;
  return (
    <Card
      className="aside-profile primary-bg"
      interactive={true}
      elevation={Elevation.ONE}
    >
      <div className="text-center">
        {userInfo?.photoURL ? (
          <img className="header-avatar big" src={userInfo.photoURL} />
        ) : (
          <img className="header-avatar" src="./user.png" />
        )}
        <h3 className="mt-0 c-white">
          {userInfo?.username ? userInfo.username : ""}
        </h3>

        <div className="col-12">
        <h5  className="mt-0 c-white">Your Have Posted {postCount ? <b>{postCount}</b> : 0} Qoutes</h5>
        </div>
        {/* <div className="row c-white">
              <div className="col-4">
                  <h4 className=" mb-0 mt-0">14</h4>
                  <small>Qoutes</small>
              </div>
              <div className="col-4">
                  <h4 className=" mb-0 mt-0">34</h4>
                  <small>Followers</small>
              </div>
              <div className="col-4">
                  <h4 className=" mb-0 mt-0">140</h4>
                  <small>Following</small>
              </div>
            </div> */}
      </div>
    </Card>
  );
};

export default HomeAside;
