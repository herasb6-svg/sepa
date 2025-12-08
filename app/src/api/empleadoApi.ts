import api from './axiosConfig';

const ENDPOINT = '/empleados';

export interface Empleado {
  id_empleado: number;
  nombre: string;
  apellido_p: string;
  apellido_m: string;
  area: string;
  turno: string;
  salarioDiario: number;
  activo: boolean;
}

export const getEmpleados = async (): Promise<Empleado[]> => {
  try {
    const response = await api.get(ENDPOINT);
    // Asegurarse de que siempre devolvamos un array
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && typeof response.data === 'object') {
      // Si la respuesta es un objeto, intentar extraer un array de alguna propiedad
      const possibleArray = Object.values(response.data).find(Array.isArray);
      return possibleArray || [];
    }
    return [];
  } catch (error: unknown) {
    console.error('Error fetching empleados:', error);
    
    // Manejo seguro del error
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: any, status?: number } };
      console.log('Response data:', axiosError.response?.data);
      console.log('Response status:', axiosError.response?.status);
    }
    
    // Devolver un array vacío en caso de error para evitar que la aplicación se rompa
    return [];
  }
};

export const getEmpleadoById = async (id: number): Promise<Empleado> => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching empleado:', error);
    throw error;
  }
};

export const createEmpleado = async (empleado: Omit<Empleado, 'id_empleado'>): Promise<Empleado> => {
  try {
    const response = await api.post(ENDPOINT, empleado);
    return response.data;
  } catch (error) {
    console.error('Error creating empleado:', error);
    throw error;
  }
};

export const updateEmpleado = async (id: number, empleado: Partial<Empleado>): Promise<Empleado> => {
  try {
    const response = await api.patch(`${ENDPOINT}/${id}`, empleado);
    return response.data;
  } catch (error) {
    console.error('Error updating empleado:', error);
    throw error;
  }
};

export const deleteEmpleado = async (id: number): Promise<void> => {
  try {
    await api.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error('Error deleting empleado:', error);
    throw error;
  }
};
