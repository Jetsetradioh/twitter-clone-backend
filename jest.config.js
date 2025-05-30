export default {
  testEnvironment: "node",
  transform: {}, // förhindra att Jest försöker använda Babel
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // fix för imports med filändelser
  },
};
