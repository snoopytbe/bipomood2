import React from "react";
import Chip from "@mui/material/Chip";
import Box  from "@mui/material/Box";

export default function MyChip(params) {
  const { value, title, label, onChange } = params;

  let correctValue = value ?? false

  return (
    <Box>
      <Chip
        color={correctValue ? "success" : "default"}
        label={title}
        onClick={() => onChange(label, !correctValue)}
        variant="filled"
        sx={{ textAlign: "center", fontSize: "15px", margin: "3px" }}
      />
    </Box>
  );
}
