import "react-native-gesture-handler";

import React, { useState } from "react";

import LoginScreen from "./src/screens/LoginScreen";
import ChooseRegisterScreen from "./src/screens/ChooseRegisterScreen";

import RegisterScreen from "./src/screens/RegisterScreen";
import RegisterAutonomoScreen from "./src/screens/RegisterAutonomoScreen";

import HomeScreen from "./src/screens/HomeScreen";
import HomeProfissionalScreen from "./src/screens/HomeProfissionalScreen";

import ProfileScreen from "./src/screens/ProfileScreen";

import ForgotPassword from "./src/screens/ForgotPassword";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");

  const goTo = (screen) => {
    setCurrentScreen(screen);
  };

  switch (currentScreen) {
    case "login":
      return <LoginScreen goTo={goTo} />;

    case "chooseRegister":
      return <ChooseRegisterScreen goTo={goTo} />;

    case "registerUser":
      return <RegisterScreen goTo={goTo} />;

    case "registerAutonomo":
      return <RegisterAutonomoScreen goTo={goTo} />;

    case "home":
      return <HomeScreen goTo={goTo} />;

    case "homeProfissional":
      return <HomeProfissionalScreen goTo={goTo} />;

    case "profile":
      return <ProfileScreen goTo={goTo} />;

    case "forgotPassword":
      return <ForgotPassword goTo={goTo} />;

    default:
      return <LoginScreen goTo={goTo} />;
  }
}