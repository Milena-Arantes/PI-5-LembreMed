import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

export function BotaoVoltar(){

    const handlePress = () => {
        Alert.alert(
            'Tem certeza?',
            'Seu lembrete ainda não foi salvo.',
            [
                {
                    text: 'Continuar aqui', 
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    onPress: () => router.back(),
                    style: 'destructive',
                },
            ],
        { cancelable: true }
        );
    }

    return (
            <TouchableOpacity 
                onPress={handlePress}  
                style={styles.botaoVoltar}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    botaoVoltar: {
        marginRight: 8,
        padding: 4
    }
})
          