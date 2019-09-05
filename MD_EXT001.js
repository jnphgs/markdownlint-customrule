const { URL } = require("url");

module.exports = {
  "names": [ "MD_EXT001" ],
  "description": "Space should be inserted between alphabet and non-alphabet character (like Japanese).",
  "tags": [ "Custom" ],
  "function": function rule(params, onError) {
    params.lines.forEach((value, index) => {
      var match;
      var regex = /([a-zA-Z][^\x01-\x7E])|([^\x01-\x7E][a-zA-Z])/g;
      while(match = regex.exec(value)){
        onError({
          "lineNumber": index+1,
          "range": [match.index+1, 2]
        });
      }
    });
  }
};