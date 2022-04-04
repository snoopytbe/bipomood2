import React from "react";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryLegend,
  VictoryLabel,
} from "victory";
import { MomentToString, listTitle, textRating } from "./apiData";
import Moment from "moment";
import "moment/min/locales.min";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
moment.locale("fr-FR");

export default function Graph(params) {
  const { data } = params;

  const yLabels = ["Très bas", "Bas", "Normal", "Haut", "Très haut"];

  function getValue(value) {
    var result = [];
    for (let oneDay of moment.range(dateMin, dateMax).by("days")) {
      var pushed = {};
      var foundValue = data.find(
        (item) => item.date === oneDay.format(MomentToString)
      )?.[value];
      if (foundValue) {
        pushed.date = oneDay.toDate();
        pushed[value] = foundValue;
        pushed.tooltipText =
          listTitle[value] + " : " + textRating[value][foundValue];
        result.push(pushed);
      }
    }
    return result;
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
    var listOfData = ["humeur", "energie", "pensees"];
    var listOfColors = ["tomato", "blue", "green"];

    listOfData.forEach((value) => graphData.push(getValue(value)));

    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <VictoryChart
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 50, left: 80, right: 10 }}
          animate={{ duration: 1500 }}
          width={600}
          height={250}
          scale={{ x: "time", y: "linear" }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) => `${datum.tooltipText}`}
              labelComponent={
                <VictoryTooltip
                  cornerRadius={0}
                  flyoutStyle={{ fill: "white" }}
                />
              }
            />
          }
        >
          <VictoryLegend
            orientation="horizontal"
            x={200}
            y={5}
            gutter={20}
            style={{ border: { stroke: "black" } }}
            data={listOfData.reduce((prev, act, currentIndex) => {
              return [
                ...prev,
                {
                  name: listTitle[act],
                  symbol: { fill: listOfColors[currentIndex] },
                  labels: { fontSize: "10" },
                },
              ];
            }, [])}
          />
          {listOfData.map((value, index) => {
            return (
              <VictoryLine
                key={value}
                data={graphData[index]}
                x="date"
                y={value}
                style={{
                  data: {
                    stroke: listOfColors[index],
                  },
                  labels: { fill: listOfColors[index] },
                }}
                interpolation="monotoneX"
              />
            );
          })}
          <VictoryAxis
            scale="time"
            tickCount={6}
            tickFormat={(t) => `${moment(t).format("DD/MM")}`}
            axisLabelComponent={<VictoryLabel transform="skewX(30)" />}
          />
          <VictoryAxis
            dependentAxis
            domain={{ y: [0.5, 5.5] }}
            tickValues={[0, 1, 2, 3, 4]}
            tickFormat={yLabels}
          />
        </VictoryChart>
      </div>
    );
  }
  return null;
}
