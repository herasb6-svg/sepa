import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootEmpleadoNavigator } from '../../navigator/EmpleadoNavigator';
import { getEmpleados, deleteEmpleado } from '../../api/empleadoApi';
import { Empleado } from '../../api/empleadoApi';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props extends StackScreenProps<RootEmpleadoNavigator, 'EmpleadoListScreen'> {}

export const EmpleadoListScreen = ({ navigation }: Props) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmpleados = async () => {
    try {
      const data = await getEmpleados();
      setEmpleados(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading empleados:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadEmpleados();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id: number) => {
    Alert.alert(
      'Eliminar Empleado',
      '¿Estás seguro de que deseas eliminar este empleado?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteEmpleado(id);
              loadEmpleados();
            } catch (error) {
              console.error('Error deleting empleado:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: Empleado }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Icon name="person" size={40} color="#fff" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.cardTitle}>
            {item.nombre} {item.apellido_p} {item.apellido_m}
          </Text>
          <Text style={styles.cardSubtitle}>{item.area}</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Icon name="work" size={20} color="#666" />
          <Text style={styles.detailText}>{item.area}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="schedule" size={20} color="#666" />
          <Text style={styles.detailText}>{item.turno}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="attach-money" size={20} color="#666" />
          <Text style={styles.detailText}>
            ${typeof item.salarioDiario === 'number' ? item.salarioDiario.toFixed(2) : '0.00'}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('EmpleadoFormScreen', { id: item.id_empleado.toString() })}
        >
          <Icon name="edit" size={20} color="#4CAF50" />
        </TouchableOpacity>
        
        <View style={styles.statusBadge}>
          <View 
            style={[
              styles.statusDot, 
              { backgroundColor: item.activo ? '#4CAF50' : '#F44336' }
            ]} 
          />
          <Text style={styles.statusText}>
            {item.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => handleDelete(item.id_empleado)}
        >
          <Icon name="delete" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Empleados</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('EmpleadoFormScreen', { id: undefined })}
        >
          <Icon name="person-add" size={20} color="#fff" />
          <Text style={styles.addButtonText}> Nuevo Empleado</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text>Cargando empleados...</Text>
        </View>
      ) : empleados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="people-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No hay empleados registrados</Text>
          <Text style={styles.emptySubtext}>Presiona el botón para agregar uno nuevo</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.cardsContainer}>
            {empleados.map((empleado) => (
              <View key={empleado.id_empleado.toString()}>{
                renderItem({ item: empleado } as { item: Empleado })
              }</View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9; // 90% del ancho de la pantalla

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 2,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardBody: {
    marginVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: '#555',
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },
});
