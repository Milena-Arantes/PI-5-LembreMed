import { auth } from '@/services/firebase';
import * as Notifications from 'expo-notifications';
import { Slot } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../context/auth";
import { syncService } from '../services/sincronizacao';

// NAO pode ficar dentro de função, vai dar problema
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Layout() {

  useEffect(() => {
    //comentar dps, só pra testar se está sendo carregado corretamente
    //console.log("_layout.tsx carregado");

    const setupNotifications = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('alarm-channel', {
          name: 'Alarmes',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'alarm_sound.wav',
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        });
        console.log("Canal de alarme para Android criado.");
      }
    };

    setupNotifications();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("usuário autenticado, iniciando SyncService");
        await syncService.start();
        
        setTimeout(async () => {
          const status = syncService.getStatus();

          console.log("status do SyncService:", status);
          console.log("teste observer");

          await syncService.testObserver();
        }, 2000);
      } else {
        console.log("nenhum usuário autenticado, o SyncService nao será iniciado");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <PaperProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </PaperProvider>
  );
}
