const path = require('path')
const { connectDb } = require(path.join(global.appRoot, 'db'))

module.exports = function (req, res) {
  connectDb((client, db) => {
    const collection = db.collection('names')
    const { name = 'undefined' } = req.body

    collection.find({ name }).toArray((err, result) => {
      if (err) {
        console.log(err)
      } else if (result.length) {
        const card = result[0].card
        res.sendFile(path.join(global.appRoot, `public/images/cards/${card}.png`))
      } else {
        res.sendFile(path.join(global.appRoot, 'views/404.html'))
      }
      client.close()
    })
  })
}
