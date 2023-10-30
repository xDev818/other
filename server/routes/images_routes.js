// Jinshin
// Packages
const { Router, response } = require('express')
const jwt = require('jsonwebtoken')
const mysql = require('../database')
const fileUpload = require('express-fileupload')

const extentions = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']

const router = Router()

router.use(fileUpload())

router.put('/users/update/image/:id',

   ( request, response ) => {

      const { id } = request.params

      if ( !id || id.length !== 36 ) return response.status(400).send(
         {
               message: "Unable to update, Invalid ID"
         }
      )

      const checkUser = "select tblusers.userDisplayID from tblusers where userDisplayID = ?"

      mysql.query( checkUser, [ id ], ( err, result ) => {

         if ( err ) return response.status(400).send(
               {
                  message: "An error has accured, unable to update"
               }
         )

         if ( !result.length ) return response.send(
               {
                  message: "Unable to update, This account is no longer existed"
               }
         )

      })

      const files = request.files

      if ( !files ) {

         const stmt = "SELECT userDisplayID, displayName, firstname, lastname, email, imgFilename, isRegister, categoryName as userRole, tbldepartments.departmentDisplayID, departmentName FROM tblUsers inner join tblusercategory on groupTypeID = categoryID inner join tblPositions on positionDisplayID = positionID inner join tblDepartments on tbldepartments.departmentDisplayID = tblpositions.departmentDisplayID where userDisplayID = ?"

         mysql.query( stmt, [ id ], ( err, result ) => {

            if( err || !result.length ) return response.status(404).send(
                  {
                     message: "No Record Found",
                     message2: err
                  }
            )

            const { isRegister } = result[0]
      
            // const token = jwt.sign( { result }, process.env.SECRET, { expiresIn: '1d' }  )
      
            response.status(201).send(
               {
                  message: "User profile updated successfully",
                  result,
                  isRegister,
                  // token
               }
            )
      
         })

         return

      }

      const file = files.file
      const type = file.mimetype
      const name = file.name
      const newName = Date.now() + name

      if ( !extentions.filter( ex => ex === type ).length ) return response.status(400).send(
         {
            message: `Only 'png', 'jpg', 'jpeg', 'webp' are allowed. This ${type} is not allowed`,
            data: {
               allowed: "png, jpg, jpeg, webp",
               notAllowed: type
            }
         }
      )

      file.mv(`../server/static/images/${newName}`, err => {

         if ( err ) return response.status(400).send(
            {
               message: "Failed to updated the user's profile",
               err
            }
         )

         const registered = '0'

         const updateUser = "update tblusers set imgFilename = ?, isRegister = ? where userDisplayID = ?"

         mysql.query( updateUser, [ newName, registered, id ], ( err, updateResult ) => {

            if ( err ) return response.status(400).send(
               {
                  message: "An error has occurred. Failed to update user's profile image",
                  err
               }
            )

            const stmt = "SELECT userDisplayID, displayName, firstname, lastname, email, imgFilename, isRegister, categoryName as userRole, tbldepartments.departmentDisplayID, departmentName FROM tblUsers inner join tblusercategory on groupTypeID = categoryID inner join tblPositions on positionDisplayID = positionID inner join tblDepartments on tbldepartments.departmentDisplayID = tblpositions.departmentDisplayID where userDisplayID = ?"

            mysql.query( stmt, [ id ], ( err, result ) => {

               if( err || !result.length ) return response.status(404).send(
                     {
                        message: "No Record Found",
                        message2: err
                     }
               )

               const { isRegister } = result[0]
         
               // const token = jwt.sign( { result }, process.env.SECRET, { expiresIn: '1d' }  )
         
               response.status(201).send(
                  {
                     message: "User profile updated successfully",
                     result,
                     isRegister,
                     // token
                  }
               )
         
            })

         })

      })

   }

)

module.exports = router