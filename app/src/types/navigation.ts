import { Empleado } from '../screens/empleados/EmpleadosScreen';

export type RootStackParamList = {
  Empleados: undefined;
  NuevoEmpleado: undefined;
  EditarEmpleado: { empleado: Empleado };
  DetalleEmpleado: { empleado: Empleado };
  // Add other screens here as needed
};

// This allows type checking for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
