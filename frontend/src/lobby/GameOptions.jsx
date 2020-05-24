import React, {Fragment} from "react";

import _ from "utils/utils";
import App from "../app";
import Select from "../components/Select";

import CubeList from "./CubeList";

const GameOptions = () => {
  const { gametype, gamesubtype } = App.state;

  switch (`${gamesubtype} ${gametype}`) {
  case "cube draft":
    return <CubeDraft/>;
  case "cube sealed":
    return <CubeSealed/>;
  default:
    return null;
  }
};

const CubeDraft = () => (
  <Fragment>
    <div>
      <CubeList />
    </div>
  </Fragment>
);

const CubeSealed = () => (
  <Fragment>
    <blockquote className="game-mode-description">
      <p>Like sealed except each pack is a random set of cards from a large pool of cards called the &ldquo;cube&ldquo;.</p>
    </blockquote>
    <div>
      <CubeList />
      <CubeSealedOptions />
    </div>
  </Fragment>
);

const CubeSealedOptions = () => (
  <div>
    <Select link="cubePoolSize" opts={_.seq(120, 15)} />
    {" "}cards per player
  </div>
);


export default GameOptions;
