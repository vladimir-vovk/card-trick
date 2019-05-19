const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const URI = process.env.MONGODB_URI || 'mongodb://localhost/database'
const DB_NAME = process.env.DB_NAME || 'card_trick'

export function connectDb (callback) {
  MongoClient.connect(URI, { useNewUrlParser: true }, (err, client) => {
    if (err) {
      console.log(err)
      return
    }

    const db = client.db(DB_NAME)
    callback(client, db)
  })
}
