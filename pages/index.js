import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import appConfig from "../config.json";
import React from "react";
import { useRouter } from "next/router";

function Title(props) {
  const Tag = props.tag || 'h1';
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals["000"]};
          font-size: 24px;
          font-weigth: 600;
        }
      `}</style>
    </>
  );
}

/*
function HomePage() {
    return (
        <div>
            <GlobalStyle />
            <Title tag="h2">Boas vindas de volta!</Title>
            <h2>Discord - Alura Kirby</h2>
            
        </div>
    )

  }
  
  export default HomePage
*/

export default function PaginaInicial() {
  const [username, setUsername] = React.useState();
  const [name, setName] = React.useState("");
  const roteamento = useRouter();
  const [userExiste, setUserExiste] = React.useState(false);

  function getGithubUser(event) {
    fetch(`https://api.github.com/users/${event.target.value}`)
      .then(async (data) => {
        var obj = await data.json();
        if (obj.message == undefined) {
          setUserExiste(true);
          setName(obj.name);
          setUsername(obj.login);
        } else if (obj.message == "Not Found" || event.target.value == "") {
          setUserExiste(false);
          setName("");
          setUsername("");
        } else {
          setUserExiste(true);
          setName("");
          setUsername(event.target.value);
        }
      })
      .catch((error) => {
        console.log(error);
        return "";
      });
  }

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[500],
          // backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)',
          backgroundImage:
            "url(https://www.nawpic.com/media/2020/american-flag-nawpic-4.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* Formul??rio */}
          <Box
            as="form"
            onSubmit={function (event) {
              event.preventDefault();
              if (userExiste) {
                appConfig.username = username;
                roteamento.push(`/chat?username=${username}`);
              } else {
                alert("Por favor, informe um usu??rio.", "");
              }
            }}
            // onSubmit={function(event) {
            //   event.preventDefault();
            //   roteamento.push(`/chat?username=${username}`);
            // }}

            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Title tag="h2">Bem vindos de volta!</Title>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              onChange={(event) => getGithubUser(event)}
              // value={username}
              autoComplete="off"
              autoFocus
              // onChange={function (event){
              //   console.log('usu??rio digitou', event.target.value);
              //   const valor = event.target.value;

              //   setUsername(valor);
              // }}

              fullWidth
              placeholder="Insira seu usu??rio do github"
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />

            <Button
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formul??rio */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
              }}
              src={`https://github.com/${username}.png`}
            />

            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {username}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
  