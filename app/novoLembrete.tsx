import { BotaoVoltar } from '@/components/botao-voltar';
import { Cabecalho } from '@/components/cabecalho';
import { DescricaoMedicamento } from '@/components/descricao-medicamento';
import { processarImagem } from '@/services/gemini';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Camera, CameraView } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { router } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Menu } from 'react-native-paper';
import Realm from "realm";
import { syncService } from "../services/sincronizacao";

export interface ILembrete {
  _id?: Realm.BSON.ObjectId
  nomeMedicamento: string
  dose: string
  unidade: string
  agendamento: Date
  sincronizado?: boolean
}

export default function formNovoLembrete() {

  const [nomeMedicamento, setnomeMedicamento] = useState('');
  const [dose, setDose] = useState('');
  const [unidade, setUnidade] = useState('mg');
  const [menuVisivel, setMenuVisivel] = useState(false);

  const [agendamento, setAgendamento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  //pra pegar a data
  const onChangeData = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    //validacao, data nao pode ser anterior a atual
    if (selectedDate) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataEscolhida = new Date(selectedDate);
      dataEscolhida.setHours(0, 0, 0, 0);

      if (dataEscolhida < hoje) {
        Alert.alert("Data inválida", "Você não pode escolher uma data no passado.");
        return;
      }

      const novaData = new Date(agendamento);
      novaData.setFullYear(selectedDate.getFullYear());
      novaData.setMonth(selectedDate.getMonth());
      novaData.setDate(selectedDate.getDate());

      setAgendamento(novaData);
    }
  };

  //pra pegar o horario
  const onChangeHorario = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);

    //mesma cois aqui, horario nao pdoe ser passado, a nao ser que a data seja futura
    if (selectedTime) {
      const agora = new Date();
      const novaData = new Date(agendamento);
      novaData.setHours(selectedTime.getHours());
      novaData.setMinutes(selectedTime.getMinutes());
      novaData.setSeconds(0, 0);

      const hoje = new Date();
      if (
        novaData.toDateString() === hoje.toDateString() &&
        novaData <= agora
      ) {
        Alert.alert("Horário inválido", "O horário deve ser posterior ao horário atual.");
        return;
      }

      setAgendamento(novaData);
    }
  };

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {

    //pedir permissao pra usar a câmera
    (async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Permissão para notificações foi negada!');
        return;
      }
    })();
  }, []);


  const salvarLembrete = async () => {
    if (!nomeMedicamento || !dose || !unidade) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      let dataLembrete = new Date(agendamento);
      dataLembrete.setSeconds(0);

      if (dataLembrete <= new Date()) {
        Alert.alert("Data inválida", "A data e horário do lembrete devem ser posteriores ao momento atual.");
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Hora do seu medicamento 💊`,
          body: `${nomeMedicamento} - ${dose}${unidade}`,
          sound: 'alarm_sound.wav',
        },
        trigger: {
          channelId: 'alarm-channel',
          type: 'date',
          date: dataLembrete
        } as Notifications.DateTriggerInput,
      });

      const realm = await syncService.getRealmInstance();

      realm.write(() => {
        realm.create("Lembrete", {
          _id: new Realm.BSON.ObjectId(),
          nomeMedicamento,
          dose,
          unidade,
          agendamento: new Date(dataLembrete),
          sincronizado: false //isso é pro lembrete ser criado como não sincronizado, pro sistema saber q precisa sincronizar ele
        });
      });

      //console.log("Lembrete criado no Realm:", nomeMedicamento);
    
      Alert.alert('Sucesso', 'Lembrete salvo com sucesso!');
      router.back();

    } catch (error) {
      console.error('Erro ao salvar lembrete:', error);
      Alert.alert('Erro', 'Não foi possível salvar o lembrete.');
    }
};

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        <Cabecalho/>

        <View style={styles.formBox}>

          {/* cabecalho + botao voltar*/}
          <View style={styles.header}>
            <BotaoVoltar /> 
            <Text style={styles.title}>
              Cadastrar Lembrete
            </Text>
          </View>
            
            <Text>Nome do Medicamento</Text>
            <View style={ styles.campoMedicamento }> 
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Ex: Dipirona"
              value={nomeMedicamento}
              onChangeText={(texto) => {
                console.log("Digitado:", texto)
                setnomeMedicamento(texto)
              }}
            />

            {/*botao da camera + pede eprmissao pra acessar a camera ao clicar nele */}
            <TouchableOpacity
              onPress={async () => {
                const { status } = await Camera.requestCameraPermissionsAsync();
                if (status === 'granted') {
                  setHasPermission(true);
                  setShowCamera(true);
                } else {
                  setHasPermission(false);
                  Alert.alert(
                    'Permissão necessária',
                    'É preciso permitir o uso da câmera para tirar uma foto.'
                  );
                }
              }}
              style={{ marginLeft: 8 }}
            >
              <Ionicons name="camera" size={28} color="#4898d6ff" />
            </TouchableOpacity>
          </View>

        {/* interface da camera */}
          {showCamera && hasPermission === true && (
            <Modal animationType="slide" transparent={false}>
              <View style={{ flex: 1, backgroundColor: '#000' }}>

                <CameraView ref={cameraRef} style={{ 
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  justifyContent: 'flex-end', 
                }} />

                <View
                  style={{
                    position: 'absolute',
                    bottom: 40,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >

                  <TouchableOpacity
                    style={styles.botaoCamera}
                    onPress={async () => {
                      if (cameraRef.current) {
                        const foto = await cameraRef.current.takePictureAsync({
                          quality: 0.5,
                          base64: true,
                        });
                        //os consoles eram pra ver se tá "pegando" a imagem
                        //console.log("Foto capturada:", foto.uri ? foto.uri : "sem URI");
                        //console.log("Base64 existe?", !!foto.base64);
                        setShowCamera(false);
                        processarImagem(foto.base64, setnomeMedicamento);
                      }
                    }}
                  />

                  <TouchableOpacity
                    style={[styles.botaoVoltar]}
                    onPress={() => setShowCamera(false)}
                  >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                  </TouchableOpacity>

                </View>
              </View>
            </Modal>
          )}

          <DescricaoMedicamento medicamento={nomeMedicamento}/>

            <Text>Dose</Text>
            <View style={styles.viewDose}>
              <TextInput
                placeholder="Ex: 500"
                value={dose}
                onChangeText={setDose}
                keyboardType="numeric"
                style={styles.input} 
              />

              <Menu
                visible={menuVisivel}
                onDismiss={() => setMenuVisivel(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setMenuVisivel(true)}
                    contentStyle={{ flexDirection: 'row-reverse' }}
                    icon="chevron-down" 
                    style={styles.botaoUnidade}
                  >
                    {unidade}
                  </Button>
                }
              >
                <Menu.Item onPress={() => { setUnidade('mg'); setMenuVisivel(false); }} title="mg" />
                <Menu.Item onPress={() => { setUnidade('ml'); setMenuVisivel(false); }} title="ml" />
                <Menu.Item onPress={() => { setUnidade('comprimido'); setMenuVisivel(false); }} title="comprimido" />
                <Menu.Item onPress={() => { setUnidade('gotas'); setMenuVisivel(false); }} title="gotas" />
              </Menu>
            </View>

            <Text>Data do lembrete</Text>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={{ marginBottom: 12 }}
            >
              {agendamento.toLocaleDateString()}
            </Button>

            {showDatePicker && (
              <DateTimePicker
                value={agendamento}
                mode="date"
                display={Platform.OS === 'ios' ? 'calendar' : 'default'} //acho q vou tirar isso, nao estamos pensando no ios mesmo
                onChange={onChangeData}
              />
            )}

            <Text>Horário do lembrete</Text>
            <Button
              mode="outlined"
              onPress={() => setShowTimePicker(true)} 
              style={{ marginBottom: 12 }}
            >
              {agendamento.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Button>

            {showTimePicker && ( 
              <DateTimePicker
                value={agendamento}
                mode="time"
                display="spinner"
                onChange={onChangeHorario}
              />
            )}

          <Button
            mode="contained"
            style={styles.buttonSalvar}
            contentStyle={styles.buttonContent}
            onPress={salvarLembrete}
          >
            Salvar Lembrete
          </Button>

          </View>
        </View>

      </ScrollView>
  )
}

const styles = StyleSheet.create({


  buttonSalvar: {
    backgroundColor: '#1d7cd5ff',
    marginTop: 16,
    marginBottom: 16,
  },

  buttonCancelar: {
    backgroundColor: '#e4e4e4ff',
    marginTop: 16,
    marginBottom: 16,
  },

  container: {
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    flex: 1
  },
  buttonContent: {
    height: 48,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f8ff', 
    padding: 16
  },
  button: {
    backgroundColor: '#1d7cd5ff',
    padding: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  botaoUnidade: {
    justifyContent: 'center',
    borderRadius: 8,
  },  

  viewDose:{
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12, 
    gap: 8 
  },

  containerBotaoCamera:{
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30
  },

  botaoCamera: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    elevation: 5, //SOMBRA NO ANDROID
    shadowColor: "#000", //SOMBRA NO IOS
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  botaoVoltar: {
        marginRight: 8,
        padding: 4,
        position: 'absolute', 
        left: 20, 
        top: -20
    },

    campoMedicamento: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginBottom: 12 }

  
})