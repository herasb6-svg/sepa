import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Types
interface Empleado {
  id_empleado: number;
  nombre: string;
  apellido_p: string;
  apellido_m: string;
  area: string;
  turno: string;
  salarioDiario: number;
  activo: boolean;
}

const EmpleadoDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const empleado = route.params?.empleado as Empleado;

  const getAreaName = (area: string) => {
    const areas: Record<string, string> = {
      'PRODUCCION': 'Producción',
      'ALMACEN': 'Almacén',
      'ADMINISTRACION': 'Administración',
      'CALIDAD': 'Calidad'
    };
    return areas[area] || area;
  };

  const getTurnoName = (turno: string) => {
    const turnos: Record<string, string> = {
      'MATUTINO': 'Matutino',
      'VESPERTINO': 'Vespertino',
      'NOCTURNO': 'Nocturno'
    };
    return turnos[turno] || turno;
  };

  if (!empleado) {
    return (
      <View style={styles.container}>
        <Text>No se encontró la información del empleado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.title}>Detalles del Empleado</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('EditarEmpleado', { empleado })}
        >
          <Icon name="edit" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {empleado.nombre.charAt(0)}{empleado.apellido_p.charAt(0)}
            </Text>
          </View>
          <Text style={styles.name}>
            {empleado.nombre} {empleado.apellido_p} {empleado.apellido_m}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: empleado.activo ? '#4CAF50' : '#F44336' }
          ]}>
            <Text style={styles.statusText}>
              {empleado.activo ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nombre completo:</Text>
            <Text style={styles.detailValue}>
              {empleado.nombre} {empleado.apellido_p} {empleado.apellido_m}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Área:</Text>
            <Text style={styles.detailValue}>{getAreaName(empleado.area)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Turno:</Text>
            <Text style={styles.detailValue}>{getTurnoName(empleado.turno)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Salario diario:</Text>
            <Text style={styles.detailValue}>${empleado.salarioDiario?.toFixed(2)}</Text>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Estadísticas</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Días trabajados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Inasistencias</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Producción</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default EmpleadoDetailScreen;
