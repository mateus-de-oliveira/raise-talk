const fs = require('firebase-admin')

const serviceAccount = require('./raise-talk-firebase-key.json')

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
})

const db = fs.firestore()

module.exports = db
