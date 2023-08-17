import { BrowserRouter } from "react-router-dom";

import AppWrapper from "./components/global/AppWrapper";
import Navbar from "./components/global/Navbar";
import SearchBar from "./components/global/SearchBar";
import Footer from "./components/global/Footer";

import "./App.css";
import "./assets/css/style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loader from "./assets/images/loader.gif";

import MainNavigation from "./components/global/MainNavigation";
import { AuthWrapper } from "./context/auth";
const App = () => {
  return (
    <BrowserRouter>
      <AuthWrapper>
        <div className="loader-wrapper">
          <img src={loader} alt="loader" />
        </div>
        <AppWrapper>
          <Navbar />
          <SearchBar />
          <MainNavigation />
          <ToastContainer />
          <Footer />
        </AppWrapper>
      </AuthWrapper>
    </BrowserRouter>
  );
};

export default App;