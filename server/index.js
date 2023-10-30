const express = require('express')
const cors = require('cors')
const formData = require('express-form-data')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

cloudinary.config(
   {
      cloud_name: 'dklcwytgq',
      api_key: '813378365833624',
      api_secret: 'l-swgFPKbhgs9ioniw8FlxG-Nxo',

   }
)


const app = express()

app.listen(4000, console.log("Server is running at port 4000"))

app.use(express.json())
app.use(fileUpload())
app.use(formData.union())
app.use(express.urlencoded( { extended: true } ))
app.use(cors(
   {
      origin : "*"
   }
))

app.post('/upload', ( request, response ) => {

   const file = request.files.file

   const name = `${Date.now() + file.name}`

   const comPath = `./images/${name}`

   let image_url = ''

   file.mv(comPath, ( err => {

      if ( err ) return response.status(400).send(
         {
            message: "Failed to move the file"
         }
      )

      cloudinary.uploader.upload(comPath)
      .then( res => {

         const img = res

         console.log(img)


      })
      .catch( err => console.log(err.error))

   }))



})
