import axios from 'axios'
import { useEffect, useState } from 'react'

const Update = () => {

   const id = 'e827a3d4-4c54-476e-bad2-6bd442734219'

   const [ data, setData ] = useState()

   const [ file, setFile ] = useState()

   const [ inputs, setInputs ] = useState(
      {
         user_group: '',
         position: '',
         firstname: '',
         lastname: '',
         email: '',
      }
   )

   const controllerInputs = ( e ) => {
      
      const name = e.target.name
      const value = e.target.value

      setInputs( ( prev ) => ( { ...prev, [name]: value } ))

   }

   const saveHandler = async () => {

      const values = {
         file: file === undefined || '' || null ? '' : file,
         user_group: inputs.user_group === '' ? data?.categoryName : inputs.user_group,
         position: inputs.position === '' ? 'HardwareTechnician' : inputs.position,
         firstname: inputs.firstname === '' ? data?.firstname : inputs.firstname,
         lastname: inputs.lastname === '' ? data?.lastname : inputs.lastname,
         email: inputs.email === '' ? data?.email : inputs.email,
      }

      const requestImg = await axios.put(`http://localhost:4000/api/users/update/image/${id}`, values, {
         headers: {
            "Content-Type": 'multipart/form-data'
         }
      })

      const responseImg  = await requestImg.data

      const request = await axios.put(`http://localhost:4000/api/users/${id}`, values, {
         headers: {
            "Content-Type": 'multipart/form-data'
         }
      })

      const response = await request.data

      console.log(response)
      console.log(responseImg)

      window.location.reload()

   }

   useEffect(() => {

      axios.get(`http://localhost:4000/api/users/${id}`)
      .then( res => setData( res.data.result[0] ))
      .catch( err => alert( err.response.data.message) )

   }, [ id ])

   return (

      <div className='update-wrapper'>

         <div className="image-wrapper">
            <img src={ data?.imgFilename === '' ? '' : `http://localhost:4000/file/images/${data?.imgFilename}` } alt="" />
            <input type="file" name='file' onChange={ e => setFile(e.target.files[0]) }/>
         </div>

         <div className="select-wrapper">
            <p> User Group </p>
            <select name="user_group" id="" onChange={ e => controllerInputs(e) }>
               <option value={ data?.categoryName }> { data?.categoryName } </option>
               <option value="User">User</option>
               <option value="IT">IT</option>
               <option value="Supplier">Supplier</option>
            </select>
         </div>

         <div className="select-wrapper">
            <p> Position </p>
            <select name="position" id="" onChange={ e => controllerInputs(e) }> 
               <option value="Sr Marketing Development">Sr Marketing Development</option>
               <option value="HardwareTechnician">HardwareTechnician</option>
               <option value="ITAdmin">ITAdmin</option>
            </select>
         </div>
         
         <label htmlFor="firstname">
            <p>Firstname</p>
            <input type="text" id="firstname" name="firstname" placeholder="Firstname..." onChange={ e => controllerInputs(e) } defaultValue={ data?.firstname }/>
         </label>
         
         <label htmlFor="lastname">
            <p>Lastname</p>
            <input type="text" id="lastname" name="lastname" placeholder="Lastname..." onChange={ e => controllerInputs(e) } defaultValue={ data?.lastname }/>
         </label>
         
         <label htmlFor="email">
            <p>Email</p>
            <input type="text" id="email" name="email" placeholder="Email..." onChange={ e => controllerInputs(e) } defaultValue={ data?.email }/>
         </label>

         <button type="button" onClick={saveHandler}>Update Profile</button>
         
      </div>

   )


}

export default Update