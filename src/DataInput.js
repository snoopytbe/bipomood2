import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Typography, Grid, TextField, Button } from "@mui/material";
import Chip from "./Chip";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { saveData, textRating, listTitle } from "./apiData";
import Rating from "./Rating";
import moment from "moment";
import "moment/min/locales.min";

moment.locale("fr-FR");
const MomentToString = "YYYY-MM-DD";

export default function DataInput(params) {
  const { data, setData } = params;

  const [formData, setFormData] = useState();
  const [dateMomentForm, setDateMomentForm] = useState(moment());
    
  useEffect(() => {
    setFormData(
      data?.find((item) => item.date === dateMomentForm.format(MomentToString))
    );
  }, [data, dateMomentForm]);

  const changeHandlerData = (label, newValue) => {
    setData(saveData(data, label, dateMomentForm, formData, newValue));
  };

  function SaisieEtat(params) {
    const { label, type } = params;
    const components = { Rating: Rating, Chip: Chip };
    var ComponentName = components[type];
    return (
      <ComponentName
        value={formData?.[label]}
        onChange={changeHandlerData}
        text={textRating[label] ?? ""}
        title={listTitle[label]}
        label={label}
      />
    );
  }

  return (
    <>
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
              sx={{ paddingTop: "10px", paddingBottom: "5px" }}
            >
              Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterMoment} locale="fr-FR">
              <DatePicker
                id="date-picker"
                value={dateMomentForm}
                okLabel="Valider"
                cancelLabel="Annuler"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ paddingBottom: "0px" }}
                    helperText={null}
                  />
                )}
                onChange={(value) => {
                  setDateMomentForm(value);
                }}
              />
            </LocalizationProvider>
          </Box>

          <SaisieEtat label="humeur" type="Rating" />
          <SaisieEtat label="energie" type="Rating" />
          <SaisieEtat label="pensees" type="Rating" />
          <SaisieEtat label="vivre" type="Rating" />

          <Typography
            variant="h6"
            sx={{ paddingTop: "10px", paddingBottom: "5px" }}
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
            <SaisieEtat label="plaquer" type="Chip" />
            <SaisieEtat label="agressif" type="Chip" />
            <SaisieEtat label="suicide" type="Chip" />
            <SaisieEtat label="angoisse" type="Chip" />
            <SaisieEtat label="achats" type="Chip" />
            <SaisieEtat label="bavard" type="Chip" />
            <SaisieEtat label="retrait" type="Chip" />
            <SaisieEtat label="malade" type="Chip" />
            <SaisieEtat label="cynique" type="Chip" />
          </Grid>

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
  );
}
