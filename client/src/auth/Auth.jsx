import Login from "../pages/login"
import Profile from "../pages/profile"


const Auth = () => {

   const userStatus = true

   return userStatus === false ? <Profile/> : <Login/>

}

export default Auth