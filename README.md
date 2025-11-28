![Fatec](./Fatec.jpg)

##  Equipe de Desenvolvimento

- **ANDRÉIA DOMINGOS SERAFIM**
- **GABRIEL CRUZ DOS PASSOS**
- **MILENA OLIVEIRA ARANTES**
- **NÚBIA CAROLINE RAMOS CISCATI**

# LembreMed 💊

Aplicativo mobile para gerenciamento de lembretes de medicamentos, desenvolvido com React Native e Expo. O app permite criar lembretes personalizados com notificações push e sincronização em tempo real usando Firebase.

## Funcionalidades

- Cadastro e login de usuários (Firebase Auth)
- Criação de lembretes de medicamentos com data/hora
- Notificações push locais
- Sincronização automática com Firebase Firestore
- Armazenamento offline com Realm Database
- Interface intuitiva com React Native Paper
- Navegação com Expo Router

## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI**
- **Android Studio** (para emulador Android) ou **Xcode** (para iOS)

Para rodar no dispositivo físico:
- **Expo Go** app instalado no seu smartphone

## Configuração do Ambiente

### 1. Instalar dependências globais

```bash
# Instalar Expo CLI globalmente
npm install -g @expo/cli

# Ou usando yarn
yarn global add @expo/cli
```

### 2. Clonar e instalar o projeto

```bash
# Clonar repositório
git clone https://github.com/Milena-Arantes/PI-5-LembreMed.git
cd PI-5-LembreMed

# Instalar dependências
npm install

# Ou usando yarn
yarn install
```

## Como Executar

### Opção 1: Expo Go

```bash
# Iniciar servidor de desenvolvimento
npx expo start

# Ou
npm start
```

Após executar o comando:

1. **No celular:** Abra o app Expo Go
2. **Android:** Escaneie o QR code com o Expo Go
3. **iOS:** Escaneie o QR code com a câmera nativa ou Expo Go

### Opção 2: Emulador Android

```bash
# Iniciar no emulador Android
npm run android

# Ou
npx expo run:android
```

### Opção 3: Simulator iOS (apenas macOS)

```bash
# Iniciar no simulator iOS
npm run ios

# Ou
npx expo run:ios
```

## Gerar APK para Android

Para gerar uma versão de produção (APK/AAB):

### Usando EAS Build (Recomendado)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configurar build
eas build:configure

# Gerar APK para Android
eas build --platform android --profile preview

# Gerar para produção
eas build --platform android --profile production
```

### Build local (Alternativa)

```bash
# Gerar bundle local
npx expo export

# Build Android local (requer Android SDK)
npx expo run:android --variant release
```

## Estrutura do Projeto

```
├── app/                    # Telas da aplicação (Expo Router)
│   ├── _layout.tsx         # Layout principal
│   ├── index.tsx          # Tela inicial/login
│   ├── cadastro.tsx       # Tela de cadastro
│   ├── home.tsx           # Tela principal
│   ├── novoLembrete.tsx   # Criar lembrete
│   └── consultarLembrete.tsx # Visualizar lembretes
├── components/            # Componentes reutilizáveis
├── services/             # Serviços (Firebase, Sincronização)
│   ├── firebase.ts       # Configuração Firebase
│   └── sincronizacao.ts  # Sincronização offline/online
├── database/             # Banco local (Realm)
│   └── realm.ts          # Schema e configuração
├── context/              # Contextos React
│   └── auth.tsx          # Contexto de autenticação
└── assets/               # Imagens e recursos
```

## Variáveis de Ambiente

O projeto usa Firebase com configuração direta. Para personalizar, edite:

```typescript
// services/firebase.ts
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  // ... outras configurações
};
```

## 🛠️ Tecnologias Utilizadas

- **[Expo](https://expo.dev)** - Plataforma de desenvolvimento
- **[React Native](https://reactnative.dev)** - Framework mobile
- **[TypeScript](https://typescriptlang.org)** - Linguagem
- **[Firebase](https://firebase.google.com)** - Backend (Auth + Firestore)
- **[Realm](https://realm.io)** - Banco de dados local
- **[Expo Router](https://expo.github.io/router)** - Navegação
- **[React Native Paper](https://reactnativepaper.com)** - Componentes UI
- **[Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)** - Notificações push

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm start                  # Iniciar Expo dev server
npm run android           # Rodar no Android
npm run ios              # Rodar no iOS
npm run web              # Rodar no navegador

# Build e Deploy
eas build                # Build com EAS
eas submit               # Enviar para stores

# Utilidades
npm run lint            # Verificar código
npm run reset-project   # Resetar projeto
```

## 🐛 Resolução de Problemas

### Problema: "Metro bundler não consegue resolver módulos"
```bash
# Limpar cache
npx expo start --clear
```

### Problema: "Build falhou"
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Problema: "Firebase não conecta"
- Verifique as credenciais em `services/firebase.ts`
- Certifique-se que o Firestore está ativo no Firebase Console
