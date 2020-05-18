import React from "react";
import PropTypes from "prop-types";

import App from "./app";

/**
 * Utils offers a list of "connected" tools
 * through a "link" prop to connect to the app state
 */

export const Checkbox = ({link, text, side, onChange, ...rest}) => (
  <div>
    {side === "right" ? text : ""}
    <input
      {...rest}
      type="checkbox"
      onChange={onChange || function (e) {
        App.save(link, e.currentTarget.checked);
      }}
      checked={App.state[link]}/>
    {side === "left" ? text : ""}
  </div>
);

Checkbox.propTypes = {
  link: PropTypes.string,
  text: PropTypes.string,
  side: PropTypes.string,
  onChange: PropTypes.func
};

export const Spaced = ({elements}) => (
  elements
    .map((x, index) => <span key={index}>{x}</span>)
    .reduce((prev, curr) => [
      prev,
      <span key = {prev+curr} className = 'spacer-dot' />,
      curr
    ])
);

export const Select = ({
  link,
  opts,
  onChange = (e) => { App.save(link, e.currentTarget.value); },
  value = App.state[link],
  ...rest}) => (
  <select
    onChange={onChange}
    value={value}
    {...rest}>
    {opts.map((opt, index) =>
      <option key={index}>{opt}</option>
    )}
  </select>
);

Select.propTypes = {
  link: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
  opts: PropTypes.array
};

export const Textarea = ({link, ...rest}) => (
  <textarea
    style={ {"overflowY": "scroll", "height": "150px"}}
    onChange=
      { (e) => { App.save(link, e.currentTarget.value); } }
    value={App.state[link]}
    {...rest} />
);

Textarea.propTypes = {
  link: PropTypes.string
};

//TODO: check if lodash can do it
export const toTitleCase = (string="", separator=" ") =>
  string.split(separator)
    .reduce((result, word) => `${result} ${word.charAt(0).toUpperCase()+word.slice(1).toLowerCase()}`, "");

    
export function eventIdOptions() {
  const today = new Date()
  const year = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(today)
  const mon = new Intl.DateTimeFormat('en', { month: 'short' }).format(today).toLowerCase()
  const da = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(today)
  const dateStr = `${da}${mon}${year}`
  const prizeTypes = ['qp', 'ranked', 'casual']
  const cubeTypes = ['powered', 'interactive']

  const retVals = []
  for (const pt of prizeTypes) {
    for (const ct of cubeTypes) {
      retVals.push(`${pt}-${ct}-${dateStr}`)
    }
  }

  retVals.push(`casual-other-${dateStr}`)
  return retVals
}