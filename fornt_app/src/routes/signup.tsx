import DefaultSignup from "../layout/DefaultSignup";
import {useState} from 'react';


export default function Signup() {

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");



  return(
    <DefaultSignup>
      <form className="form">
      <h1>Signup</h1>
      <label>Name</label>
      <input type="text" value={name} name="name" required onChange={(e) => setName(e.target.value)}/>
      <label>Lastname</label>
      <input type="text" value={lastname} name="lastname" required onChange={(e) => setLastname(e.target.value)}/>
      <label>Username</label>
      <input type="text" value= {username} name="username" required onChange={(e) => setUsername(e.target.value)} />
      <label>Password</label>
      <input type="password" value= {password} name="password" required onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Create Account</button>
      
      </form>

    </DefaultSignup>
    

  );
}
