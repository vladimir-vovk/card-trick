const path = require('path')

module.exports = function (req, res) {
  return res.sendFile(path.join(global.appRoot, 'views/index.html'))
}
