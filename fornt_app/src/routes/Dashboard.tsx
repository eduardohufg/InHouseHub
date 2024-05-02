import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import { API_URL } from "../auth/constants";
import { u } from "tar";
import { useEffect } from "react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}


export default function Dashboard() {
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const auth = useAuth();

  useEffect(() => {loadTodos();}, []);

  async function loadTodos() {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        headers: {
          'Authorization': `Bearer ${auth.getAccessToken()}`,
          'Content-Type': 'application/json',
        }
      
      });

      if(response.ok){

        const json = await response.json();
        setTodos(json);
      }else{
        throw new Error("Failed to load todos");
      
      }
      const data = await response.json();
      setTodos(data);      
    } catch (error) {
      
    }
    
  }




  return <div> DASHBOARD de {auth.getUser()?.name || ""}
          {todos.map((todo) => (<div>{todo.title}</div>))}
  </div>;
}