import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";

export default function MyDrawer({ open, onClose, onItemClick }) {
  return (
    <Drawer open={open} onClose={onClose}>
      {/* Liste des menus */}
      <List>
        <ListItem button component="nav" onClick={onItemClick("")}>
          <ListItemText>Courbes (bientôt)</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
}
