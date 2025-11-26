import { addDoc, collection, deleteDoc, doc, getDocs, query, Timestamp, where } from 'firebase/firestore';
import Realm from 'realm';
import { Lembrete, openRealm } from '../database/realm';
import { auth, db } from './firebase';

interface SyncObserver {
  onSyncStart(): void;
  onSyncComplete(success: boolean, error?: any): void;
  onItemSynced(item: Lembrete, operation: 'create' | 'delete'): void;
}

class SyncService {
  private realm: Realm | null = null;
  private isSyncing = false;
  private observers: SyncObserver[] = [];
  private syncQueue: Set<string> = new Set();

  public async getRealmInstance(): Promise<Realm> {
    if (!this.realm || this.realm.isClosed) {
      this.realm = await openRealm();
      const lembretes = this.realm.objects<Lembrete>('Lembrete');
      lembretes.addListener(this.onLembretesChange);
    }
    return this.realm;
  }

  addObserver(observer: SyncObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: SyncObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) this.observers.splice(index, 1);
  }

  private notifyObservers(event: 'start' | 'complete' | 'itemSynced', data?: any): void {
    this.observers.forEach(observer => {
      try {
        switch (event) {
          case 'start':
            observer.onSyncStart();
            break;
          case 'complete':
            observer.onSyncComplete(data.success, data.error);
            break;
          case 'itemSynced':
            observer.onItemSynced(data.item, data.operation);
            break;
        }
      } catch { }
    });
  }

  async start() {
    if (!auth.currentUser) return;
    if (this.realm && !this.realm.isClosed) return;

    console.log("sincronização iniciada");
    this.realm = await this.getRealmInstance();
    await this.syncPendingLembretes();
  }

  stop() {
    if (this.realm && !this.realm.isClosed) {
      const lembretes = this.realm.objects<Lembrete>('Lembrete');
      lembretes.removeListener(this.onLembretesChange);
      this.realm.close();
      this.realm = null;
      console.log("sincronização parada");
    }
  }

  public async startSync() {
    console.log("sincronização manual iniciada");
    await this.syncPendingLembretes();
  }

  private onLembretesChange = (collection: any, changes: any) => {
    if (!changes) {
      this.syncPendingLembretes();
      return;
    }

    const hasInsertions = changes.insertions?.length > 0;
    const hasDeletions = changes.deletions?.length > 0;

    if (hasInsertions) {
      this.syncNewItems(changes.insertions, collection);
    }

    if (hasDeletions) {
      this.handleDeletions(changes.deletions);
    }
  };

  private async syncNewItems(insertions: number[], collection: any): Promise<void> {
    if (!this.realm || !auth.currentUser) return;

    this.notifyObservers('start');
    let success = true;
    let error: any = null;

    try {
      for (const index of insertions) {
        const lembrete = collection[index] as Lembrete;
        if (lembrete && !lembrete.sincronizado) {
          await this.syncSingleItem(lembrete, 'create');
        }
      }
    } catch (err) {
      success = false;
      error = err;
      console.error('Erro ao sincronizar novos itens:', err);
    }

    this.notifyObservers('complete', { success, error });
  }

  private async syncSingleItem(lembrete: Lembrete, operation: 'create' | 'delete'): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      const realmId = lembrete._id.toHexString();

      if (this.syncQueue.has(realmId)) return;
      this.syncQueue.add(realmId);

      await addDoc(collection(db, "lembretes"), {
        userId,
        nomeMedicamento: lembrete.nomeMedicamento,
        dose: lembrete.dose,
        unidade: lembrete.unidade,
        agendamento: Timestamp.fromDate(new Date(lembrete.agendamento)),
        realmId,
        createdAt: Timestamp.now(),
      });

      if (this.realm && !this.realm.isClosed) {
        this.realm.write(() => {
          lembrete.sincronizado = true;
        });
      }

      this.notifyObservers('itemSynced', { item: lembrete, operation });
      console.log(`Lembrete sincronizado: ${lembrete.nomeMedicamento}`);

    } catch (error) {
      console.error(`Erro ao sincronizar lembrete "${lembrete.nomeMedicamento}":`, error);
      throw error;
    } finally {
      this.syncQueue.delete(lembrete._id.toHexString());
    }
  }

  private async handleDeletions(deletions: number[]): Promise<void> {
    console.log(`${deletions.length} itens deletados localmente`);
  }

  public async deleteLembreteFromFirestore(realmId: string): Promise<void> {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, "lembretes"),
        where("realmId", "==", realmId),
        where("userId", "==", auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);

      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(doc(db, "lembretes", docSnapshot.id));
        console.log(`Lembrete deletado do Firestore: ${realmId}`);
      }
    } catch (error) {
      console.error(`Erro ao deletar lembrete do Firestore:`, error);
    }
  }

  private syncPendingLembretes = async () => {
    if (this.isSyncing) return;

    this.isSyncing = true;
    this.notifyObservers('start');
    let success = true;
    let error: any = null;

    try {
      this.realm = await this.getRealmInstance();

      const pending = this.realm
        .objects<Lembrete>('Lembrete')
        .filtered('sincronizado == false');

      if (pending.length === 0) {
        this.isSyncing = false;
        this.notifyObservers('complete', { success: true });
        return;
      }

      for (const lembrete of pending) {
        try {
          await this.syncSingleItem(lembrete, 'create');
        } catch (err) {
          success = false;
          error = err;
          console.error(`Erro ao sincronizar lembrete "${lembrete.nomeMedicamento}":`, err);
        }
      }
    } catch (err) {
      success = false;
      error = err;
      console.error("Erro na sincronização:", err);
    } finally {
      this.isSyncing = false;
      this.notifyObservers('complete', { success, error });
    }
  };
}

export const syncService = new SyncService();
