const express = require('express')
const bodyParser = require("body-parser");
const dynamic_routes = require('./routes/route');
const cookieParser = require('cookie-parser')
const cors = require("cors");
const morgan = require('morgan')
const errorhandler = require('errorhandler')
const methodOverride = require('method-override')

const app = express()
const port = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser())
app.use(morgan('combined'))
app.use(methodOverride('X-HTTP-Method-Override'))

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler({
    log: errorNotification
  }))
}

function errorNotification(err, str, req) {
  const title = 'Error in ' + req.method + ' ' + req.url

  notifier.notify({
    title: title,
    message: str
  })
}

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/events', dynamic_routes());

app.listen(port, () => console.log(`Example app listening on port ${port}!`))