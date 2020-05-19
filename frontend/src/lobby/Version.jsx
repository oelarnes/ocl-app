/*global BUILD_DATE*/
import React from "react";
import PropTypes from "prop-types";

<<<<<<< HEAD
const Version = ({version, MTGJSONVersion}) => {
=======
const getLink = (version) => (
  (/^v\d+\.\d+\.\d+$/.test(version)) ?
    `releases/tag/${version}` :
    `commit/${version}`
);

const Version = ({version, MTGJSONVersion, boosterRulesVersion}) => {
>>>>>>> master
  return (
    <p>Using <a href="https://www.mtgjson.com">MTGJSON</a> {" "}
      card data {" "}
      <a href={`https://mtgjson.com/changelog/#_${MTGJSONVersion.version.replace(/\./g, "-")}`}>
        v{MTGJSONVersion.version}
      </a> ({MTGJSONVersion.date}) and <a href={"https://github.com/taw/magic-sealed-data"}>Magic Sealed Data</a> {" "}
        booster rules{" "}
      commit <a href={`https://github.com/taw/magic-sealed-data/commit/${boosterRulesVersion}`}>{boosterRulesVersion}</a>
    </p>
  );
};

Version.propTypes = {
<<<<<<< HEAD
  MTGJSONVersion: PropTypes.object
=======
  version: PropTypes.string,
  MTGJSONVersion: PropTypes.object,
  boosterRulesVersion: PropTypes.string
>>>>>>> master
};

export default Version;
