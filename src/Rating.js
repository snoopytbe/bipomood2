import React, { useState } from "react";
import checked from "./media/checked2.png";
import unchecked from "./media/unchecked2.png";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function MyRating(params) {
  const { value, title, text, label, onChange } = params;

  let correctValue = parseInt(value ?? 0);

  var size = text.length;
  var initialStatus = [];
  for (let i = 0; i < size; i++) {
    initialStatus.push(i === correctValue - 1 ? true : false);
  }
  const [status, setStatus] = useState(initialStatus);
  const [sideText, setSideText] = useState(
    text?.[correctValue - 1] ?? "Fais un choix"
  );
  const [realSideText, setRealSideText] = useState(
    text?.[correctValue - 1] ?? "Fais un choix"
  );

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ paddingTop: "20px", paddingBottom: "5px" }}
      >
        {title}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={0}>
        {status.map((oneStatus, index) => (
          <img
            src={oneStatus ? checked : unchecked}
            key={label + "_" + index}
            alt=""
            style={{
              height: "25px",
              width: "25px",
            }}
            onClick={() => {
              onChange(label, index + 1);
              setStatus((prevStatus) =>
                prevStatus.map((value, pos) => (index === pos ? true : false))
              );
              setSideText(text[index]);
              setRealSideText(text[index]);
            }}
            onMouseOver={() => setSideText(text[index])}
            onMouseOut={() => setSideText(realSideText)}
          />
        ))}

        <Typography
          variant="body1"
          sx={{
            paddingLeft: "10px",
            color: "text.secondary",
          }}
        >
          {sideText}
        </Typography>
      </Stack>
    </Box>
  );
}
