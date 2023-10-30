import { useState } from 'react'
import axios from 'axios'
import Update from './pages/update'

const App = () => {

  const [ file, setFile ] = useState()

  return (
    // <>
    //   <input type="file" name='file' onChange={e => setFile(e.target.files[0])}/>
    //   <button type='button' onClick={ async () => {

    //     const form = new FormData()
    //     form.append('file', file)

    //     const request = await axios.post('http://localhost:4000/upload', form, {
    //       headers: {
    //         "Content-Type": 'multipart/form-data'
    //       }
    //     })

    //     const response = await request.data

    //     console.log(response)


    //   }
    //   }> Submit </button>
    // </>

    <Update/>

  )

}

export default App