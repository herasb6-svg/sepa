import { createStackNavigator } from "@react-navigation/stack";
import { EmpleadoListScreen } from "../screens/empleado/EmpleadoListScreen";
import { EmpleadoFormScreen } from "../screens/empleado/EmpleadoFormScreen";
import { EmpleadoDetailScreen } from "../screens/empleado/EmpleadoDetailScreen";

export type RootEmpleadoNavigator = {
    EmpleadoListScreen: undefined;
    EmpleadoFormScreen: { id?: string };
    EmpleadoDetailScreen: { empleado: any };
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
                name="EmpleadoDetailScreen"
                component={EmpleadoDetailScreen}
            />
            <Stack.Screen
                name="EmpleadoFormScreen"
                component={EmpleadoFormScreen}
            />
        </Stack.Navigator>
    )
}
