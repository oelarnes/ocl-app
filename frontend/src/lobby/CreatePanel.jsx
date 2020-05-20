import React from "react";

import _ from "utils/utils";
import App from "../app";
import {eventIdOptions} from "../utils";
import axios from "axios";
import GameOptions from "./GameOptions";

const CreatePanel = () => {
  const {title, seats} = App.state;

  return (
    <fieldset className="fieldset">
      <legend className="legend">
        Create a Room
      </legend>
      <div>
        <label>
          Event Id:{" "}
          <select value={title}
            onChange={(e) => {
              App.save("title", e.currentTarget.value);
            }}
            onBlur={async (e) => {
              const value = e.currentTarget.value;
              const ctParam = value.includes("-powered-") ? "Powered" : value.includes("-interactive-") ? "Interactive" : null;
              if (ctParam) {
                const {data} = await axios.post("/api/data", {query: `{cubeByType(cubeType: ${ctParam}){cardNames}}`});
                App.save("list", data.data.cubeByType.cardNames.join("\n"));
              }
              App.save("oclDataSync", !/$casual-/.test(value));
            }}>
            {eventIdOptions().map((x,i) => <option key={i}>{x}</option>)}
          </select>
        </label>
      </div>
      {title.includes("casual-") ?
        <div>
          Number of players:{" "}
          <select value={seats} onChange={(e) => {App.save("seats", e.currentTarget.value);}}>
            {_.seq(100, 1).map((x, i) =>
              <option key={i}>{x}</option>)}
          </select>
        </div> : ""
      }
      {title.includes("casual-other-") ? <GameOptions/> : ""}
      <p>
        <button onClick={App._emit("create")}>
          Create Room
        </button>
      </p>
    </fieldset>
  );
};

export default CreatePanel;
