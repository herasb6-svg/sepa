import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StackScreenProps } from '@react-navigation/stack';
import { RootEmpleadoNavigator } from '../../navigator/EmpleadoNavigator';
import { getEmpleadoById, createEmpleado, updateEmpleado, Empleado } from '../../api/empleadoApi';
import { AREAS, TURNOS, DEFAULT_EMPLEADO, AreaType, TurnoType } from '../../constants/empleado';

type Props = StackScreenProps<RootEmpleadoNavigator, 'EmpleadoFormScreen'>;

export const EmpleadoFormScreen = ({ route, navigation }: Props) => {
  const { id } = route.params || {};
  const [loading, setLoading] = useState(!!id);
  const [formData, setFormData] = useState<Omit<Empleado, 'id_empleado'>>(DEFAULT_EMPLEADO);

  useEffect(() => {
    if (id) {
      loadEmpleado();
    }
  }, [id]);

  const loadEmpleado = async () => {
    try {
      const empleado = await getEmpleadoById(parseInt(id!));
      setFormData(empleado);
      setLoading(false);
    } catch (error) {
      console.error('Error loading empleado:', error);
      Alert.alert('Error', 'No se pudo cargar la información del empleado');
      navigation.goBack();
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

const handleSubmit = async () => {
  try {
    // Validar campos requeridos
    if (!formData.nombre || !formData.apellido_p || !formData.apellido_m) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    // Asegurarse de que los campos numéricos sean números
    const empleadoData = {
      ...formData,
      salarioDiario: Number(formData.salarioDiario) || 0,
      activo: Boolean(formData.activo)
    };

    if (id) {
      await updateEmpleado(parseInt(id), empleadoData);
      Alert.alert('Éxito', 'Empleado actualizado correctamente');
    } else {
      await createEmpleado(empleadoData);
      Alert.alert('Éxito', 'Empleado creado correctamente');
    }
    navigation.goBack();
  } catch (error) {
    console.error('Error saving empleado:', error);
    Alert.alert('Error', 'No se pudo guardar el empleado');
  }
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando información del empleado...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{id ? 'Editar' : 'Nuevo'} Empleado</Text>
      
      <Text style={styles.label}>Nombre *</Text>
      <TextInput
        style={styles.input}
        value={formData.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
        placeholder="Nombre"
      />

      <Text style={styles.label}>Apellido Paterno *</Text>
      <TextInput
        style={styles.input}
        value={formData.apellido_p}
        onChangeText={(text) => handleChange('apellido_p', text)}
        placeholder="Apellido Paterno"
      />

      <Text style={styles.label}>Apellido Materno *</Text>
      <TextInput
        style={styles.input}
        value={formData.apellido_m}
        onChangeText={(text) => handleChange('apellido_m', text)}
        placeholder="Apellido Materno"
      />

      <Text style={styles.label}>Área</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.area}
          onValueChange={(value) => handleChange('area', value as AreaType)}
          style={styles.picker}
          dropdownIconColor="#000"
        >
          {AREAS.map((area) => (
            <Picker.Item key={area.value} label={area.label} value={area.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Turno</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.turno}
          onValueChange={(value) => handleChange('turno', value as TurnoType)}
          style={styles.picker}
          dropdownIconColor="#000"
        >
          {TURNOS.map((turno) => (
            <Picker.Item key={turno.value} label={turno.label} value={turno.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Salario Diario</Text>
      <TextInput
        style={styles.input}
        value={formData.salarioDiario?.toString()}
        onChangeText={(text) => handleChange('salarioDiario', parseFloat(text) || 0)}
        placeholder="Salario Diario"
        keyboardType="numeric"
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Activo</Text>
        <TouchableOpacity
          style={[styles.switch, formData.activo ? styles.switchActive : styles.switchInactive]}
          onPress={() => handleChange('activo', !formData.activo)}
        >
          <Text style={styles.switchText}>
            {formData.activo ? 'Sí' : 'No'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  switch: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  switchActive: {
    backgroundColor: '#4CAF50',
  },
  switchInactive: {
    backgroundColor: '#F44336',
  },
  switchText: {
    color: '#666',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
