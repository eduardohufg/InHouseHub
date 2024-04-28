import DefaultSignup from "../layout/DefaultSignup";
import {useState} from 'react';
import { useAuth } from "../auth/AuthProvider";
import { ErrorResponse, Navigate, useNavigate } from 'react-router-dom';  
import { c } from "tar";

import { API_URL } from "../auth/constants";
import  { AuthresponseError } from "../types/types";



export default function Signup() {

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] =  useState("");

  const auth = useAuth();

  const goTo = useNavigate();

  async function handleSubmit(e: React.FormEvent <HTMLFormElement>){
    e.preventDefault();
    
    try{
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, lastname, username, password})
      });	
      
      if(response.ok){
        console.log("User created");
        setErrorResponse("");
        goTo("/login");
     }
     else{
       console.error("Failed to create user");
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
    <DefaultSignup>
      <form className="form" onSubmit={handleSubmit}>
      <h1>Signup</h1>
      {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}

      <label>Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
      <label>Lastname</label>
      <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)}/>
      <label>Username</label>
      <input type="text" value= {username} onChange={(e) => setUsername(e.target.value)} />
      <label>Password</label>
      <input type="password" value= {password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Create Account</button>
      
      </form>

    </DefaultSignup>
    

  );
}
