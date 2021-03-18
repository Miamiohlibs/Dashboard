const percEncode = require('percentage-encode-char');

module.exports = class PercentEncodeString {
  encodeString(str) {
    return str
      .split('')
      .map((x) => percEncode(x))
      .join('');
  }

  encodeEmail(email) {
    return email
      .split('')
      .map(function (x) {
        if (x.match(/[a-zA-Z0-9]/)) {
          return percEncode(x);
        } else {
          return x;
        }
      })
      .join('');
  }
};
