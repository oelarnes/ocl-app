/*global BUILD_DATE*/
import React from "react";
import PropTypes from "prop-types";

const Version = ({version, MTGJSONVersion}) => {
  return (
    <p>Using <a href="https://www.mtgjson.com">MTGJSON</a> {" "}
      card data {" "}
      <a href={`https://mtgjson.com/changelog/#_${MTGJSONVersion.version.replace(/\./g, "-")}`}>
        v{MTGJSONVersion.version}
      </a> ({MTGJSONVersion.date})
    </p>
  );
};

Version.propTypes = {
  MTGJSONVersion: PropTypes.object
};

export default Version;
