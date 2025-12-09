import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Empleado, createEmpleado } from '../../api/empleadoApi';

type Area = 'OFICINA' | 'PRODUCCION' | 'INVENTARIO';
type Turno = 'MATUTINO' | 'VESPERTINO' | 'NOCTURNO' | 'MIXTO';

interface EmpleadoFormData extends Omit<Empleado, 'id_empleado'> {
}

type RootStackParamList = {
  Empleados: undefined;
  EmpleadoForm: { empleado?: EmpleadoFormData; empleadoId?: number };
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

const EmpleadoFormScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [empleado, setEmpleado] = useState<EmpleadoFormData>({
    nombre: '',
    apellido_p: '',
    apellido_m: '',
    area: 'PRODUCCION',
    turno: 'MATUTINO',
    salarioDiario: 0,
    activo: true
  });
  
  const [salarioInput, setSalarioInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!empleado.nombre.trim() || !empleado.apellido_p.trim()) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    if (empleado.salarioDiario <= 0) {
      Alert.alert('Error', 'El salario debe ser mayor a cero');
      return;
    }

    setSaving(true);
    try {
      const datosParaEnviar = { 
        nombre: empleado.nombre || '',
        apellido_p: empleado.apellido_p || '',
        apellido_m: empleado.apellido_m || '',
        area: empleado.area || 'PRODUCCION',
        turno: empleado.turno || 'MATUTINO',
        salarioDiario: Number(empleado.salarioDiario) || 0,
        activo: empleado.activo !== undefined ? empleado.activo : true
      };

      await createEmpleado(datosParaEnviar);
      
      Alert.alert(
        'Éxito',
        'Empleado creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Empleados'),
          },
        ]
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar el empleado');
    } finally {
      setSaving(false);
    }
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.title}>
          Nuevo Empleado
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            value={empleado.nombre}
            onChangeText={(text) => setEmpleado({ ...empleado, nombre: text })}
            placeholder="Nombre *"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Apellido Paterno *</Text>
          <TextInput
            style={styles.input}
            value={empleado.apellido_p}
            onChangeText={(text) => setEmpleado({ ...empleado, apellido_p: text })}
            placeholder="Apellido Paterno *"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Apellido Materno</Text>
          <TextInput
            style={styles.input}
            value={empleado.apellido_m}
            onChangeText={(text) => setEmpleado({ ...empleado, apellido_m: text })}
            placeholder="Apellido Materno"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Área</Text>
          <View style={styles.pickerContainer}>
            <Picker<Area>
              selectedValue={empleado.area as Area}
              onValueChange={(itemValue: Area) => setEmpleado({ ...empleado, area: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Producción" value="PRODUCCION" />
              <Picker.Item label="Oficina" value="OFICINA" />
              <Picker.Item label="Inventario" value="INVENTARIO" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Turno</Text>
          <View style={styles.pickerContainer}>
            <Picker<Turno>
              selectedValue={empleado.turno as Turno}
              onValueChange={(itemValue: Turno) => setEmpleado({ ...empleado, turno: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Matutino" value="MATUTINO" />
              <Picker.Item label="Vespertino" value="VESPERTINO" />
              <Picker.Item label="Nocturno" value="NOCTURNO" />
              <Picker.Item label="Mixto" value="MIXTO" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Salario Diario *</Text>
          <TextInput
            style={styles.input}
            value={salarioInput}
            onChangeText={(text) => {
              // Allow only numbers and decimal point
              if (/^\d*\.?\d*$/.test(text) || text === '') {
                setSalarioInput(text);
                setEmpleado({ 
                  ...empleado, 
                  salarioDiario: text ? parseFloat(text) : 0 
                });
              }
            }}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputGroup, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={[styles.label, { marginRight: 10 }]}>Activo</Text>
          <TouchableOpacity
            onPress={() => setEmpleado({ ...empleado, activo: !empleado.activo })}
            style={[
              styles.switch,
              { backgroundColor: empleado.activo ? '#4CAF50' : '#E0E0E0' }
            ]}
          >
            <View style={[
              styles.switchCircle,
              { alignSelf: empleado.activo ? 'flex-end' : 'flex-start' }
            ]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              Guardar
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: -24, // To center the title
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  switch: {
    width: 50,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'white',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    opacity: 1,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmpleadoFormScreen;
