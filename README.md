# Guia Completo: Configurando seu Aplicativo Expo

Este guia irá orientá-lo através do processo de configuração e execução do seu aplicativo Expo, mesmo que você não tenha experiência prévia em programação.

## Pré-requisitos

1. Instale o [Node.js](https://nodejs.org/) no seu computador.
2. Instale o [Git](https://git-scm.com/downloads) no seu computador.
3. Tenha um smartphone (iOS ou Android) para executar o aplicativo.

## Passo 1: Abra o Terminal ou Prompt de Comando

- No Windows: Pressione `Win + R`, digite `cmd` e pressione Enter.
- No macOS: Pressione `Cmd + Space`, digite `Terminal` e pressione Enter.
- No Linux: Pressione `Ctrl + Alt + T`.

## Passo 2: Navegue até o Diretório Desejado

1. Use o comando `cd` para navegar até onde você deseja armazenar seu projeto.
   Exemplo: `cd Documentos/Projetos`

2. Se você não tem certeza da sua localização atual, use:
   - No Windows: `echo %cd%`
   - No macOS/Linux: `pwd`

## Passo 3: Clone o Repositório

1. Execute o seguinte comando:
   ```
   git clone https://github.com/Smart624/MindHarbourApp
   ```

2. Aguarde o processo de clonagem ser concluído.

## Passo 4: Navegue até o Diretório do Projeto

1. Execute:
   ```
   cd MindHarbourApp
   ```

## Passo 5: Instale as Dependências

1. Execute:
   ```
   npm install
   ```

2. Isso pode levar alguns minutos. Aguarde a conclusão.

## Passo 6: Inicie o Servidor de Desenvolvimento Expo

1. Execute:
   ```
   npx expo start
   ```

2. Isso iniciará o servidor de desenvolvimento e exibirá um código QR no terminal.

## Passo 7: Execute o Aplicativo no Seu Telefone

1. Instale o aplicativo Expo Go no seu smartphone:
   - [Expo Go para iOS](https://apps.apple.com/app/expo-go/id982107779)
   - [Expo Go para Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Abra o aplicativo Expo Go no seu telefone.

3. Escaneie o código QR:
   - iOS: Use o aplicativo de Câmera integrado para escanear o código QR.
   - Android: Use a opção "Escanear código QR" no aplicativo Expo Go.

4. Aguarde o aplicativo carregar no seu dispositivo. Isso pode levar alguns minutos na primeira vez.

## Solução de Problemas

- Se o aplicativo não carregar, tente fechar o Expo Go e escanear o código QR novamente.
- Certifique-se de que seu computador e telefone estão na mesma rede Wi-Fi.
- Se encontrar algum erro, tente parar o servidor (Ctrl+C no terminal) e executar `npx expo start` novamente.

## Próximos Passos

- O código principal do seu aplicativo está localizado no diretório `app`.
- Para começar a desenvolver, você pode editar os arquivos neste diretório.
- Consulte a [documentação do Expo](https://docs.expo.dev/) para obter mais informações sobre como desenvolver seu aplicativo.

## Executando o Aplicativo no Simulador do Android Studio

Se você preferir usar um emulador em vez de um dispositivo físico, você pode usar o Simulador do Android Studio. Aqui estão as etapas para configurar e usar o Simulador do Android Studio:

### Configuração do Android Studio (para Windows, Mac ou Linux):

1. Baixe e instale o [Android Studio](https://developer.android.com/studio).

2. Durante a instalação, certifique-se de selecionar a opção para instalar o Android SDK.

3. Após a instalação, abra o Android Studio e vá para "Tools" > "SDK Manager".

4. Na aba "SDK Platforms", selecione a versão mais recente do Android (ou a versão que você deseja testar).

5. Na aba "SDK Tools", certifique-se de que "Android SDK Build-Tools" e "Android Emulator" estão instalados.

6. Clique em "Apply" para instalar os componentes selecionados.

### Criando um Dispositivo Virtual Android (AVD):

1. No Android Studio, vá para "Tools" > "AVD Manager".

2. Clique em "Create Virtual Device".

3. Escolha um dispositivo (por exemplo, Pixel 4) e clique em "Next".

4. Selecione uma imagem do sistema (recomenda-se uma versão recente do Android) e clique em "Next".

5. Dê um nome ao seu AVD e clique em "Finish".

### Executando o Aplicativo no Emulador:

1. Inicie o emulador do Android Studio abrindo o AVD Manager e clicando no botão de play ao lado do dispositivo virtual que você criou.

2. No terminal do seu projeto Expo, quando o servidor de desenvolvimento estiver rodando, pressione a tecla "a" para abrir o aplicativo no emulador Android.

3. O Expo irá construir o aplicativo e instalá-lo no emulador automaticamente.

Lembre-se de que usar o emulador pode consumir mais recursos do seu computador em comparação com o uso de um dispositivo físico. Certifique-se de que seu computador atende aos requisitos mínimos para executar o Android Studio e o emulador.

Parabéns! Agora você tem várias opções para executar e testar seu aplicativo Expo. Bom desenvolvimento!