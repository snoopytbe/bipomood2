import React from "react";
import Chip from "@mui/material/Chip";

export default function MyChip(params) {
  const { value, title, label, onChange } = params;

  let correctValue = value ?? false;

  return (
    <Chip
      color={correctValue ? "success" : "default"}
      label={title}
      onClick={() => onChange(label, !correctValue)}
      variant="filled"
      sx={{ textAlign: "center", fontSize: "15px", margin: "3px" }}
    />
  );
}
