# FazTudo

App móvel desenvolvido com Expo e React Native para conectar clientes a prestadores de serviços autônomos.

## Sobre

O FazTudo permite que usuários se cadastrem, façam login, busquem profissionais, salvem favoritos e gerenciem perfis. Profissionais também podem gerenciar seu perfil, visualizar avaliações e acessar planos de serviço.

## Principais telas

- Tela de login
- Tela de cadastro de usuário
- Tela de cadastro de profissional/autônomo
- Tela inicial do cliente
- Tela inicial do profissional
- Tela de perfil do usuário
- Pesquisa de serviços
- Favoritos
- Recuperação de senha
- Perfil profissional
- Edição de perfil profissional
- Avaliações profissionais
- Plano profissional

## Tecnologias

- Expo
- React Native
- Firebase Authentication
- Cloud Firestore
- React Navigation
- Async Storage
- Expo Camera
- QR Code SVG

## Estrutura do projeto

- `App.js` - ponto de entrada e navegação entre telas
- `app.json` - configuração do Expo
- `package.json` - dependências e scripts
- `src/screens/` - telas da aplicação
- `src/components/` - componentes reutilizáveis
- `src/services/` - configuração e serviços Firebase
- `assets/` - imagens e ícones do app

## Configuração e execução

1. Instale as dependências:

```bash
npm install
```

2. Inicie o Metro bundler do Expo:

```bash
npm run start
```

3. Execute no Android:

```bash
npm run android
```

4. Execute no iOS:

```bash
npm run ios
```

5. Execute no web:

```bash
npm run web
```

## Firebase

A configuração do Firebase está em `src/services/firebaseConfig.js`. O app usa Firebase Authentication e Firestore para autenticação de usuários e armazenamento de dados.

## Testes Maestro

Os testes de automação com Maestro estão armazenados na pasta `maestro/`.

Cenários disponíveis:

- `maestro/cadastro-usuario.yaml`: fluxo de cadastro de novo usuário, preenchimento de formulário e confirmação de sucesso.
- `maestro/forgot-password.yaml`: fluxo de recuperação de senha com envio de instruções por email.
- `maestro/login-invalido.yaml`: fluxo de login com credenciais incorretas e validação de mensagem de erro.
- `maestro/login-valido.yaml`: fluxo de login válido com validação da tela inicial e retorno para o login.

## Observações

- O projeto utiliza `react-native-gesture-handler`, `react-native-reanimated` e `react-native-safe-area-context`, que são requisitos comuns para navegação no React Native.
- A propriedade `jsEngine` está definida como `hermes` em `app.json`.

## Personalização

Para ajustar o pacote Android, edite `app.json` em `expo.android.package`.

## Contato

Este README foi gerado automaticamente com base na estrutura do projeto. Ajuste o conteúdo conforme necessário para adicionar informações sobre fluxo de usuário, estados e configuração de Firebase adicional.
