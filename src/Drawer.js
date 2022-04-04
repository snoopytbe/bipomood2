import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import { getApiData } from "./apiData";
import {
  BrowserRouter,
  Route,
  Link,
  Switch,
  useHistory,
} from "react-router-dom";
import Graph from "./Graph3";
import DataInput from "./DataInput";

export default function MyDrawer({ open, onClose, onItemClick }) {
  var history = useHistory();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Récupération des données
    getApiData().then((result) => {
      setData(result);
    });
  }, []);

  return (
    <BrowserRouter history={history}>
      <Drawer open={open} onClose={onClose}>
        {/* Liste des menus */}
        <List>
          <ListItem button component={Link} to="/" onClick={onItemClick("")}>
            <ListItemText>Saisie</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/Graph"
            onClick={onItemClick("")}
          >
            <ListItemText>Courbes</ListItemText>
          </ListItem>
        </List>
      </Drawer>

      <Switch>
        <Route
          exact
          path="/"
          render={(props) => <DataInput data={data} setData={setData} />}
        />
        <Route path="/Graph" render={(props) => <Graph data={data} />} />
      </Switch>
    </BrowserRouter>
  );
}
