import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import { API_URL } from "../auth/constants";
import { u } from "tar";
import { useEffect } from "react";
import PortalLayout from "../layout/PortalLayout";
//import Player from "@madzadev/audio-player";
import "@madzadev/audio-player/dist/index.css";
import Player1 from "./player";


interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  idUser: string;
}


export default function Dashboard() {
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const auth = useAuth();
  const [title, setTitle] = useState("");

  useEffect(() => {loadTodos();}, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    createTodo();
  }

  async function createTodo(){
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({title})
      });

      if(response.ok){
        const json = await response.json();
        setTodos([json, ...todos]);

      }else{
        throw new Error("Failed to create todo");
      }
    } catch (error) {
      console.error(error);
    }
  }

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




  return (<PortalLayout>
            <h1>Dasboard de {auth.getUser()?.name || ""}</h1>
              <form onSubmit={handleSubmit}>
                <input type="text" 
                placeholder="nuevo todo" 
                onChange={(e) => setTitle(e.target.value)} 
                value = {title}/>
              </form>
              
              

              
              


            {todos.map((todo) => (<div key = {todo._id}>{todo.title}</div>))}4
            <Player1 />
        </PortalLayout>

  );
}