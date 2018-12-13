const express = require('express')
const dynamic_routes = require('./routes/route');

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/events', dynamic_routes());

app.listen(port, () => console.log(`Example app listening on port ${port}!`))