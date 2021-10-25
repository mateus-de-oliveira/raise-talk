/* eslint consistent-return:0 import/order:0 */

const express = require('express')
const logger = require('./logger')
const favicon = require('serve-favicon')
const path = require('path')
const rawicons = require('./rawicons')
const rawdocs = require('./rawdocs')
const argv = require('./argv')
const port = require('./port')
const setup = require('./middlewares/frontendMiddleware')
const isDev = process.env.NODE_ENV !== 'production'
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false
const { resolve } = require('path')

const db = require('./config/database')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// aux()

// const cors = require('cors')
// app.use(cors())

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
// Load material icons

//===========================================================================================
// const docRef = db.collection('users').doc('alovelace')
// async function aux() {
//
// }

app.get('/api/properties', (req, res) => {
  if (req.query.user_id) {
    db.collection('properties')
      .where('user_id', '==', req.query.user_id)
      .get()
      .then((snapshot) => {
        res.status(200).json(
          snapshot.docs.map((doc) => {
            const { title, active, created_at, updated_at } = doc.data()

            return {
              title: title,
              active: active,
              created_at: created_at,
              updated_at: updated_at,
              id: doc.id,
              ...doc.data(),
            }
          })
        )
      })
  }
})

app.get('/api/properties/:id', (req, res) => {
  db.collection('properties')
    .doc(req.params.id)
    .get()
    .then((doc) => {
      const { title, active, created_at, updated_at } = doc.data()

      res.status(200).json({
        title: title,
        active: active,
        created_at: created_at,
        updated_at: updated_at,
        id: doc.id,
        ...doc.data(),
      })
    })
})

app.post('/api/properties', async (req, res) => {
  const data = {
    created_at: new Date().toLocaleString(),
    updated_at: 'Nunca foi atualizado',
    ...req.body,
  }
  const docRef = db.collection('properties')

  const newPropertie = await docRef.add(data)
  const ref = await db
    .collection('properties')
    .doc(newPropertie.id)
    .get()

  const { title, active, created_at, updated_at } = ref.data()

  res.json({
    title: title,
    active: active,
    created_at: created_at,
    updated_at: updated_at,
    id: newPropertie.id,
    ...ref.data(),
    message: 'Imóvel cadastrado com sucesso!',
  })
})

app.put('/api/properties', (req, res) => {
  const { id } = req.body
  db.collection('properties')
    .doc(id)
    .update({
      ...req.body,
      updated_at: new Date().toLocaleString(),
    })
    .then(async () => {
      const ref = await db
        .collection('properties')
        .doc(id)
        .get()

      const { title, active, created_at, updated_at } = ref.data()

      res.json({
        title: title,
        active: active,
        created_at: created_at,
        updated_at: updated_at,
        id: id,
        ...ref.data(),
        message: 'Imóvel atualizado com sucesso!',
      })
    })
})

app.delete('/api/properties', (req, res) => {
  const { id } = req.body

  db.collection('properties')
    .doc(id)
    .delete()
    .then(() => {
      res.status(200).json({ message: 'Imóvel excluído com sucesso!' })
    })
    .catch((error) => {
      console.error('Error removing document: ', error)
    })
})

// ====================================================================================================

app.get('/api/customers', (req, res) => {
  if (req.query.user_id) {
    db.collection('customers')
      .where('user_id', '==', req.query.user_id)
      .get()
      .then((snapshot) => {
        res.status(200).json(
          snapshot.docs.map((doc) => {
            const { name, status, number, created_at } = doc.data()

            return {
              name,
              number,
              status,
              created_at,
              id: doc.id,
              ...doc.data(),
            }
          })
        )
      })
  }
})

app.get('/api/customers/analytics', (req, res) => {
  db.collection('customers')
    .get()
    .then((snapshot) => {
      let count = 1
      res.status(200).json(
        snapshot.docs.map((doc) => {
          const { name, status, number, created_at } = doc.data()
          count++
          return {
            name,
            number,
            status,
            created_at,
            id: doc.id,
            count: count,
            ...doc.data(),
          }
        })
      )
    })
})

app.post('/api/customers', async (req, res) => {
  const data = {
    created_at: new Date().toLocaleString(),
    updated_at: 'Nunca foi atualizado',
    ...req.body,
  }
  const docRef = db.collection('customers')

  const newCustomer = await docRef.add(data)

  const ref = await db
    .collection('customers')
    .doc(newCustomer.id)
    .get()

  const { name, status, number, created_at } = ref.data()

  res.json({
    name,
    number,
    status,
    created_at,
    id: newCustomer.id,
    ...ref.data(),
    message: 'Cliente cadastrado com sucesso!',
  })
})

app.put('/api/customers', (req, res) => {
  const { id } = req.body
  db.collection('customers')
    .doc(id)
    .update({
      ...req.body,
      updated_at: new Date().toLocaleString(),
    })
    .then(async () => {
      const ref = await db
        .collection('customers')
        .doc(id)
        .get()

      const { name, status, number, created_at } = ref.data()

      res.json({
        name,
        number,
        status,
        created_at,
        id: id,
        ...ref.data(),
        message: 'Cliente atualizado com sucesso!',
      })
    })
})

app.delete('/api/customers', (req, res) => {
  const { id } = req.body

  db.collection('customers')
    .doc(id)
    .delete()
    .then(() => {
      res.status(200).json({ message: 'Cliente excluído com sucesso!' })
    })
    .catch((error) => {
      console.error('Error removing document: ', error)
    })
})

// ====================================================================================================

app.get('/api/users', (req, res) => {
  db.collection('users')
    .get()
    .then((snapshot) => {
      res.status(200).json(
        snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
          }
        })
      )
    })
})

app.get('/api/users/:id', (req, res) => {
  db.collection('users')
    .doc(req.params.id)
    .get()
    .then((doc) => {
      if (doc.data())
        return res.status(200).json({
          id: doc.id,
          ...doc.data(),
        })

      return res.status(404).json({ message: 'Usuário não encontrado' })
    })
    .catch((error) => console.log(error))
})

app.post('/api/users', (req, res) => {
  const { id } = req.body

  db.collection('users')
    .doc(id)
    .set({
      ...req.body,
    })
    .then(() =>
      res.status(200).json({ message: 'Usuário cadastrado com sucesso' })
    )
    .catch((error) => console.log(error))
})

app.put('/api/users', (req, res) => {
  const { id } = req.body
  db.collection('users')
    .doc(id)
    .update({
      ...req.body,
      updated_at: new Date().toLocaleString(),
    })
    .then(() => {
      res.json({
        message: 'Usuário atualizado com sucesso!',
      })
    })
})

// ====================================================================================================
app.use('/api/icons', (req, res) => {
  res.json({
    records: [{ source: rawicons(req.query) }],
  })
})

// Load code preview
app.use('/api/docs', (req, res) => {
  res.json({
    records: [{ source: rawdocs(req.query) }],
  })
})

app.use('/', express.static('public', { etag: false }))
app.use(favicon(path.join('public', 'favicons', 'favicon.ico')))

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
})

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST
const host = customHost || null // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost'

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz' // eslint-disable-line
  res.set('Content-Encoding', 'gzip')
  next()
})

// Start your app.
console.log(process.env.PORT)

app.listen(process.env.PORT || '3000', host, async (err) => {
  if (err) {
    return logger.error(err.message)
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url
    try {
      url = await ngrok.connect(port)
    } catch (e) {
      return logger.error(e)
    }
    logger.appStarted(process.env.PORT || '3000', prettyHost, url)
  } else {
    logger.appStarted(process.env.PORT || '3000', prettyHost)
  }
})
