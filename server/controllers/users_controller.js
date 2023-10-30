/* 

    Date : 10 / 13 / 23
    Author : Jinshin
    Activities
    Purpose : 
      JWT is added: To update your node_modules, simple type in the terminal " npm install " to automatically install jsonwebtoken
      imported = const jwt = require('jsonwebtoken')
      Initialized: const token = jwt.sign( { result }, process.env.SECRET, { expiresIn: '7d' }  )
      Note: Add SECRET in the env file. ( e.g: SECRET = 1234 ) output = process.env.SECRET

------------------

    Date : 10 / 14 / 23
    Author : Jinshin
    Activities
    Purpose : 
      bcryptjs is added:
      imported: compare password = const { compare_password } = require('../utils/password_helper')
   
------------------      

      Date : 10 / 16 / 23
    Author : Jinshin
    Activities
    Purpose : 
      Added:
          - verifyUserToken

*/


// Packages
const mysql = require('../database')
const jwt = require('jsonwebtoken')
// const { randomUUID } = require('crypto')
// const { compare_password, hash_password } = require('../utils/password_helper')


// Date helper
// const { utils_getDate } = require('../utils/date_helper')

// An instance to register a new user
const createUser = ( request, response ) => {

    const id = randomUUID() 
    const { username, email, password , positionID, categoryID } = request.body

    if( !username ) return response.status(400).send( { message: "Username is required" } )

    const stmt = "INSERT INTO tblUsers(userDisplayID,username,email,password,displayName,positionID,groupTypeID,isRegister,dateCreated) values (?)";
    const display = "Set your Display Name"
    const iRegister = '1'
    const values = [
        id,
        username,
        email,
        password,
        display,
        positionID,
        categoryID,
        iRegister,
        utils_getDate()
    ];
    
    mysql.query( stmt, [values], ( err, result ) => {

        if( err ) return response.status(400).send(
            {
                message: "Insert Error",
                message2: err.message
            }
        )
        
        response.status(200).send(
            {
                message: "Insert Success"
            }
        )

    })

}

// An Instance to logged a user in
const loginUser = ( request, response ) => {

    const { username, password } = request.body

    const checkUser = "select password from tblusers where username = ?"

    mysql.query( checkUser, [ username ], ( err, result ) => {
        
        if( err || !result.length ) return response.status(404).send(
            {
                message: "No Record Found",
                message2: err
            }
        )
 
        const isValid = compare_password( password, result[0].password )

        if( !isValid ) return response.status(400).send(
            {
                message: "Password is incorrect"
            }
        )

        const stmt = "SELECT users.userDisplayID,users.displayName, users.firstname, users.lastname,"
        + "users.email,users.imgFilename,userCategory.categoryName as userRole,department.departmentDisplayID,"
        + "department.departmentName,users.positionID, users.isRegister FROM tblUsers users"
        + " inner join tblUserCategory userCategory on users.groupTypeID = userCategory.categoryID"
        + " inner join tblPositions positions on positions.positionDisplayID = users.positionID"
        + " inner join tblDepartments department on department.departmentDisplayID = positions.departmentDisplayID"
        + " where users.username = ? and users.password = ? and users.active=1"

        mysql.query( stmt, [ username, result[0].password ], ( err, result ) => {

            if( err || !result.length ) return response.status(404).send(
                {
                    message: "No Record Found",
                    message2: err
                }
            )

            const { isRegister } = result[0]
    
            const token = jwt.sign( { result }, process.env.SECRET, { expiresIn: '1d' }  )
    
            response.status(200).send(
                {
                    message: "Record Found",
                    isRegister,
                    token
                }
            )
    
        })

    })

}


const verifyUserToken = ( request, response, next ) => {

    const { token } = request.body

    if( !token ) return response.status(401).send(
        {
            message: "Invalid token"
        }
    )

    try {
        
        const isValid = jwt.verify( token, process.env.SECRET )

        response.status(200).send("Token is valid")

        next()

    } catch (error) {

        if( error.name.includes("JsonWebTokenError") ) return response.status(400).send(
            {
                message: "Token Is Invalid",
                error
            }
        )

        if( error.name.includes("TokenExpiredError") ) return response.status(400).send(
            {
                message: "Token Is Expired",
                error
            }
        )

    }

}

const verifyUsername = ( request, response ) => {

    const { values } = request.body

    const stmt = "SELECT username FROM tblusers WHERE username = ?"

    mysql.query( stmt, [ values ], ( err, result ) => {

        if ( err ) return response.status(400).send(
            {
                message: "An Error Occured",
                err
            }
        )

        if( result.length > 0 ) return response.status(409).send(
            {
                message: "Username is already taken"
            }
        )

        response.status(200).send(
            {
                message: "Username is available"
            }
        )

    })

}

const verifyEmail = ( request, response ) => {

    const { values } = request.body

    const stmt = "SELECT email FROM tblusers WHERE email = ?"

    mysql.query( stmt, [ values ], ( err, result ) => {

        if ( err ) return response.status(400).send(
            {
                message: "An Error Occured",
                err
            }
        )

        if( result.length > 0 ) return response.status(409).send(
            {
                message: "Email is already taken"
            }
        )

        response.status(200).send(
            {
                message: "Email is available"
            }
        )

    })

}

