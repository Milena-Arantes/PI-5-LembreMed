import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Card, IconButton, Text, TextInput } from "react-native-paper";
import Realm from "realm";
import { syncService } from "../services/sincronizacao";
import { ILembrete } from "./novoLembrete";
import { Cabecalho } from "@/components/cabecalho";
import { BotaoVoltar } from "@/components/botao-voltar";

interface ILembretePuro extends ILembrete {} //"puro" pro front, só com os dados relevantes pro usuário, tipo sem o status da sincronziacao

export default function ConsultarLembrete() {
  const [lembretes, setLembretes] = useState<ILembretePuro[]>([]); //nao pega os objetos do realm
  const [busca, setBusca] = useState("");
  const [realm, setRealm] = useState<Realm | null>(null);

  useEffect(() => {
    const inicializarRealm = async () => {
      const realmInstance = await syncService.getRealmInstance();
      setRealm(realmInstance);

      const data = realmInstance.objects<ILembrete & Realm.Object>("Lembrete");

      setLembretes(JSON.parse(JSON.stringify(data.toJSON())));

      data.addListener((colecaoAtualizada) => { //adiciona um observer pra caso algo for atualizado (tipo excluir), mudar na tela
        setLembretes(JSON.parse(JSON.stringify(colecaoAtualizada.toJSON())));
      });
    };

    inicializarRealm();

    return () => {
      if (realm && !realm.isClosed) {
        const data = realm.objects<ILembrete & Realm.Object>("Lembrete");
        data.removeAllListeners();
      }
    };
  }, []);

  const excluirLembrete = async (id: string) => {
    if (!realm) return;

    try {
      await syncService.deleteLembreteFromFirestore(id);

      realm.write(() => {
        try {
          const objectId = new Realm.BSON.ObjectId(id);
          const lembrete = realm.objectForPrimaryKey<ILembrete>("Lembrete", objectId);
          
          if (lembrete) {
            console.log(`Deletando lembrete: ${lembrete.nomeMedicamento}`);
            realm.delete(lembrete);
          }
        } catch (error) {
          console.error("Falha ao converter ID ou deletar objeto:", error);
        }
      });
    } catch (error) {
      console.error("Erro ao excluir lembrete:", error);
      Alert.alert("Erro", "Não foi possível excluir o lembrete.");
    }
  };

  //filtro por nome pra barra de pesquisa
  const lembretesFiltrados = lembretes?.filter((l) =>
    l.nomeMedicamento.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>

      <Cabecalho/>

      <View style={styles.header}>

        <BotaoVoltar /> 
        
        <Text style={styles.title}>
        Meus lembretes
        </Text>
      </View>


    {/*barra dwe pesquisa */}
      <TextInput
        label="Pesquisar medicamento"
        value={busca}
        onChangeText={setBusca}
        mode="outlined"
        style={styles.searchBar}
      />

      {/* lista com os lembretes encontrados no banco */}
      <FlatList
        data={lembretesFiltrados}
        keyExtractor={(item) => item._id!.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <Card mode="contained" style={styles.card}>
            <Card.Content>
              <View style={styles.headerContainer}>
                <Text style={styles.medicamento}>{item.nomeMedicamento}</Text>

                <IconButton
                  icon="delete"
                  size={22}
                  iconColor="#fff"
                  style={styles.botaoExcluir}
                  onPress={() => {
                    Alert.alert(
                      "Excluir lembrete?",
                      "Não será possível desfazer essa ação.",
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Excluir",
                          onPress: () => excluirLembrete(item._id!.toString()),
                          style: "destructive",
                        },
                      ],
                      { cancelable: true }
                    );
                  }}
                />
              </View>

              {/*as informações do lembrete q vao no cardzinho */}
              <View style={styles.infoGroup}>
                <Text style={styles.label}>Dosagem</Text>
                <Text style={styles.value}>{item.dose} {item.unidade}</Text>

                <Text style={styles.label}>Horário</Text>
                <Text style={styles.value}>
                  {new Date(item.agendamento).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </Text>

                <Text style={styles.label}>Data</Text>
                <Text style={styles.value}>
                  {new Date(item.agendamento).toLocaleDateString()}
                </Text>
                
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 16,
  },
    title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000'
  },
    botaoVoltar: {
        marginRight: 8,
        padding: 4
    },
      header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },


  searchBar: {
    marginBottom: 16,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 4,
    marginBottom: 14,
    elevation: 2,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  medicamento: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2661d6ff",
  },

  infoGroup: {
    marginTop: 4,
  },

  label: {
    fontSize: 14,
    color: "#7395d5ff",
    marginTop: 6,
  },

  value: {
    fontSize: 16,
    color: "#000000ff",
    fontWeight: "500",
  },

  botaoExcluir: {
  backgroundColor: "#d11a2a",
  width: 36,
  height: 36,
  borderRadius: 18,
  justifyContent: "center",
  alignItems: "center",
  margin: 0,
  padding: 0,
},
});
