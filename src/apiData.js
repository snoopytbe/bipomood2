import axios from "axios";
import moment from "moment";
import "moment/min/locales.min";
import { URL } from "./urlAPI";
moment.locale("fr-FR");

export const MomentToString = "YYYY-MM-DD";

const listLabels = [
  "humeur",
  "angoisse",
  "energie",
  "plaquer",
  "agressif",
  "pensees",
  "suicide",
  "achats",
  "bavard",
  "retrait",
  "malade",
  "cynique",
  "vivre",
];

export const listTitle = {
  humeur: "Humeur",
  angoisse: "Angoisse",
  energie: "Energie",
  plaquer: "Envie de tout plaquer",
  agressif: "Agressivité",
  pensees: "Pensées",
  suicide: "Idées noires",
  achats: "Envies d'achat",
  bavard: "Très bavard",
  retrait: "Besoin de s'isoler",
  malade: "Malade",
  cynique: "Cynique",
  vivre: "Joie de vivre",
};

export const textRating = {
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
  vivre: [
    "Idées noires",
    "Si seulement...",
    "Normal",
    "La vie est belle",
    "J'adore la vie",
  ],
};

export function getApiData() {
  return axios
    .get(URL + "/items")
    .then((res) => {
      //console.log(res.data.Items);
      return res.data.Items;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
}

export function putApiData(data) {
  //console.log(data);
  var whatToPut = {
    date: data.date,
    id: data.id,
  };
  whatToPut = listLabels.reduce(
    (prev, act) => ({ ...prev, [act]: data[act] }),
    whatToPut
  );
  axios.put(URL + "/items", whatToPut).catch((err) => {
    console.log(err);
  });
}

export function deleteApiData(data) {
  data.forEach((item) => {
    axios
      .delete(URL + "/items/" + item.id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export function saveData(data, label, dateMomentForm, formData, value) {
  console.log("Sauvegarde");
  console.log(formData);
  console.log(dateMomentForm.format(MomentToString));
  console.log(
    data.filter(
      (oneData) => oneData.date === dateMomentForm.format(MomentToString)
    )?.[0]?.id
  );
  if (
    data.filter(
      (oneData) => oneData.date === dateMomentForm.format(MomentToString)
    )?.[0]?.id === undefined
  )
    alert("Problème éventuel lors de la sauvegarde");
  let id =
    data.filter(
      (oneData) => oneData.date === dateMomentForm.format(MomentToString)
    )?.[0]?.id ?? uuidv4();
  var newData = {
    date: dateMomentForm.format(MomentToString),
    id: id,
  };
  newData = listLabels.reduce(
    (prev, act) => ({
      ...prev,
      [act]: label === act ? value : formData?.[act] ?? 0,
    }),
    newData
  );

  putApiData(newData);

  return [
    ...data.filter(
      (oneData) => !moment(oneData.date).isSame(dateMomentForm, "day")
    ),
    newData,
  ];
}
