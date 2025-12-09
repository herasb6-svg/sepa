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

export const getEmpleados = async (limit: number = 20, page: number = 1): Promise<Empleado[]> => {
  try {
    console.log(`Haciendo petición a ${ENDPOINT}?page=${page}&limit=${limit}`);
    
    // Agregar timeout para evitar que la petición se quede colgada
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos

    const response = await api.get(ENDPOINT, {
      params: {
        page,
        limit
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log(`Respuesta de API - Página ${page}, Mostrando ${limit} empleados:`, response.data);
    
    // La API devuelve directamente el array de empleados
    if (Array.isArray(response.data)) {
      console.log('Empleados recibidos:', response.data.length);
      return response.data;
    }
    
    // Si no es un array, verificar si hay una propiedad 'data' que contenga el array
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const empleados = response.data.data || [];
      console.log('Empleados extraídos de data:', empleados.length);
      return empleados;
    }
    
    console.log('Formato de respuesta inesperado, devolviendo array vacío');
    return [];
  } catch (error: unknown) {
    console.error('Error fetching empleados:', error);
    
    // Manejo seguro del error
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: any, status?: number } };
      console.log('Response data:', axiosError.response?.data);
      console.log('Response status:', axiosError.response?.status);
    }
    
    // Si es un error de timeout, indicarlo específicamente
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('La petición excedió el tiempo límite (30 segundos)');
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


export const deleteEmpleado = async (id: number): Promise<void> => {
  try {
    await api.delete(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error('Error deleting empleado:', error);
    throw error;
  }
};
