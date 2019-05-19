const path = require('path')
const { connectDb } = require(path.join(global.appRoot, 'db'))

module.exports.nameForm = function (req, res) {
  return res.sendFile(path.join(global.appRoot, 'views/secret.html'))
}

module.exports.storeName = function (req, res) {
  connectDb((client, db) => {
    const collection = db.collection('names')
    const { name = 'undefined', rank = 'ace', suit = 'hearts' } = req.body
    const card = `${rank}_of_${suit}`
    const entry = {
      name,
      card
    }
    collection.update({ name }, entry, { upsert: true }, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send('Added to database')
      }
      client.close()
    })
  })
}
