//      funcion para cambiar el texto de bienvenida del chatbot
      function stringManipulate(bot) {
          let originalString = 'Hola, ¿en qué te puedo ayudar?';
          let newString = "Bienvenido al Asistente Virtual Claro Chat, ¿En qué te puedo ayudar? Te recomendamos ingresar palabras claves para que la búsqueda sea más efectiva. Ej: <em>\"planes celulares\"</em>";

          bot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
            if (messageData.message !== originalString) {
              return next(messageData)
            } else {
              messageData.message = newString;
              return next(messageData);
            }
          });
          console.log("nuevo texto bienvenida..");
        }


// Funcion para cambiar los textos de NO RESPUESTA para enviar al Chat en vivo
      function noRespuesta(chatBot) {
          var urlChat = "https://claroecuador.s1gateway.com/integrations/chats/chat_claroecuador/index.html?cpgid=10001&origen=O.MI%20CLARO%20WEB";

          //mensajes originales
          let originalMsg_1 = 'Lo siento, no he podido encontrar información relacionada con tu pregunta. Por favor, inténtalo de nuevo con otras palabras.';

          let originalMsg_2 = 'He mirado y no encuentro nada que responda a tu pregunta. Por favor, realiza una nueva búsqueda usando otras palabras.';

          let originalMsg_3 = 'Lo siento, no he podido encontrar respuestas para tu duda.';

          let originalMsg_4 = 'Creo que ninguna de las opciones que he encontrado te pueden ayudar. Por favor, escribe otra frase o palabra.';

          //mensajes que reemplazan los originales
          let newMsg_1 = "No he podido encontrar información relacionada con tu pregunta, ¿quieres hablar con un asesor? <br><a href='"+urlChat+"' target='_blank'>Si, por favor.</a>";

          let newMsg_2 = "Creo que ninguna de las opciones que he encontrado te pueden ayudar, ¿quieres hablar con un asesor? <br><a href='"+urlChat+"' target='_blank'>Si, por favor.</a>";

          //cuando no hay respuesta encontrada
          // 1)
          chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
            if (messageData.message !== originalMsg_1) {
              return next(messageData)
            }
              else {
              messageData.message = newMsg_1;
              return next(messageData);
            }
          });
          // 2) -------------------------------------------------->
          chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
            if (messageData.message !== originalMsg_2) {
              return next(messageData)
            }
              else {
              messageData.message = newMsg_1;
              return next(messageData);
            }
          });
          // 3)-------------------------------------------------->
          chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
            if (messageData.message !== originalMsg_3) {
              return next(messageData)
            }
              else {
              messageData.message = newMsg_1;
              return next(messageData);
            }
          });

          //cuando el chatbot muestra respuestas pero el usuario ha indicado "NO" a las respuestas ofrecidas-------------------------------------------------->
          chatBot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
            if (messageData.message !== originalMsg_4) {
              return next(messageData)
            }
              else {
              messageData.message = newMsg_2;
              return next(messageData);
            }
          });

          //contar los "NO" para enviar a chat en vivo....-------------------------------------------------->
          var i = 0;
          chatBot.subscriptions.onDisplayUserMessage(function(messageData, next) {
              if (messageData.message !== "No") {
                  return next(messageData);
              }
              else {

                  //cuenta cuantos "NO" antes de enviar al chat en vivo
                  i++;
                  if(i>=2){
                      console.log("Ya son 2 'NO' ---> i= "+i);
                      i=0;//resetea valor para volver a aplicar el evento en otro flujo de conversación
                      const chatBotmessageData = {
                          type: 'answer',
                          message: newMsg_2,
                        }

                       return next(messageData) + next(chatBot.actions.displayChatbotMessage(chatBotmessageData));
                  }
                   messageData.message = "No";
                   return next(messageData);
                }
            });
        }


         // accciones onReady-------------------------------------------------->

        function openWindow(chatBot){
               chatBot.subscriptions.onReady(function(next) {
                   //borra la lista de conversaciones previas (sesión) cada vez que se carga el chat
                   //chatBot.actions.resetSession();
                   //abre la ventana de conversación automaticamente, sin necesidad del launcher...
                   //chatBot.actions.showConversationWindow();
                   //console.log("lanza ventana sin laucher..");
                });
          }


        function ratingEscaleAgent(bot){
               bot.subscriptions.onDisplayChatbotMessage(function(messageData, next) {
                    // BEFORE DisplayChatbotMessage action execution
                    if (messageData.message=="Por favor dinos por que"){
                      console.log("responde NO")
                      return
                    }else{
                      messageData.message = '' + messageData.message;
                      return next(messageData);
                    }

                });
        }



