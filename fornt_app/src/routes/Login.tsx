export default function Login() {
  return(
    <form>
      <h1>Login</h1>
      <label>Username</label>
      <input type="text" name="username" required />
      <label>Password</label>
      <input type="password" name="password" required />
      <button type="submit">Login</button>
      
      </form>

  );
}
