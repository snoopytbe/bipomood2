import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import Moment from "moment";
import "moment/min/locales.min";
import { extendMoment } from "moment-range";
import { Box } from "@mui/material";

const moment = extendMoment(Moment);
moment.locale("fr-FR");
const MomentToString = "YYYY-MM-DD";

export default function Graph(params) {
  const { data } = params;

  function pushValue(pushed, value, day) {
    var whatToPush =
      data.find((item) => item.date === day.format(MomentToString))?.[value] ??
      undefined;
    if (whatToPush) pushed[value] = whatToPush;
    return pushed;
  }

  if (data?.length > 0) {
    var sortedData = data?.sort((a, b) => {
      return a.date < b.date ? -1 : 1;
    });
    var dateMin = moment(sortedData[0].date, MomentToString);
    var dateMax = moment(
      sortedData[sortedData.length - 1].date,
      MomentToString
    );

    var graphData = [];
    for (let oneDay of moment.range(dateMin, dateMax).by("days")) {
      var pushed = {};
      pushed.date = oneDay.format("DD/MM/yy");
      pushed = pushValue(pushed, "humeur", oneDay);
      pushed = pushValue(pushed, "energie", oneDay);
      pushed = pushValue(pushed, "pensees", oneDay);
      graphData.push(pushed);
    }
    return (
      <Box sx={{ flexGrow: 1 }}>
        <ResponsiveContainer minWidth="300px" minHeight="300px">
          <LineChart
            data={graphData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid />
            <XAxis dataKey="date" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="humeur"
              stroke="#8884d8"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="energie"
              stroke="#82ca9d"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="pensees"
              stroke="#eb4034"
              strokeWidth={3}
            />
            <YAxis type="number" domain={[0.8, 5.2]} ticks={[1, 2, 3, 4, 5]} />
            <ReferenceLine
              y={3}
              stroke="black"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                position: "insideLeft",
                value: "Cool",
              }}
            />
            <ReferenceArea
              x1={dateMin.format("DD/MM/yy")}
              x2={dateMax.format("DD/MM/yy")}
              y1={4.5}
              y2={5.2}
              fill="red"
              fillOpacity={0.1}
            />
            <ReferenceArea
              x1={dateMin.format("DD/MM/yy")}
              x2={dateMax.format("DD/MM/yy")}
              y1={0.8}
              y2={1.5}
              fill="red"
              fillOpacity={0.1}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  }
  return null;
}
