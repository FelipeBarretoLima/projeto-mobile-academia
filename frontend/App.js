import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import TreinoListScreen from "./src/screens/TreinoListScreen";

import UsuarioListScreen from "./src/screens/UsuarioListScreen";
import UsuarioFormScreen from "./src/screens/UsuarioFormScreen";
import { cores } from "./src/styles/cores";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="UsuarioList"
          screenOptions={{
            headerStyle: { backgroundColor: cores.cabecalho },
            headerTintColor: "#FFF",
            headerTitleStyle: { fontWeight: "700" },
          }}
        >
          <Stack.Screen
            name="UsuarioList"
            component={UsuarioListScreen}
            options={{ title: "Registro de Treinos" }}
          />
          <Stack.Screen name="UsuarioForm" component={UsuarioFormScreen} />
          <Stack.Screen
            name="TreinoList"
            component={TreinoListScreen}
            options={({ route }) => ({ title: `Treinos · ${route.params.usuario.nome}` })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}