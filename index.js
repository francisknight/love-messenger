import express from 'express'
import bodyParser from 'body-parser'
import sha1 from 'sha1'
import auth from './lib/auth.js'

const PORT = process.env.PORT || 8080
const SALT = process.env.SALT || 'def456'
const API_KEY = process.env.API_KEY || sha1(`${SALT}abc123`)
const app = express()

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const givenApiKey = req.query['api-key']
  const authorized = auth({
    given: givenApiKey,
    expected: API_KEY,
    salt: SALT
  })

  if (authorized) {
    next()
  } else {
    res.status(401)
    res.send('Invalid API key')
  }
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(authMiddleware)

// POST message
app.post('/message', (req, res) => {
  res.status(202)
  res.send('send message')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
