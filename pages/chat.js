import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';
import React from "react";
import { useRouter } from "next/router";
import appConfig from "../config.json";
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import { createClient } from "@supabase/supabase-js";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM5NzY1MiwiZXhwIjoxOTU4OTczNjUyfQ.45Lk22Op0q3o0btG4EBI7PTWnBsrfLKVt9ycGLyocic";
const SUPABASE_URL = "https://rslsrubpdxhhbvevrkpi.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
      .from('mensagens')
      .on('INSERT', (respostaLive) => {
        adicionaMensagem(respostaLive.new);
      })
      .subscribe();
  }

export default function ChatPage() {
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
  // console.log('roteamento.query: ' + roteamento.query)
 // console.log('Usuario logado: ' + usuarioLogado)
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        console.log('Dados da consulta:', data);
        setListaDeMensagens(data);
      });
  
  const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
    console.log('Nova mensagem:', novaMensagem);
    console.log('listaDeMensagens:', listaDeMensagens);

    setListaDeMensagens((valorAtualDaLista) => {
      console.log('valorAtualDaLista:', valorAtualDaLista);
      return [
        novaMensagem,
        ...valorAtualDaLista,
      ]
    });
  });

  return () => {
    subscription.unsubscribe();
  }
}, []);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      // id: listaDeMensagens.length + 1,
      de: usuarioLogado,
      texto: novaMensagem,
    };
    // const mensagem = {
    //   // id: listaDeMensagens.length + 1,
    //   de: 'vanessametonini',
    //   texto: novaMensagem,
    // };

    supabaseClient
      .from('mensagens')
      .insert([
        // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
        mensagem
      ])
      .then(({ data }) => {
        console.log('Criando mensagem: ', data);
        setListaDeMensagens([
            // data[0], 
            ...listaDeMensagens,
        ]);
      });

    setMensagem('');
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
            <MessageList mensagens={listaDeMensagens} setListaDeMensagens={setListaDeMensagens} />

          {/* <MessageList mensagens={listaDeMensagens} /> */}
          {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleNovaMensagem(mensagem);
              }}
              iconName="FaArrowRight"
              styleSheet={{
                minWidth: "50px",
                minHeight: "50px",
                borderRadius: "50%",
                padding: "0 3px 0 0",
                marginRight: "12px",
              }}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["900"],
                mainColor: appConfig.theme.colors.primary[100],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[200],
              }}
            />
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNovaMensagem(`:sticker: ${sticker}`);
              }}/>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
    function HandleDeletaMensagem(id){
        const novaLista = props.mensagens.filter((mensagemFiltrada) => {
            if(mensagemFiltrada.id !== id){
                return mensagemFiltrada;
            }
        })
        supabaseClient
            .from("mensagens")
            .delete()
            .match({id : id})
            .then((data) => {
                console.log(data)
            });

        props.setListaDeMensagens([
            ...novaLista
        ]);
    }
//   console.log(props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {(new Date().toLocaleDateString())}
                <Icon
                        label="Icon Component"
                        name="FaTrash"
                        size='13px'
                        onClick={ ()=>{
                          HandleDeletaMensagem(mensagem.id)
                        }}
                        styleSheet={{
                            display: 'inline-block',
                            cursor: 'pointer',
                            fontSize: '10px',
                            marginLeft: '8px',
                            color: appConfig.theme.colors.neutrals[300],
                        }}
                    />
              </Text>
            </Box>
            {mensagem.texto.startsWith(':sticker:') ?
                (
                    <Image src={mensagem.texto.replace(':sticker:', '')} />
                ) :
                (
                    mensagem.texto
                )}
          </Text>
        );
      })}
    </Box>
  )
}

// import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';
// import React from 'react';
// import { createClient } from '@supabase/supabase-js';
// import { useRouter } from 'next/router';
// import appConfig from '../config.json';
// import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

// const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM5NzY1MiwiZXhwIjoxOTU4OTczNjUyfQ.45Lk22Op0q3o0btG4EBI7PTWnBsrfLKVt9ycGLyocic";
// const SUPABASE_URL = "https://rslsrubpdxhhbvevrkpi.supabase.co";
// const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// // export const getServerSideProps = async () => {
// //     const { SUPABASE_ANON_KEY, SUPABASE_URL } = supabaseClient;

// //     return {
// //       props: {
// //         SUPABASE_ANON_KEY,
// //         SUPABASE_URL,
// //       },
// //     };
// // };

