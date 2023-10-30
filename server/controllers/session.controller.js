
import { signJWT } from '../utils/jwt.utils'

import { createSession, getUser, invalidateSession } from '../db'

export function createSessionHandler ( request, response ) {

   const { email, password } = request.body

   const user = getUser(email)

   if( !user || user.password !== password ) return response.status(401).send(
      "Invalid email or password"
   )

   const session = createSession(email)

   const accessToken = signJWT(
      { email: user.email, name: user.name, sessionID: session.sessionId },
      "5s"
   )

   const refreshToken = signJWT(
      { sessionID: session.sessionId }, "1y"
   )

   request.cookie("accessToken", accessToken, 
      {
         maxAge: 300000, // 5mins
         httpOnly: true
      }
   )

   request.cookie("refreshToken", refreshToken, 
      {
         maxAge: 3.154e10, // 1yr
         httpOnly: true
      }
   )

   return response.status(200).send(session)

}

export function logoutHandler ( request, response ) {

   const { user } = request

   const session = invalidateSession( user.sessionId )

   request.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true
   })

   request.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true
   })

   response.status(200).send(session)

}

export function getSessionHandler ( request, response ) {

   return response.status(200).send( request.user )

} 