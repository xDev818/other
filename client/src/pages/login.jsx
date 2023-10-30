import { useState } from "react"
import axios from 'axios'

const Login = () => {
   
   const [ file, setFile ] = useState('')

   const buttonHandler = async () => {

      let fd = ''

      if ( file ) {

         fd = new FormData()
         fd.append('files', file)

      } else {

         fd = 'No File'

      }

      const request = await axios.post('http://localhost:4000/api/test', fd, {
         headers: {
            "Content-Type": "multipart/form-data"
         }
      })

      const response = await request.data

      console.log(response)

   }

   return (
      <form>
         <h2> LOGIN </h2>
         <input type="text" placeholder="Username or email" />
         <input type="password" placeholder="Password..." />
         <input type="file" name="file" placeholder="File" onChange={(e) => setFile( e.target.files[0] )}/>
         <button type="button" onClick={buttonHandler}> LOGIN </button>
      </form>
   )

}

export default Login