// function escutaMensagensEmTempoReal(adicionaMensagem) {
//     return supabaseClient
//       .from('mensagens')
//       .on('INSERT', (respostaLive) => {
//         adicionaMensagem(respostaLive.new);
//       })
//       .subscribe();
//   }

// export default function ChatPage() {
//     const roteamento = useRouter();
//     const usuarioLogado = roteamento.query.username;
//     // console.log('roteamento.query: ' + roteamento.query)
//     // console.log('Usuario logado: ' + usuarioLogado)
//     const [mensagem, setMensagem] = React.useState('');
//     const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

//     React.useEffect(() => {
//         supabaseClient
//         .from('mensagens')
//         .select('*')
//         .order('id', { ascending: false})
//         .then(({ data }) => {
//             console.log('Dados da consulta:', data);
//             setListaDeMensagens(data);
//         });

    //     const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
    //         console.log('Nova mensagem:', novaMensagem);
    //         console.log('listaDeMensagens:', listaDeMensagens);

    //         setListaDeMensagens((valorAtualDaLista) => {
    //           console.log('valorAtualDaLista:', valorAtualDaLista);
    //           return [
    //             novaMensagem,
    //             ...valorAtualDaLista,
    //           ]
    //         });
    //       });

    //       return () => {
    //         subscription.unsubscribe();
    //       }
    // }, []);

//     function handleNovaMensagem(novaMensagem){
//       const mensagem ={
//         // id: listaDeMensagens.length + 1,
//         de: usuarioLogado,
//         texto: novaMensagem,
//       };

//       supabaseClient
//       .from('mensagens')
//       .insert([
//         // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
//         mensagem
//       ])
//       .then(({ data }) => {
//         console.log('Criando mensagem: ', data);
//         setListaDeMensagens([
//             data[0],
//             ...listaDeMensagens,
//           ]);
//         });
//         setMensagem('');
//   }
//     // });
//     //     setMessage('');
//     // }

//     return (
//         <Box
//             styleSheet={{
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 backgroundColor: appConfig.theme.colors.primary[500],
//                 // backgroundImage: `url(https://cdn.wallpaperjam.com/1c39c052560aa26f8957df90d56c7da2a5d1a564/nintendo-kirby-video-games-faces.png)`,
//                 backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
//                 color: appConfig.theme.colors.neutrals['000']
//             }}
//         >
//             <Box
//                 styleSheet={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     flex: 1,
//                     boxShadow: '0 2px 10px 0 rgb(0 0 0 / 80%)',
//                     opacity: 0.9,
//                     borderRadius: '5px',
//                     backgroundColor: appConfig.theme.colors.neutrals[700],
//                     height: '100%',
//                     maxWidth: '95%',
//                     maxHeight: '95vh',
//                     padding: '32px',
//                 }}
//             >
//                 <Header  />
//                 <Box
//                     styleSheet={{
//                         position: 'relative',
//                         display: 'flex',
//                         flex: 1,
//                         height: '80%',
//                         backgroundColor: appConfig.theme.colors.neutrals[600],
//                         flexDirection: 'column',
//                         borderRadius: '5px',
//                         padding: '16px',
//                     }}
//                 >

//                   <MessageList mensagens={listaDeMensagens} setListaDeMensagens={setListaDeMensagens} />

//                     {/* {listaDeMensagens.map((mensagemAtual) => {
//                       return(
//                         <li key={mensagemAtual.id}>
//                             {mensagemAtual.de}: {mensagemAtual.texto}
//                         </li>
//                       )
//                     })} */}
//                     <Box
//                         as="form"
//                         styleSheet={{
//                             display: 'flex',
//                             alignItems: 'center',
//                         }}
//                     >
//                         <TextField
//                             value={mensagem}
//                             onChange={(event)=> {
//                                 const valor = event.target.value;
//                                 setMessage(valor);
//                             }}
//                             onKeyPress={(event) =>{
//                               if(event.key === 'Enter'){
//                                 event.preventDefault();
//                                 handleNovaMensagem(mensagem);
//                               }
//                             }}

