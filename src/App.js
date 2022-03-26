import React from "react";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { Typography, Grid, TextField, Button } from "@mui/material";
import Chip from "./Chip";
import { getApiData, saveData } from "./apiData";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import moment from "moment";
import "moment/min/locales.min";
import awsmobile from "./aws-exports";
import { Amplify, Auth, Hub } from "aws-amplify";
import Rating from "./Rating";
import Toolbar from "./Toolbar";
import Drawer from "./Drawer";
import { Box } from "@mui/system";

moment.locale("fr-FR");

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
const [localRedirectSignIn, productionRedirectSignIn] =
  awsmobile.oauth.redirectSignIn.split(",");

const [localRedirectSignOut, productionRedirectSignOut] =
  awsmobile.oauth.redirectSignOut.split(",");

const updatedawsmobile = {
  ...awsmobile,
  oauth: {
    ...awsmobile.oauth,
    redirectSignIn: isLocalhost
      ? localRedirectSignIn
      : productionRedirectSignIn,
    redirectSignOut: isLocalhost
      ? localRedirectSignOut
      : productionRedirectSignOut,
  },
};

Amplify.configure(updatedawsmobile);

const MomentToString = "YYYY-MM-DD";

export default function App() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState();
  const [dateMomentForm, setDateMomentForm] = useState(moment());
  const [user, setUser] = useState(null);
  const [drawerVisibile, setDrawerVisible] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisibile);
  };

  const onItemClick = (title) => () => {
    toggleDrawer();
  };

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
        case "cognitoHostedUI":
          getUser().then((userData) => setUser(userData));
          break;
        case "signOut":
          setUser(null);
          break;
        case "signIn_failure":
        case "cognitoHostedUI_failure":
          console.log("Sign in failure", data);
          break;
        default:
      }
    });

    getUser().then((userData) => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then((userData) => userData)
      .catch(() => console.log("Not signed in"));
  }

  useEffect(() => {
    getApiData().then((result) => {
      setData(result);
    });
  }, []);

  useEffect(() => {
    setFormData(
      data?.find((item) => item.date === dateMomentForm.format(MomentToString))
    );
  }, [data, dateMomentForm]);

  const textRating = {
    humeur: ["Déprimé", "Pas trop le moral", "Cool", "Optimiste", "Euphorie"],
    energie: [
      "Au fond du canapé",
      "Du mal à se motiver",
      "Cool",
      "La pêche !",
      "Prêt à refaire le monde",
    ],
    pensees: [
      "Au ralenti",
      "Pas trop vif",
      "Normal",
      "Assez rapide",
      "Dans tous les sens",
    ],
  };

  const changeHandlerData = (label, newValue) => {
    setData(saveData(data, label, dateMomentForm, formData, newValue));
  };

  function RatingEtat(params) {
    const { label, title } = params;
    return (
      <Rating
        value={formData?.[label]}
        onChange={changeHandlerData}
        text={textRating[label]}
        title={title}
        label={label}
      />
    );
  }

  function CheckEtat(params) {
    const { label, title } = params;
    return (
      <Chip
        title={title}
        value={formData?.[label]}
        onChange={changeHandlerData}
        label={label}
      />
    );
  }

  return (
    <>
      <Toolbar
        title="SUIVI DE L'HUMEUR"
        onMenuClick={toggleDrawer}
        connected={user}
      />
      {user && (
        <>
          <Drawer
            open={drawerVisibile}
            onClose={toggleDrawer}
            onItemClick={onItemClick}
          />
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Stack
              spacing={0}
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              sx={{ paddingLeft: "20px", paddingRight: "20px" }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{ paddingTop: "20px", paddingBottom: "5px" }}
                >
                  Date
                </Typography>
                <LocalizationProvider
                  dateAdapter={AdapterMoment}
                  locale="fr-FR"
                >
                  <DatePicker
                    id="date-picker"
                    value={dateMomentForm}
                    okLabel="Valider"
                    cancelLabel="Annuler"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ paddingBottom: "10px" }}
                        helperText={null}
                      />
                    )}
                    onChange={(value) => {
                      setDateMomentForm(value);
                    }}
                  />
                </LocalizationProvider>
              </Box>

              <RatingEtat title="Humeur" label="humeur" />
              <RatingEtat title="Energie" label="energie" />
              <RatingEtat title="Pensées" label="pensees" />
              <Stack>
                <Typography
                  variant="h6"
                  sx={{ paddingTop: "20px", paddingBottom: "5px" }}
                >
                  Autres
                </Typography>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  sx={{ flexGrow: 1, maxWidth: "400px" }}
                >
                  <CheckEtat title="Envie de tout plaquer" label="plaquer" />
                  <CheckEtat title="Agressivité" label="agressif" />
                  <CheckEtat title="Idées noires" label="suicide" />
                  <CheckEtat title="Angoisses" label="angoisse" />
                </Grid>
              </Stack>

              <Typography
                variant="h5"
                sx={{ paddingTop: "20px", paddingBottom: "20px" }}
              ></Typography>

              <Stack
                spacing={1}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setDateMomentForm(dateMomentForm.clone().add(-1, "days"));
                  }}
                >
                  &lt;&lt;
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setDateMomentForm(dateMomentForm.clone().add(1, "days"));
                  }}
                >
                  &gt;&gt;
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </>
      )}
    </>
  );
}
