import './App.css';
import Dashboard from './Dashboard/Dashboard';
import Form from "./components/Form"
import {Navigate, Route, Routes} from "react-router-dom";

const ProtectedRoutes=({children,auth=false})=>{
const isloggedIn=localStorage.getItem('user:token') ;
if(!isloggedIn && auth) {
  return <Navigate to={"/users/signin"}/>
}
else if(isloggedIn && ['/users/signin','/users/signup'].includes(window.location.pathname)){
return <Navigate to={"/"}/> }
return children
}
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={
      <ProtectedRoutes auth={true}>
        <Dashboard/>
      </ProtectedRoutes>}/>
      <Route  exact path="/users/signin" element={
      <ProtectedRoutes>
      <Form isSigninPage={true}/>
    </ProtectedRoutes>}/>
      <Route  exact path="/users/signup" element={
      <ProtectedRoutes>
      <Form isSigninPage={false}/>
    </ProtectedRoutes>}/>
      </Routes>
      </>
  );
}

export default App;
