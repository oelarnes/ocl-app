import React from "react";
import PropTypes from "prop-types";

import App from "../app";
import {getZoneDisplayName, ZONE_MAIN, ZONE_SIDEBOARD} from "../zones";
import {COLORS_TO_LANDS_NAME} from "../gamestate";
import Select from "../components/Select";

const DeckSettings = () => (
  (App.state.isGameFinished || App.state.didGameStart)
    ? <div className='deck-settings'>
      <DownloadPanel />
    </div>
    : <div/>
);

const DownloadPanel = () => (
  <fieldset className='fieldset'>
    <legend className='legend game-legend'>Download</legend>
    <div className='column'>
      <Download />
      <Copy />
      <Log />
    </div>
  </fieldset>
);

const Download = () => {
  const filetypes = ["dek", "txt"];
  const select = <Select link='filetype' opts={filetypes}/>;

  return (
    <div className='connected-container'>
      <button className='connected-component' onClick={App._emit("download")}>
        Download as
      </button>
      {`${App.state.name}-${App.state.title}`}
      {select}
      <span className='download-button'/>
    </div>
  );
};

const Copy = () => (
  <div className='copy-controls connected-container'>
    <button
      className='connected-component'
      onClick={App._emit("copy")}>
      Copy deck to clipboard
    </button>
  </div>
);

const Log = () => (
  App.state.isGameFinished && /draft/.test(App.state.gametype)
    ? <div>
      <button className='connected-component'
        onClick={App._emit("getLog")}>
        Download Draft Log
      </button>
    </div>
    : <div />
);

export default DeckSettings;
