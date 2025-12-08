import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Empleado, getEmpleados, deleteEmpleado } from '../../api/empleadoApi';

type RootStackParamList = {
  EmpleadoDetail: { empleado: Empleado };
  EmpleadoForm: { empleado?: Empleado };
  // Add other screen params as needed
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
};

const EmpleadosScreen = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();

  const fetchEmpleados = async () => {
    try {
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (error) {
      console.error('Error fetching empleados:', error);
      Alert.alert('Error', 'No se pudieron cargar los empleados');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchEmpleados();
    }
  }, [isFocused]);

  const handleDelete = async (id: number) => {
    try {
      await deleteEmpleado(id);
      Alert.alert('Éxito', 'Empleado eliminado correctamente');
      fetchEmpleados();
    } catch (error) {
      console.error('Error deleting empleado:', error);
      Alert.alert('Error', 'No se pudo eliminar el empleado');
    }
  };

  const confirmDelete = (empleado: Empleado) => {
    Alert.alert(
      'Eliminar Empleado',
      `¿Estás seguro de que deseas eliminar a ${empleado.nombre} ${empleado.apellido_p}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => handleDelete(empleado.id_empleado), style: 'destructive' },
      ]
    );
  };

  const handleViewDetail = (empleado: Empleado) => {
    navigation.navigate('EmpleadoDetail', { empleado });
  };

  const handleEdit = (empleado: Empleado) => {
    navigation.navigate('EmpleadoForm', { empleado });
  };

  const handleAdd = () => {
    navigation.navigate('EmpleadoForm', {});
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Empleados</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAdd}
        >
          <Icon name="person-add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer}>
        {empleados.map((empleado) => (
          <TouchableOpacity 
            key={empleado.id_empleado} 
            style={styles.empleadoCard}
            onPress={() => handleViewDetail(empleado)}
          >
            <View style={styles.empleadoInfo}>
              <View style={styles.empleadoHeader}>
                <Text style={styles.empleadoName}>
                  {empleado.nombre} {empleado.apellido_p} {empleado.apellido_m}
                </Text>
                <View style={[styles.statusBadge, empleado.activo ? styles.activeBadge : styles.inactiveBadge]}>
                  <Text style={styles.statusText}>
                    {empleado.activo ? 'Activo' : 'Inactivo'}
                  </Text>
                </View>
              </View>
              <Text style={styles.empleadoDetail}><Text style={styles.detailLabel}>Área:</Text> {empleado.area}</Text>
              <Text style={styles.empleadoDetail}><Text style={styles.detailLabel}>Turno:</Text> {empleado.turno}</Text>
              <Text style={styles.empleadoDetail}><Text style={styles.detailLabel}>Salario diario:</Text> ${empleado.salarioDiario.toFixed(2)}</Text>
              <Text style={styles.empleadoDetail}>
                Salario diario: ${empleado.salarioDiario?.toFixed(2)}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => handleViewDetail(empleado)}
              >
                <Icon name="visibility" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEdit(empleado)}
              >
                <Icon name="edit" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => confirmDelete(empleado)}
              >
                <Icon name="delete" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  empleadoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },
  activeBadge: {
    backgroundColor: '#4caf50',
  },
  inactiveBadge: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  viewButton: {
    backgroundColor: '#2196F3',
  },
  editButton: {
    backgroundColor: '#FFC107',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  listContainer: {
    flex: 1,
  },
  empleadoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  empleadoInfo: {
    flex: 1,
  },
  empleadoName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  empleadoDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
  },
});

export default EmpleadosScreen;
