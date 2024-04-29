import { Auth } from "mongodb";
import { useContext, createContext, useState, useEffect } from "react";
import type { Authresponse, AccessTokenResponse, User } from "../types/types";
import { API_URL } from "../auth/constants";
import { t } from "tar";


interface AuthContextType {
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => {},
    saveUser: (userData: Authresponse) => {},
    getRefreshToken: () => {}

});

export function AuthProvider({ children }:  AuthContextType) {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string>("");
    const [user, setUser] = useState<User>();
    //const [refreshToken, setRefreshToken] = useState<string>("");

    useEffect(() => {}, []);


    async function requestAccessToken(refreshToken: string){
        try {
            const response = await fetch( `${API_URL}/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ${refreshToken}'
                },
                
            });

            if(response.ok){
                const json = await response.json() as AccessTokenResponse;
                if(json.error){
                    throw new Error(json.error);
                }
                return json.body.accessToken;
            }else{
                throw new Error("Failed to refresh token");
            }
        } catch (error) {
            console.error(error);
            return null;
            
        }
    }

    async function getUserInfo(accessToken: string){
        try {
            const response = await fetch( `${API_URL}/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ${accessToken}'
                },
                
            });

            if(response.ok){
                const json = await response.json();
                if(json.error){
                    throw new Error(json.error);
                }
                return json;
            }else{
                throw new Error("Failed to refresh token");
            }
        } catch (error) {
            console.error(error);
            return null;
            
        }
    }


   

    async function checkAuth(){
        if(accessToken){
            setIsAuthenticated(true);
        }else{
            const token = getRefreshToken();
            if(token){
                const newAccessToken = await requestNewAccessToken(token);

                if(newAccessToken){ 
                    const userInfo = await getUserInfo(newAccessToken);
                    if(userInfo){
                       saveSessionInfo(userInfo, newAccessToken, token);
                }

            
            }
        }   

    }
}


    function saveSessionInfo(userInfo: User, accessToken: string, refreshToken: string){
        setAccessToken(accessToken);
  

        localStorage.setItem("token", JSON.stringify(refreshToken));

        setIsAuthenticated(true);
        setUser(userInfo);
        
        
    }
    

        
    

    function getAccessToken(){ 

        return accessToken;
    }
    function getRefreshToken(): string | null{ 

        const token =  localStorage.getItem("token");
        if(token){
            const {refreshToken} = JSON.parse(token);
            return refreshToken;
        }
        else{
            return null;
        }
    }
    

    function saveUser(userData:Authresponse){
        saveSessionInfo(userData.body.user, userData.body.accessToken, userData.body.refreshToken);

    }


    
    return(<AuthContext.Provider value={{ isAuthenticated,getAccessToken, saveUser, getRefreshToken }}>
        {children}
        </AuthContext.Provider>
    );
  
}


export const useAuth = () => useContext(AuthContext);