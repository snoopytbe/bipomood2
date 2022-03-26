import axios from "axios";
import moment from "moment";
import "moment/min/locales.min";
import { URL } from "./urlAPI";
moment.locale("fr-FR");

const MomentToString = "YYYY-MM-DD";
const listLabels = [
  "humeur",
  "energie",
  "plaquer",
  "agressif",
  "pensees",
  "suicide",
];

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
  let id =
    data.filter(
      (oneData) => oneData.date === dateMomentForm.format(MomentToString)
    )?.[0]?.id ?? uuidv4();
  var newData = {
    date: dateMomentForm.format(MomentToString),
    id: id,
  };
  console.log(JSON.stringify(formData));
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
