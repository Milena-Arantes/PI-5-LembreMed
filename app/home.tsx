import { router } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import SyncStatus from '../components/sync-status'
import { Cabecalho } from '@/components/cabecalho'


export default function Home() {

    return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      {/* botao pra levar pra tela de informacao do sistema q pediram no doc do pi */}
      <View style={styles.infoButtonContainer}>
        <IconButton
          icon="information-outline"
          size={28}
          iconColor="#1d7cd5ff"
          onPress={() => router.push('/infoSistema')}
        />
      </View>

      {/* onde fica/vai ficar a informacao do status da sicnronizacao entre o realm e o firestore */}
      <SyncStatus />


      <View style={styles.container}>

        <Cabecalho/>

        {/* vai pra tela de cadastro de lembrete */}
        <Button
          mode='contained'
          style={styles.buttonNovoLembrete}
          contentStyle={styles.buttonContent}
          onPress={() => router.push('/novoLembrete')}
        >
          Novo Lembrete
        </Button>

        {/* vai pra tela de consulta*/}
        <Button
          mode='contained'
          style={styles.buttonConsultarLembrete}
          contentStyle={styles.buttonContent}
          onPress={() => router.push('/consultarLembrete')}
        >
          Consultar Lembretes
        </Button>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f8ff',
  },

  infoButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
    minHeight: '100%',
  },

  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },

  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#faf4eeff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  logoText: {
    fontSize: 40,
  },

  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d7cd5ff',
    marginBottom: 8,
  },

  buttonNovoLembrete: {
    backgroundColor: '#5abe8eff',
    marginTop: 16,
    marginBottom: 16,
  },

  buttonConsultarLembrete: {
    backgroundColor: '#1d7cd5ff',
    marginTop: 16,
    marginBottom: 16,
  },

  buttonContent: {
    height: 48,
  },
})