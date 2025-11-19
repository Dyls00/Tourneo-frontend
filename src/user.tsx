import { createContext, useContext, useReducer, useState } from "react";

type User = {
    id: string,
    name: string,
}
export const UserContext = createContext<{user : User | null,login : any,logout : any}>({user : null, login : () => {},logout : () => {}});

export function useUser() {
    return useContext(UserContext);
}
export function UserProvider({ children }: any) {

    const [user, dispatch] = useReducer(userReducer, null);

    function login(user : User){
        dispatch({type: 'login', payload: user})
    }

    function logout(){
        dispatch({type: 'logout'})
    }
    return (
        <UserContext.Provider value={{user, login,logout}}>
            {children}
        </UserContext.Provider>
    );
}

function userReducer(user: any, action: any) {
    switch (action.type) {
      case 'login':
        return action.payload
      case 'logout':
        return null;
      default:
        return user;
    }
  }