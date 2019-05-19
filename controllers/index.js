const path = require('path')

export default function index (req, res) {
  return res.sendFile(path.join(global.appRoot, 'views/index.html'))
}
