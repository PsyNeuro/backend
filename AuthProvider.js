import { useContext, createContext } from "react";
const AuthContext = createContext(); // auth context manages user state

// auth provider for consuming the content of our context
// provides context to its child componetns using auth context provider
const AuthProvider = ({ children }) => {
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
