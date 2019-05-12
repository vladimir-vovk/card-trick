const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const URI = process.env.MONGODB_URI || 'mongodb://localhost/database'
const PORT = process.env.PORT || 5000
const DB_NAME = process.env.DB_NAME || 'card_trick'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/secret', (req, res) => {
  return res.sendFile(path.join(__dirname, 'secret.html'))
})

app.post('/secret', (req, res) => {
  MongoClient.connect(URI, { useNewUrlParser: true }, (err, client) => {
    if (err) {
      console.log(err)
      return
    }

    const db = client.db(DB_NAME)
    const collection = db.collection('names')
    const { name = 'undefined', rank = 'ace', suit = 'hearts' } = req.body
    const card = `${rank}_of_${suit}`
    const entry = {
      name,
      card
    }
    collection.insertOne(entry, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send('Added to database')
      }
      client.close()
    })
  })
})

app.get('/:param*', (req, res) => {
  console.log(req.url)
  const name = req.url.slice(1).toLowerCase()
  MongoClient.connect(URI, { useNewUrlParser: true }, (err, client) => {
    if (err) {
      console.log(err)
    } else {
      const db = client.db(DB_NAME)
      const collection = db.collection('names')

      if (name === 'deleteall') {
        collection.remove({})
        client.close()
        res.send('database reset')
      } else {
        collection.find({ name }).toArray((err, result) => {
          if (err) {
            console.log(err)
          } else if (result.length) {
            const card = result[0].card
            res.sendFile(path.join(__dirname, `assets/images/cards/${card}.png`))
          } else {
            res.sendStatus(404)
          }
          client.close()
        })
      }
    }
  })
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
