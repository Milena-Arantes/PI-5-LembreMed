import { useState } from "react";
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY
//TIRAR ISSO DAQUI

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;


interface IDescricaoMedicamentoProps {
  medicamento: string
}

export function DescricaoMedicamento({ medicamento }: IDescricaoMedicamentoProps) {

    const [ descricao, setDescricao ] = useState<string>("")
    const [ carregando, setCarregando ] = useState<boolean>(false)
    const [ mostrarModal, setMostrarModal ] = useState<boolean>(false)

    async function buscarDescricaoMedicamento(){

        if (!medicamento.trim()) {
            Alert.alert('Por favor, primeiro informe o nome do medicamento.')
            return
        }

        try {
            setCarregando(true)

            const response = await fetch(
                API_URL,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Descreva para que serve o medicamento "${medicamento}" de forma muito resumida (máximo 3 linhas) e em linguagem simples para um leigo.`
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.5, 
                            maxOutputTokens: 100, 
                        },


                    })
                }
            )

            //console.log("resposta recebida")

            const data = await response.json()

            if (data.error) {
                console.error("Erro da API Gemini:", data.error);
                throw new Error(data.error.message || "A API retornou um erro.");
            }

            const textoGerado = data.candidates?.[0]?.content?.parts?.[0]?.text || "Descrição não encontrada";

            setDescricao(textoGerado)
            setMostrarModal(true)
        } 
        catch (error){
            console.error("Erro ao buscar descrição", error)
            Alert.alert("Erro", "Não foi possível buscar a descrição do medicamento")
        }
        finally {
            setCarregando(false)
        }
    }

    return(
        
        <View>
            <TouchableOpacity
                onPress = {buscarDescricaoMedicamento}
                style = { styles.botaoBuscar }
                disabled = { carregando }
            >
                {carregando ? (
                    <ActivityIndicator color ="#fff"/>
                    ) : (
                        <Text style={styles.texto}>
                            Buscar descrição
                        </Text>
                    )
                }
            </TouchableOpacity>

            {/* "popup" da descricao do remédio */}
            <Modal 
            visible = { mostrarModal }
            transparent = { true }
            animationType = "slide" >
                <View style = { styles.container }>
                    <View style = { styles.popup }>
                        <Text style = { styles.titulo }>
                            Descrição:
                        </Text>
                        <Text>{descricao}</Text>

                        {/* botao pra fechar o popup*/}
                        <TouchableOpacity
                            onPress = {() => setMostrarModal(false)}
                            style = { styles.botaoFechar }
                        >
                            <Text style = { styles.texto }>
                                Fechar
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({

    texto:{
        color: '#fff', 
        fontWeight: 'bold'
    },

    container:{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },

    popup:{
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
    },

    titulo:{
        fontSize: 16, 
        marginBottom: 10
    },

    botaoFechar:{
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15
    },

    botaoBuscar: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center'
    }

})