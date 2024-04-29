import DefaultL from "../layout/DefaultL"
import {useState} from 'react';
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from 'react-router-dom';
import { API_URL } from "../auth/constants";
import type { Authresponse, AuthresponseError } from "../types/types";


export default function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorResponse, setErrorResponse] =  useState("");

  const auth = useAuth();

  const goTo = useNavigate();


  async function handleSubmit(e: React.FormEvent <HTMLFormElement>){
    e.preventDefault();
    
    try{
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
      });	
      
      if(response.ok){
        console.log("Logged in successfully");
        setErrorResponse("");
        const json = (await response.json()) as Authresponse;

        if(json.body.accessToken && json.body.refreshToken){
          auth.saveUser(json);
          goTo("/dashboard");
        }


        //goTo("/login");
     }
     else{
       console.error("Failed to login");
       const json = (await response.json()) as AuthresponseError;
       setErrorResponse(json.body.error);
     }
  }

  catch(err){
    console.log(err);
  }
  }

  if(auth.isAuthenticated){
    return <Navigate to="/dashboard" />;
  }



  return(
    <DefaultL>
      <form className="form" onSubmit={handleSubmit}>
      <h1>Login</h1>
      {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
      <label>Username</label>
      <input type="text" value= {username} onChange={(e) => setUsername(e.target.value)} />
      <label>Password</label>
      <input type="password" value= {password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      
      </form>

    </DefaultL>
    

  );
}