//                             placeholder="Insira sua mensagem aqui..."
//                             type="textarea"
//                             styleSheet={{
//                                 width: '100%',
//                                 border: '0',
//                                 resize: 'none',
//                                 borderRadius: '5px',
//                                 padding: '6px 8px',
//                                 backgroundColor: appConfig.theme.colors.neutrals[800],
//                                 marginRight: '12px',
//                                 color: appConfig.theme.colors.neutrals[200],
//                             }}
//                         />
//                         <Button
//                             onClick={(e) => {
//                             e.preventDefault();
//                             handleNovaMensagem(message);
//                             }}
//                             iconName='FaArrowRight'
//                             styleSheet={{
//                             minWidth: '50px',
//                             minHeight: '50px',
//                             borderRadius: '50%',
//                             padding: '0 3px 0 0',
//                             marginRight: '12px',

//                           }}

//                           buttonColors={{
//                             contrastColor: appConfig.theme.colors.neutrals["900"],
//                             mainColor: appConfig.theme.colors.primary[100],
//                             mainColorLight: appConfig.theme.colors.primary[400],
//                             mainColorStrong: appConfig.theme.colors.primary[200],
//                           }}
//                         />
//                         <ButtonSendSticker
//                             onStickerClick={(sticker) => {
//                                 handleNovaMensagem(`:sticker: ${sticker}`)
//                             }}/>
//                     </Box>
//                 </Box>
//             </Box>
//         </Box>
//     )
// }

// function Header() {

//     return (
//         <>
//             <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
//                 <Text variant='heading5'>
//                     Chat
//                 </Text>
//                 <Button
//                     variant='tertiary'
//                     colorVariant='neutral'
//                     label='Logout'
//                     href="/"
//                 />
//             </Box>
//         </>
//     )
// }

// function MessageList(props) {

    // function HandleDeletaMensagem(id){
    //     const novaLista = props.mensagens.filter((mensagemFiltrada) => {
    //         if(mensagemFiltrada.id !== id){
    //             return mensagemFiltrada;
    //         }
    //     })

    //     supabaseClient
    //         .from("mensagens")
    //         .delete()
    //         .match({id : id})
    //         .then((data) => {
    //             console.log(data)
    //         });

    //     props.setListaDeMensagens([
    //         ...novaLista
    //     ]);
    // }

//     return (
//         <Box
//             tag="ul"
//             styleSheet={{
//                 overflow: 'auto',
//                 display: 'flex',
//                 flexDirection: 'column-reverse',
//                 flex: 1,
//                 color: appConfig.theme.colors.neutrals["000"],
//                 marginBottom: '16px',
//             }}
//         >
//             {props.mensagens.map((mensagem) => {
//               return(
//                 <Text
//                 key={mensagem.id}
//                 tag="li"
//                 styleSheet={{
//                     borderRadius: '5px',
//                     padding: '6px',
//                     marginBottom: '12px',
//                     hover: {
//                         backgroundColor: appConfig.theme.colors.neutrals[700],
//                     },
//                 }}
//             >
//                 <Box
//                     styleSheet={{
//                         marginBottom: '8px',
//                     }}
//                 >
//                     <Image
//                         styleSheet={{
//                             width: '20px',
//                             height: '20px',
//                             borderRadius: '50%',
//                             display: 'inline-block',
//                             marginRight: '8px',
//                         }}
//                         src={`https://github.com/${mensagem.de}.png`}
//                     />
//                     <Text tag="strong">
//                         {mensagem.de}
//                     </Text>
//                     <Text
//                         styleSheet={{
//                             fontSize: '10px',
//                             marginLeft: '8px',
//                             color: appConfig.theme.colors.neutrals[300],

//                         }}
//                         tag="span"
//                     >
//                         {(new Date().toLocaleDateString())}
                    // <Icon
                    //     label="Icon Component"
                    //     name="FaTrash"
                    //     size='13px'
                    //     onClick={ ()=>{
                    //         HandleDeletaMensagem(mensagem.id)
                    //     }}
                    //     styleSheet={{
                    //         display: 'inline-block',
                    //         cursor: 'pointer',
                    //         fontSize: '10px',
                    //         marginLeft: '8px',
                    //         color: appConfig.theme.colors.neutrals[300],
                    //     }}
                    // />
//                     </Text>
//                 </Box>
                // {mensagem.texto.startsWith(':sticker:') ?
                // (
                //     <Image src={mensagem.texto.replace(':sticker:', '')} />
                // ) :
                // (
                //     mensagem.texto
                // )}
//             </Text>
//           );
//       })}

//     </Box>
//   )
// }
