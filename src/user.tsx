import { createContext, useContext, useReducer } from "react";

type User = { id: string; name: string };

type UserState = { user: User | null };

type Action =
  | { type: "login"; payload: User }
  | { type: "logout" };

function userReducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case "login":
      return { user: action.payload };
    case "logout":
      return { user: null };
    default:
      return state;
  }
}

export const UserContext = createContext<{
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: any) {
  const [state, dispatch] = useReducer(userReducer, { user: null });

  function login(user: User) {
    dispatch({ type: "login", payload: user });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <UserContext.Provider value={{ user: state.user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}