// An Instance to get all the users
const getAllUsers = ( request, response ) => {

    const stmt = "SELECT users.userDisplayID as id,usercategory.categoryName,positions.positionName,"
    + "concat(users.lastname,', ' , users.firstname) as fullname,department.departmentName,"
    + "users.displayName,users.email,users.active"
    + " FROM tblUsers users"
    + " INNER JOIN tblUserCategory usercategory on usercategory.categoryID COLLATE utf8mb4_unicode_ci = users.groupTypeID"
    + " INNER JOIN tblPositions positions on positions.positionDisplayID COLLATE utf8mb4_unicode_ci = users.positionID"
    + " INNER JOIN tblDepartments department on department.departmentDisplayID COLLATE utf8mb4_unicode_ci = positions.departmentDisplayID"
    + " where users.active = 1"
    + " ORDER BY fullname"

    mysql.query( stmt, [], ( err,result ) => {

        if( err || !result.length ) return response.status(404).send(
            {
                message: "No Records Found",
                message2: err.message
            }
        )

        response.status(200).send(
            {
                message: "Records Found",
                result
            }
        )

    })

}

// An Instance to get all the users by lastname
const getAllUsersByLastname = ( request, response ) => {

    const stmt = "SELECT * FROM tblUsers ORDER BY lastname";

    mysql.query( stmt, [], ( err, result ) => {

        if( err ) return response.status(400).send(
            {
                message: "No Record Found",
                message2: err.message
            }
        )

        response.status(200).send(
            {
                message: "Records Found",
                result
            }
        )

    })

}

// An Instance to get users by active
const getUserByActive = ( request, response ) => {

    const stmt = "SELECT userDisplayID, concat(lastname,', ' , firstname) as fullname FROM tblUsers where active = 1";

    mysql.query( stmt, [], ( err, result) => {

        if( err || !result.length ) return response.status(404).send(
            {
                message: "No Record Found",
                message2: err.message
            }
        )

        response.status(200).send(
            {
                message: "Record Found",
                result
            }
        )

    })

}

// An Instance to get a user's profile
const getUserProfile = ( request, response ) => {


    const { id } = request.params

    const stmt = "SELECT groupTypeID, categoryName, positionID, firstname, lastname, displayName, email, imgFilename FROM tblUsers INNER JOIN tblUserCategory ON groupTypeID = categoryID WHERE userDisplayID = ?";

    mysql.query( stmt, [ id ], ( err, result ) => {
        
        if( err || !result.length ) return response.status(404).send(
            {
                message: "No Profile Found",
                message2: err
            }
        )

        response.status(200).send(
            {
                message: "Profile Found",
                result
            }
        )

    })

}

// An Intance to update a user
const updateUserProfile = ( request, response ) => {

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

        const { firstname, lastname, email, user_group, position, } = request.body

        const userCategory = "select categoryID from tblusercategory where categoryName = ?"

        mysql.query( userCategory, [ user_group ], ( err, userCategoryResult ) => {

            if ( err ) return response.status(400).send(
                {
                    message: "An error has accured, unable to get user category"
                }
            )
    
            if ( !userCategoryResult.length ) return response.send(
                {
                    message: "This user category is not existed"
                }
            )
            
            const { categoryID } = userCategoryResult[0]

            const positionsCategory = "select positionDisplayID from tblpositions where positionName = ?"

            mysql.query( positionsCategory, [ position ], ( err, positionResult ) => {

                if ( err ) return response.status(400).send(
                    {
                        message: "An error has accured, unable to get positions data"
                    }
                )
        
                if ( !positionResult.length ) return response.send(
                    {
                        message: "This position is not existed"
                    }
                )

                const { positionDisplayID } = positionResult[0]

                const updateUser = "update tblusers set positionID = ?, groupTypeID = ?, firstname = ?, lastname = ?, email = ?, isRegister = ? where userDisplayID = ?"
    
                mysql.query( updateUser, [ positionDisplayID, categoryID, firstname, lastname, email, '0', id ], ( err, result ) => {
    
                    if ( err ) return response.status(400).send(
                        {
                            message: "An error has accured, unable to update",
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
                                message: "Updated Successfully",
                                result,
                                isRegister,
                                // token
                            }
                        )
                
                    })
    
                })

            })

        })

    })
    
}

// An Instance to delete an old user data by ID
const deleteOldUserById = ( request, response ) => {

    const { irowSelectedID } = request.params

    const stmt = "UPDATE tblUsers SET active = 0 where userDisplayID = ?"

    mysql.query( stmt, [ irowSelectedID ], ( err, result ) => {

        if( err || !result.changedRows ) return response.status(404).send(
            {
                message: "No Record Deactivated",
                message2: err.message
            }
        )

        response.status(200).send(
            {
                message: "Record Deactivated"
            }
        )

     })

}

// An Instance to delete all the old users data
const deleteAllOldUsers = ( request, response ) => {

    const { rowId } = request.body

    const stmt = "SELECT * FROM tblUserAssetDetails details"
    + " inner join tblAssetStatus stat on stat.assetStatusID COLLATE utf8mb4_unicode_ci = details.assetStatusID"
    + " where (stat.statusName = 'Deployed' or stat.statusName = 'For Deploy') "
    + " and details.userSelectedID = ?"

    mysql.query( stmt, [ rowId ], (err,result) => {

        if( err || !result.length ) return response.status(404).send(
            {
                message: "No Record Found",
                message2: err.message
            }
        )

        response.status(200).send(
            {
                message: "Record Found",
                result
            }
        )

     })

}




module.exports = {
    createUser,
    loginUser,
    verifyUserToken,
    verifyUsername,
    verifyEmail,
    getAllUsers,
    getAllUsersByLastname,
    getUserByActive,
    getUserProfile,
    updateUserProfile,
    deleteOldUserById,
    deleteAllOldUsers
}