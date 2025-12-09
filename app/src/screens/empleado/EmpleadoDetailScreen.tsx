import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootEmpleadoNavigator } from '../../navigator/EmpleadoNavigator';
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

type Props = StackScreenProps<RootEmpleadoNavigator, 'EmpleadoDetailScreen'>;

export const EmpleadoDetailScreen = ({ route, navigation }: Props) => {
  const empleado = route.params.empleado;

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>CAMBIO TOTAL - PRUEBA</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {empleado.nombre.charAt(0)}{empleado.apellido_p.charAt(0)}
              </Text>
            </View>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: empleado.activo ? '#00C851' : '#FF4444' }
            ]} />
          </View>
          <Text style={styles.fullName}>
            {empleado.nombre} {empleado.apellido_p} {empleado.apellido_m}
          </Text>
          <View style={styles.statusContainer}>
            <Icon 
              name={empleado.activo ? "check-circle" : "cancel"} 
              size={16} 
              color={empleado.activo ? "#00C851" : "#FF4444"} 
            />
            <Text style={[
              styles.statusText,
              { color: empleado.activo ? '#00C851' : '#FF4444' }
            ]}>
              {empleado.activo ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Icon name="person" size={20} color="#778DA9" />
            <Text style={styles.sectionTitle}>Información Personal</Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Icon name="badge" size={18} color="#94A3B8" />
                <Text style={styles.infoLabel}>Nombre completo</Text>
              </View>
              <Text style={styles.infoValue}>
                {empleado.nombre} {empleado.apellido_p} {empleado.apellido_m}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Icon name="business" size={18} color="#94A3B8" />
                <Text style={styles.infoLabel}>Área</Text>
              </View>
              <View style={styles.areaBadge}>
                <Text style={styles.areaText}>{getAreaName(empleado.area)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Icon name="schedule" size={18} color="#94A3B8" />
                <Text style={styles.infoLabel}>Turno</Text>
              </View>
              <View style={styles.turnoBadge}>
                <Text style={styles.turnoText}>{getTurnoName(empleado.turno)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Icon name="attach-money" size={18} color="#94A3B8" />
                <Text style={styles.infoLabel}>Salario diario</Text>
              </View>
              <Text style={styles.salaryValue}>
                ${empleado.salarioDiario ? (typeof empleado.salarioDiario === 'number' ? empleado.salarioDiario.toFixed(2) : parseFloat(empleado.salarioDiario).toFixed(2)) : '0.00'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.sectionHeader}>
            <Icon name="analytics" size={20} color="#778DA9" />
            <Text style={styles.sectionTitle}>Estadísticas Laborales</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Icon name="calendar-today" size={24} color="#415A77" />
              </View>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Días trabajados</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Icon name="event-busy" size={24} color="#778DA9" />
              </View>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Inasistencias</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Icon name="trending-up" size={24} color="#E0E1DD" />
              </View>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Producción</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="history" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Ver Historial</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF1493',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 25,
    backgroundColor: '#1B263B',
    borderBottomWidth: 2,
    borderBottomColor: '#415A77',
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#778DA9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E0E1DD',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: '#0D1B2A',
  },
  profileCard: {
    backgroundColor: '#1B263B',
    borderRadius: 25,
    padding: 35,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#415A77',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 25,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#415A77',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 3,
    borderColor: '#778DA9',
  },
  avatarText: {
    color: '#E0E1DD',
    fontSize: 42,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#1B263B',
  },
  fullName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#E0E1DD',
    marginBottom: 15,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(65, 90, 119, 0.3)',
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  infoSection: {
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E0E1DD',
    marginLeft: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: '#1B263B',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#415A77',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 15,
    color: '#778DA9',
    marginLeft: 15,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 17,
    color: '#E0E1DD',
    fontWeight: '700',
    flex: 1.5,
    textAlign: 'right',
  },
  divider: {
    height: 2,
    backgroundColor: '#415A77',
    marginHorizontal: -25,
    opacity: 0.5,
  },
  areaBadge: {
    backgroundColor: '#415A77',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  areaText: {
    color: '#E0E1DD',
    fontSize: 15,
    fontWeight: '700',
  },
  turnoBadge: {
    backgroundColor: '#778DA9',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  turnoText: {
    color: '#E0E1DD',
    fontSize: 15,
    fontWeight: '700',
  },
  salaryValue: {
    fontSize: 20,
    color: '#415A77',
    fontWeight: '800',
  },
  statsSection: {
    marginTop: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1B263B',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#415A77',
  },
  statIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 27,
    backgroundColor: 'rgba(65, 90, 119, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#E0E1DD',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#778DA9',
    textAlign: 'center',
    fontWeight: '600',
  },
  actionSection: {
    marginTop: 30,
    marginBottom: 50,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#415A77',
    paddingVertical: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
  },
  actionButtonText: {
    color: '#E0E1DD',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
  },
});
