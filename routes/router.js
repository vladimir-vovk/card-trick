const index = require('../controllers/index')
const checkName = require('../controllers/checkName')
const { nameForm, storeName } = require('../controllers/secret')
const deleteAll = require('../controllers/deleteAll')

module.exports = function (app) {
  app.get('/', index)
  app.get('/secret', nameForm)
  app.post('/secret', storeName)
  app.post('/check-name', checkName)
  app.get('/delete-all', deleteAll)

  /* Redirect to root by default */
  app.get('*', (req, res) => {
    res.redirect('/')
  })
}
