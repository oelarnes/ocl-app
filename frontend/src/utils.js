const capitalize = require("lodash/capitalize");

const toTitleCase = (sentence, separator=" ") => {
  if (!sentence || typeof sentence !== "string") {
    return "";
  }

  const words = sentence.split(separator);
  const capitalized = words.map(capitalize);
  return capitalized.join(separator);
};

function eventIdOptions() {
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

module.exports = {
  toTitleCase,
  eventIdOptions
};
