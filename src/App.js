import React, { useState, useEffect } from "react";
import { updatedawsmobile, awsConnect } from "./awsConnect";
import { Amplify } from "aws-amplify";
import Toolbar from "./Toolbar";
import Drawer from "./Drawer";

Amplify.configure(updatedawsmobile);

export default function App() {
  const [user, setUser] = useState(null);
  const [drawerVisibile, setDrawerVisible] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisibile);
  };

  const onItemClick = (title) => () => {
    toggleDrawer();
  };

  useEffect(() => {
    // Connexion AWS de l'utilisateur
    awsConnect(setUser);
  }, []);

  return (
    <>
      <Toolbar
        title="SUIVI DE L'HUMEUR"
        onMenuClick={toggleDrawer}
        connected={user}
      />
      {user && (
        <Drawer
          open={drawerVisibile}
          onClose={toggleDrawer}
          onItemClick={onItemClick}
        />
      )}
    </>
  );
}
