const path = require('path')
const { connectDb } = require(path.join(global.appRoot, 'db'))

module.exports = function (req, res) {
  connectDb((client, db) => {
    const collection = db.collection('names')
    collection.remove({})
    client.close()
    res.send('database reset')
  })
}
