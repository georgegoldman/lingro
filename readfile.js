exports.readFile = function (f) {
    const fs = require('fs')
    var text = fs.readFileSync(f);
    var fToString = text.toString()
    return fToString
}