import DefaultL from "../layout/DefaultL"
import {useState} from 'react';

export default function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return(
    <DefaultL>
      <form className="form">
      <h1>Login</h1>
      <label>Username</label>
      <input type="text" value= {username} name="username" required onChange={(e) => setUsername(e.target.value)} />
      <label>Password</label>
      <input type="password" value= {password} name="password" required onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      
      </form>

    </DefaultL>
    

  );
}
