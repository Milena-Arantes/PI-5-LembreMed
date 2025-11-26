import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '../context/auth';

//pra ver na tela se tá dando certo a sincronizacao
export default function SyncStatus() {
  const { syncStatus } = useAuth();

  if (syncStatus === 'idle') { //idle = estado inicial ou neutro, aqui ele tá basicamente dizendo q ainda não foi sincronizado
    return null; // não mostra anda quando não está sincronizando
  }

  return (
    <View style={styles.container}>
      {syncStatus === 'syncing' && (
        <View style={styles.syncingContainer}>
          <ActivityIndicator size="small" color="#4898d6ff" />
          <Text style={styles.syncingText}>Sincronizando com a nuvem...</Text>
        </View>
      )}
      
      {syncStatus === 'success' && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>Sincronizado com sucesso</Text>
        </View>
      )}
      
      {syncStatus === 'error' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro na sincronização</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  syncingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4898d6ff',
  },
  successContainer: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  syncingText: {
    color: '#4898d6ff',
    marginLeft: 8,
    fontSize: 14,
  },
  successText: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    fontWeight: '500',
  },
});