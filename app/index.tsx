// app/index.tsx
import { router } from "expo-router"
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Card, TextInput } from 'react-native-paper'
import { useAuth } from '../context/auth'
import { Cabecalho } from '../components/cabecalho'
import { useState } from "react"


export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { handleLogin } = useAuth();

  const onLoginPress = async () => {
    setIsLoading(true); //bolinha de carregamento pro usuário nao clicar de novo
    try {
  await handleLogin(email, password);
    } catch (error) {
      
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        <Cabecalho/>
        
        {/* campo do e mail */}
        <Card style={styles.loginCard}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.inputContainer}>
              <Text>E-mail</Text>
              <TextInput
                label="E-mail"
                mode="outlined"
                placeholder="Digite seu e-mail"
                value={email} 
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="account" />}
              />
            </View>

            {/* campo da senha */}
            <View style={styles.inputContainer}>
              <Text>Senha</Text>
              <TextInput
                label="Senha"
                mode="outlined"
                placeholder="Digite sua senha"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
              />
            </View>

            {/* botao do login */}
            <Button 
              mode="contained" 
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              onPress={onLoginPress}
              loading={isLoading}
              disabled={isLoading}
            >
              Entrar
            </Button>

          {/* botao pra ir pra tela de cadastro */}
            <Button
              mode="contained"
              style={styles.cadastroButton}
              contentStyle={styles.buttonContent}
              onPress={() => router.push('/cadastro')}
              disabled={isLoading}
            >
              Cadastrar nova conta
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f8ff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e7f0faff',
    padding: 20,
    minHeight: '100%',
  },
  loginCard: {
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
  loginButton: {
    backgroundColor: '#1d7cd5ff',
    marginTop: 16,
    marginBottom: 16,
  },
  cadastroButton: {
    backgroundColor: '#5EB090',
    marginTop: 16,
    marginBottom: 16,
  },
  buttonContent: {
    height: 48,
  },
});