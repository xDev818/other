require('dotenv').config()
const express = require('express')
const formData = require('express-form-data')
const cors = require('cors')
const fileUpload = require('express-fileupload')

const userRoutes = require('./routes/users_routes')
const imageRoutes = require('./routes/images_routes')

const app = express()

app.listen(4000, console.log("Server is running at port 4000"))

app.use(express.json())
app.use(cors(
   {
      origin : "*"
   }
))

app.use('/file', express.static('./static'))

app.use('/api', imageRoutes)
app.use('/api', userRoutes)