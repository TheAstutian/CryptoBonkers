"use client"

import {createContext, useState, useEffect, useContext, ReactNode} from 'react'; 

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL as string 
type User = {
    username: string
    email: string
    image?: string
    link: string 
}
interface LoginResponse {
    data?: User; 
    message?: string; 
}
interface UserContextType {
    currentUser: User | null; // user
    isLoading: boolean; 
    logout: () => void;
    login: ({email, password}: {email: string; password: string}) => Promise<LoginResponse>; 
 }

export const userContext = createContext<UserContextType | undefined>(undefined); 
interface UserContextProviderProps{
    children: ReactNode;
}

const API_LOGIN_ENDPOINT = /*process.env.NEXT_PUBLIC_API_URL + '/auth/user/login' || */ `${WEB_URL}/api/auth/user/login`;


export function UserContextProvider ({ children }: any) {

    const [currentUser, setCurrentUser] = useState <User | null> ( null)
    const [isLoading, setIsLoading] = useState (true)
    

    // const [name, setName] = useState('John Doe')


    useEffect(()=>{
        setIsLoading(true)
        if (typeof window !== 'undefined' && window.localStorage){
            const storedUser = localStorage.getItem('user')
            //console.log('effect from context', storedUser)
            if(storedUser){
                try{
                    const userObject: User = JSON.parse(storedUser)
                    //console.log(storedUser, "user frostoratge")
                    setCurrentUser(userObject)
                }catch(error){
                   // console.error("Error parsing user from localstorage", error)
                    localStorage.removeItem('user')
                }
            }
    }
        setIsLoading(false)
    },[]) 
    

    const login = async ({email, password}: {email: string; password: string}) : Promise<LoginResponse> =>{
        setIsLoading(true)

        try{

            const response = await fetch (API_LOGIN_ENDPOINT, {
                method: "POST", 
                headers: {
                    'Content-Type': 'application/json', 
                }, 
                body: JSON.stringify({email, password}) 
            })
            const result : LoginResponse = await response.json()
            //console.log('this is response', response)
             if (response && result.data){
                setCurrentUser(result.data);
                if(typeof window !== 'undefined'){
                    localStorage.setItem('user', JSON.stringify(result.data))
                }
                setIsLoading(false)
                return {
                    data: result.data, message: result.message || 'Login successful'
                }
             } else {
                return { message: result.message || "Login failed. Invalid credentials or server error." };
             }

        }catch(error: any){
            console.error("Login API call error:", error);
            setIsLoading(false);
            return { message: error.message || "An unexpected error occurred during login." };
        }
          
}



    const logout = () =>{
        setCurrentUser(null)
        localStorage.removeItem('user')
        window.location.href = '/'
    }

    const contextValue: UserContextType = {
        currentUser,
        isLoading,
        logout,
        login, 
        // login, // Include login if you added it above
    };
    
return (
    <userContext.Provider value={contextValue}>{children}</userContext.Provider>
)
}


//custom hook to consume the context
/*
export function useAppContext(){
   
    const appContext = useContext(userContext)
    if (!appContext ){
        throw new Error ('useUser must be used within a UserContextProvider ')
    }
    return appContext; 
}

*/