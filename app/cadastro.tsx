import { Cabecalho } from '@/components/cabecalho';
import { useAuth } from '@/context/auth';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';


export default function Cadastro() {
    const { handleRegister } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        <Cabecalho/>

        {/* campo do email */}
        <Card style={styles.cadastroCard}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.inputContainer}>
              <TextInput
                label='E-mail'
                mode='outlined'
                placeholder='Digite seu e-mail'
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType='email-address'
                autoCapitalize='none'
                left={<TextInput.Icon icon="account" />}
              />
            </View>

            {/* campo da senha*/}
            <View style={styles.inputContainer}>
              <TextInput
                label='senha'
                mode='outlined'
                placeholder='Digite sua senha'
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
              />
            </View>

            {/* botao do cadastro */}
            <Button
              mode='contained'
              style={styles.cadastroButton}
              contentStyle={styles.buttonContent}
              onPress={() => handleRegister(email, password)}
            >
              Cadastrar
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f8ff', 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0fffbff',
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
    backgroundColor: '#eafdfbff',
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
    color: '#5EB090',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  cadastroCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
  },
  cadastroButton: {
    backgroundColor: '#5EB090',
    marginTop: 16,
    marginBottom: 16,
  },

  buttonContent: {
    height: 48,
  },
  registerSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  registerButton: {
    marginTop: 8,
  },
  mt20: {
    marginTop: 20,
  },
})