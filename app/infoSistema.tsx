import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';

export default function infoSistema() {
  return (
    <View style={styles.screen}>
      
      {/* setinha pra voltar */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={28}
          onPress={() => router.back()}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            
            <Text variant="headlineMedium" style={styles.titulo}>
              Sobre o Sistema
            </Text>

            <Text variant="bodyMedium" style={styles.texto}>
              O LembreMed é um aplicativo criado para auxiliar no lembrete de medicamentos por meio de 
              notificações. Ele permite que usuários, familiares ou cuidadores registrem e consultem 
              lembretes de forma simples, promovendo segurança e regularidade no uso dos medicamentos.
            </Text>

            <Text variant="titleMedium" style={styles.subtitulo}>
              Desenvolvedores
            </Text>

            <Text variant="bodyMedium" style={styles.texto}>
              Desenvolvido por Andreia, Gabriel, Milena e Núbia, estudantes do 5º semestre de Análise e 
              Desenvolvimento de Sistemas da Fatec Indaiatuba.
            </Text>

          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  header: {
    paddingTop: 40,
    paddingLeft: 10,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  titulo: {
    marginBottom: 12,
  },
  subtitulo: {
    marginTop: 20,
    marginBottom: 8,
  },
  texto: {
    marginBottom: 10,
    lineHeight: 22,
  },
});
