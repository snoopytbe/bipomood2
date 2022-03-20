import React from "react";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import {
  Typography,
  Rating,
  Grid,
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
import { getApiData, saveData } from "./apiData";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import moment from "moment";
import "moment/min/locales.min";
import awsmobile from "./aws-exports";
import { Amplify, Auth, Hub } from "aws-amplify";
import MyRating from "./Rating";

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

  function RatingEtat(params) {
    const { label, title } = params;
    return (
      <>
        <Typography sx={{ paddingTop: "10px", fontSize: "16px" }}>
          {title}
        </Typography>
        <Rating
          value={parseInt(formData?.[label] ?? 0)}
          onChange={(e) => {
            setData(
              saveData(data, label, dateMomentForm, formData, e.target.value)
            );
          }}
          sx={{ paddingBottom: "10px" }}
        />
      </>
    );
  }

  function CheckEtat(params) {
    const { label, title } = params;
    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
        >
          <Checkbox
            checked={formData?.[label] || false}
            onChange={(e) => {
              setData(
                saveData(
                  data,
                  label,
                  dateMomentForm,
                  formData,
                  e.target.checked
                )
              );
            }}
          />
          <Typography sx={{ fontSize: "16px" }}>{title}</Typography>
        </Stack>
      </Grid>
    );
  }

  return (
    <>
      {user ? (
        <Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={() => Auth.signOut()}
          >
            Déconnexion
          </Button>
        </Stack>
      ) : (
        <Button
          variant="secondary"
          color="primary"
          onClick={() => Auth.federatedSignIn()}
        >
          Authentification
        </Button>
      )}

      {user && (
        <Stack
          spacing={0}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="h5"
            sx={{ paddingTop: "20px", paddingBottom: "20px" }}
          >
            Suivi de l'humeur
          </Typography>
          <LocalizationProvider dateAdapter={AdapterMoment} locale="fr-FR">
            <DatePicker
              id="date-picker"
              label="Date"
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
          <RatingEtat title="Humeur" label="humeur" />
          <RatingEtat title="Energie" label="energie" />
          <RatingEtat title="Angoisse" label="angoisse" />

          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <CheckEtat title="Envie de tout plaquer" label="plaquer" />
            <CheckEtat title="Agressivité" label="agressif" />
            <CheckEtat title="Pensées rapides" label="pensees" />
            <CheckEtat title="Idées noires" label="suicide" />
          </Grid>

          <Typography
            variant="h5"
            sx={{ paddingTop: "20px", paddingBottom: "20px" }}
          ></Typography>

          <MyRating />

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
      )}
    </>
  );
}
