import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootEmpleadoNavigator } from '../../navigator/EmpleadoNavigator';
import { getEmpleados, deleteEmpleado } from '../../api/empleadoApi';
import { Empleado } from '../../api/empleadoApi';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props extends StackScreenProps<RootEmpleadoNavigator, 'EmpleadoListScreen'> {}

export const EmpleadoListScreen = ({ navigation }: Props) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const BATCH_SIZE = 20; // Número fijo de empleados por carga

  const loadEmpleados = async (isInitialLoad = true) => {
    if (isInitialLoad) {
      setLoading(true);
      setEmpleados([]);
      setPage(1);
    } else {
      setLoadingMore(true);
    }
    
    try {
      // Calculate the offset based on current page
      const offset = isInitialLoad ? 0 : (page - 1) * BATCH_SIZE;
      
      // Get employees with pagination parameters
      const response = await getEmpleados(BATCH_SIZE, offset);
      
      // If it's the first load, set the employees directly
      // Otherwise, append the new employees to the existing list
      setEmpleados(prev => isInitialLoad ? response : [...prev, ...response]);
      
      // If we get fewer items than requested, there are no more items to load
      setHasMore(response.length === BATCH_SIZE);
      
      // Only increment page if we're loading more (not initial load)
      if (!isInitialLoad) {
        setPage(prev => prev + 1);
      }
      
    } catch (error) {
      console.error('Error cargando empleados:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      loadEmpleados(false);
    }
  };
  
  // Reset and reload when the screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadEmpleados(true);
    });
    
    // Initial load
    loadEmpleados(true);
    
    return unsubscribe;
  }, [navigation]);
  
  const handleRefresh = () => {
    setPage(1);
    loadEmpleados(true);
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
    <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('EmpleadoDetailScreen', { empleado: item })}
      >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Icon name="person" size={40} color="#E0E1DD" />
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
          <Icon name="work" size={20} color="#778DA9" />
          <Text style={styles.detailText}>{item.area}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="schedule" size={20} color="#778DA9" />
          <Text style={styles.detailText}>{item.turno}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="attach-money" size={20} color="#778DA9" />
          <Text style={styles.detailText}>
            ${item.salarioDiario ? (typeof item.salarioDiario === 'number' ? item.salarioDiario.toFixed(2) : parseFloat(item.salarioDiario).toFixed(2)) : '0.00'}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.statusBadge}>
          <View 
            style={[
              styles.statusDot, 
              { backgroundColor: item.activo ? '#415A77' : '#FF4444' }
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
          <Icon name="delete" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Render footer with loading indicator when loading more items
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#6366F1" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Empleados</Text>
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('EmpleadoFormScreen', { id: undefined })}
          >
            <Icon name="person-add" size={20} color="#E0E1DD" />
            <Text style={styles.addButtonText}> Nuevo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && empleados.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Cargando empleados...</Text>
        </View>
      ) : empleados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="people-outline" size={60} color="#778DA9" />
          <Text style={styles.emptyText}>No hay empleados registrados</Text>
          <Text style={styles.emptySubtext}>Presiona el botón para agregar uno nuevo</Text>
        </View>
      ) : (
        <FlatList
          data={empleados}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id_empleado}-${index}`}
          style={styles.scrollView}
          contentContainerStyle={styles.cardsContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onRefresh={handleRefresh}
          refreshing={loading && !loadingMore}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={20}
          windowSize={21}
        />
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9; // 90% del ancho de la pantalla

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1B263B',
    borderBottomWidth: 2,
    borderBottomColor: '#415A77',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  controlsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#415A77',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#E0E1DD',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    paddingTop: 10,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#94A3B8',
    fontSize: 16,
  },
  cardsContainer: {
    padding: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1B263B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#415A77',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#415A77',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#778DA9',
  },
  headerText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0E1DD',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#778DA9',
    fontWeight: '600',
  },
  cardBody: {
    marginVertical: 16,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#415A77',
    paddingVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#E0E1DD',
    marginLeft: 12,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 25,
    backgroundColor: '#415A77',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(65, 90, 119, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    color: '#E0E1DD',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D1B2A',
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
    fontSize: 20,
    color: '#E0E1DD',
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#778DA9',
    fontWeight: '500',
    textAlign: 'center',
  },
});