//chatbot
          var apiKey = 'BV9J3yNDQbbPKBiKfnxMyIMw7+lusNkCF4cu8TZuqPM=';
          var domainKey = 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJwcm9qZWN0IjoiY2xhcm9fZWNfY2hhdGJvdF9lcyIsImRvbWFpbl9rZXlfaWQiOiJCVjlLdi1feU5NRU5jajJDV29EQ1hnOjoifQ.GXVBKmhtit5w_lpIUypgPrOfLnmqGzS4XxXGp_EG7gxDqStpwvQnkmBlw97_bUdeoGZVVZ04nfwTejzR6BMDtQ';
          var auth = { domainKey: domainKey, inbentaKey: apiKey };
          var conf =
          {
            lang: 'es',
            answers: {
                answerAttributes: ['ANSWER_TEXT'],
                sideBubbleAttributes: ['SIDEBUBBLE_TEXT'],
            },
            userType: 5,
            showRatingWithinMessages: true,
            ratingOptions: [{
                    id: 1,
                    label: 'Si',
                    comment: false
                },
                {
                    id: 2,
                    label: 'No',
                    comment: true
                }
            ],
            environment: "production",
            launcher: {
                title: ""
            },

            adapters: [
//                llama la funcion para cambiar el texto de bienvenida del chatbot
                stringManipulate,
                noRespuesta,
                openWindow,
                ratingEscaleAgent
            ],
            labels: {
                es: {
                    'yes': 'Si',
                    'no': 'No',
                    'generic-error-message': 'Por favor intente con otra pregunta',
                    'enter-question': 'Pregunte aquí',
                    'interface-title': 'Pregúntame...',
                    'guest-name': 'Tu',
                    'help-question': '¿Cómo te puedo ayudar?',
                    'thanks': 'Gracias!',
                    'rate-content': 'Esto te ayudó?',
                    'form-message': 'Por favor dinos por que',
                    'submit': 'Enviar',
                    'alert-title' : 'OOOOPS...!',
                    'alert-message' : 'Algo salió mal, por favor intenta de nuevo.',
                    'alert-button' : 'Intenta de nuevo',
                    'agent-joined' : '{agentName} se ha unido al chat',
                    'agent-left' : '{agentName} ha dejado el chat',
                    'wait-for-agent' : 'Esperando por un agente...',
                    'no-agents' : 'No hay agentes disponibiles',
                    'close-chat' : '¿Quiere cerrar el chat?',
                    'chat-closed' : 'Chat cerrado',
                    'download' : 'Descargar',
                    'escalate-chat' : '¿quiere platicar con un humano?',
                    'agent-typing': '{agentName} está escribiendo',
                    'agents-typing': '{agentName} y {agentName2}  estan escribiendo',
                    'several-typing': 'Varias personas están escribiendo'
                }
            },
            avatar: {
                name: 'Claro Chat',// el nombre del AVATAR es colocado en el CSS (linea aprox 138).
                shouldUse: true, // only set to true if you have avatar videos to show
                videos: {
                    enter: [
                        'https://static-or01.inbenta.com/49974c4abf8377d0900f49cc37a6b6089eae4bbf30887e36c5ce35ee9e68416b/LauraVideos/va_idle_04.mp4'
                    ],
                    // Laura does not enter/exit on live site
                    // video link played when avatar is waiting a user action
                    idle: [
                        'https://static-or01.inbenta.com/49974c4abf8377d0900f49cc37a6b6089eae4bbf30887e36c5ce35ee9e68416b/LauraVideos/va_idle_04.mp4'
                    ],
                    // video link played when avatar say something
                    speak: [
                        'https://static-or01.inbenta.com/49974c4abf8377d0900f49cc37a6b6089eae4bbf30887e36c5ce35ee9e68416b/LauraVideos/va_idle_04.mp4'
                    ]
                },
                // Image to be shown for incompatible browsers
                // Note to self: find fallbackImage URL
                fallbackImage: ''
            }
        }
        InbentaChatbotSDK.buildWithDomainCredentials(auth, conf);
