import { createContext, useContext, useReducer, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email?: string;
  role?: string;
};

type UserContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

// Reducer pour gérer login/logout
function userReducer(state: User | null, action: { type: string; payload?: User }) {
  switch (action.type) {
    case "login":
      return action.payload || null;
    case "logout":
      return null;
    default:
      return state;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  
  const storedUser = typeof window !== "undefined" 
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null;

  const [user, dispatch] = useReducer(userReducer, storedUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  function login(user: User) {
    dispatch({ type: "login", payload: user });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
