import { createStackNavigator } from "@react-navigation/stack";
import { EmpleadoListScreen } from "../screens/empleado/EmpleadoListScreen";
import { EmpleadoFormScreen } from "../screens/empleado/EmpleadoFormScreen";

export type RootEmpleadoNavigator = {
    EmpleadoListScreen: undefined;
    EmpleadoFormScreen: { id?: string };
}

const Stack = createStackNavigator<RootEmpleadoNavigator>();

export const EmpleadoNavigator = () => {
    return(
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="EmpleadoListScreen"
                component={EmpleadoListScreen}
            />
            <Stack.Screen
                name="EmpleadoFormScreen"
                component={EmpleadoFormScreen}
            />
        </Stack.Navigator>
    )
}
