import React, { useEffect, useState } from 'react';

import DefaultHome from "../layout/DefaultHome";
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from 'react-router-dom';
import { API_URL } from "../auth/constants";
import Axios from 'axios';

export default function Home() {
    const auth = useAuth();
    const [data, setData] = useState("");

    const getMosquitto = async () => {
        try {
            const response = await Axios.get(`${API_URL}/mqtt_manager`);
            setData(response.data);
            console.log(response);
            
        } catch (error) {
            console.error("Error fetching data:", error);
            setData("Error fetching data");
        }
    }

    useEffect(() => {
        getMosquitto();  // Llamar una vez cuando el componente se monta
        const intervalId = setInterval(getMosquitto, 1000);  // Llamar cada 5000 ms (5 segundos)

        return () => clearInterval(intervalId);  // Limpiar el intervalo cuando el componente se desmonte
    }, []);

    if (auth.isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <DefaultHome>
            <h1>Aquí debe de ir toda la información y documentación del proyecto</h1>
            <div>{data}</div>
        </DefaultHome>
    );
}

