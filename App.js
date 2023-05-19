import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IntroScreen from "./pages/intro_screen";
import HomeScreen from "./pages/home_screen";
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator();
function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="black" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
