import DefaultHome from "../layout/DefaultHome"
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from 'react-router-dom';


export default function Home() {

    const auth = useAuth();

    if(auth.isAuthenticated){
      return <Navigate to="/dashboard" />;
    }
    return(
        <DefaultHome>
        
            <h1>Aqui debe de ir toda la informacion y documentacion del proyecto</h1>

        
        </DefaultHome>
       
    );
}
