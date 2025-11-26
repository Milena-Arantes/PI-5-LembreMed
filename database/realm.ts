import Realm from "realm";

export interface Lembrete {
  _id: Realm.BSON.ObjectId;
  nomeMedicamento: string;
  dose: string;
  unidade: string;
  agendamento: Date;
  sincronizado: boolean;
}

export const LembreteSchema: Realm.ObjectSchema = {
  name: "Lembrete",
  primaryKey: "_id",
  properties: {
    _id: "objectId",
    nomeMedicamento: "string",
    dose: "string",
    unidade: "string",
    agendamento: "date",
    sincronizado: { type: "bool", default: false },
  },
};

export async function openRealm(): Promise<Realm> {
  console.log("Abrindo o Realm");

  const realm = await Realm.open({
    path: "lembreMed.realm",
    schema: [LembreteSchema],
  });

  //console.log("Realm aberto com sucesso em:", realm.path);

  return realm;
}