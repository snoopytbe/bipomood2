import React, { useState } from "react";
import checked from "./media/checked.png";
import unchecked from "./media/unchecked.png";
import Stack from "@mui/material/Stack";
import { Button, Tooltip, Typography } from "@mui/material";

export default function MyRating(params) {
  var value = 2;
  var title = "Test";
  var size = 4;
  var text = ["texte 1", "texte 2", "texte 3", "texte 4"];
  var name = "test";
  const onChange = () => {};

  var initialStatus = [];
  for (let i = 0; i < size; i++) {
    initialStatus.push(i === value ? true : false);
  }
  const [status, setStatus] = useState(initialStatus);
  const [bottomText, setBottomText] = useState(text[value ?? 0]);
  const [realBottomText, setRealBottomText] = useState(text[value] ?? 0);

  return (
    <>
      <Typography
        sx={{ paddingTop: "10px", paddingBottom: "10px", fontSize: "16px" }}
      >
        {title}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography
          variant="body1"
          sx={{ paddingRight: "10px", verticalAlign: "center" }}
        >
          {text[0]}
        </Typography>

        {status.map((oneStatus, index) => (
          <>
            <img
              src={oneStatus ? checked : unchecked}
              key={name + "_" + index}
              alt=""
              style={{
                height: "20px",
                width: "20px",
              }}
              onClick={() => {
                onChange(index);
                setStatus((prevStatus) =>
                  prevStatus.map((value, pos) => (index === pos ? true : false))
                );
                setBottomText(text[index]);
                setRealBottomText(text[index]);
              }}
              onMouseOver={() => setBottomText(text[index])}
              onMouseOut={() => setBottomText(realBottomText)}
            />
          </>
        ))}

        <Typography
          variant="body1"
          sx={{ paddingLeft: "10px", verticalAlign: "center" }}
        >
          {text[size - 1]}
        </Typography>
      </Stack>
      <Typography
        sx={{ paddingTop: "5px", paddingBottom: "10px", fontSize: "12px", fontStyle:  "italic" }}
      >
        {bottomText}
      </Typography>
    </>
  );
}
