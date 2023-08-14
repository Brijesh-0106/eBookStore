import { createContext, useContext, useEffect, useState } from "react";
import Shared from "../utils/shared";
import { RoutePaths } from "../utils/enum";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const intialUserValue = {
  id: 0,
  email: "",
  firstName: "",
  lastName: "",
  roleId: 0,
  role: "",
  password: "",
};

const initialState = {
  user: intialUserValue,
  appInitialize: false,
  setUser: () => {},
  signOut: () => {},
};

export const AuthContext = createContext(initialState);

export const AuthWrapper = ({ children }) => {
  const [appInitialize, setAppInitialize] = useState(false);
  const [user, _setUser] = useState(intialUserValue);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const setUser = (user) => {
    localStorage.setItem(Shared.LocalStorageKeys.USER, JSON.stringify(user));
    _setUser(user);
  };

  useEffect(() => {
    const itemStorage =
      JSON.parse(localStorage.getItem(Shared.LocalStorageKeys.USER)) ||
      intialUserValue;

    if (!itemStorage.id) {
      navigate(`${RoutePaths.Login}`);
    }
    _setUser(itemStorage);
  }, []);

  const signOut = () => {
    setUser(intialUserValue);
    localStorage.removeItem(Shared.LocalStorageKeys.USER);
    navigate(`${RoutePaths.Login}`);
  };

  useEffect(() => {
    if (pathname === RoutePaths.Login && user.id) {
      navigate(RoutePaths.BookListing);
    }

    if (!user.id) {
      return;
    }
    const access = Shared.hasAccess(pathname, user);
    if (!access) {
      toast.warning("Sorry, you are not authorized to access this page");
      navigate(RoutePaths.BookListing);
      return;
    }
    setAppInitialize(true);
  }, [pathname, user]);

  let value = {
    user,
    setUser,
    signOut,
    appInitialize,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};