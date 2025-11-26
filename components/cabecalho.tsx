import { View, Text, StyleSheet } from "react-native"

export function Cabecalho(){

    return(
        <View style={styles.cabecalho}>
          <View style={styles.containerLogo}>
            <Text style={styles.textoLogo}>💊</Text>
          </View>
          <Text style={styles.tituloApp}>LembreMed</Text>
          <Text style={styles.subtitulo}>Seus medicamentos em dia</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  cabecalho: {
    alignItems: 'center',
    marginBottom: 40,
  },
  containerLogo: {
    width: 80,
    height: 80,
    backgroundColor: '#e3fdf7ff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textoLogo: {
    fontSize: 40,
  },
  tituloApp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5EB090',
    marginBottom: 8,
  },
  subtitulo: {
      fontSize: 18,
      color: '#666',
      textAlign: 'center',
    },
})