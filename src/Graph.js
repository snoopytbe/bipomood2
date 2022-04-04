import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

export default function Graph(params) {
  const { data } = params;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Suivi de l'humeur",
      },
      scales: {
        y: { suggestedMin: 1, suggestedMax: 5 },
      },
    },
  };

  if (data?.length > 0) {
    var graphData = {};
    var sortedData = data?.sort((a, b) => {
      return a.date < b.date ? -1 : 1;
    });

    graphData.labels = sortedData.map((item) => item.date);
    graphData.datasets = [
      {
        label: "Humeur",
        data: sortedData.map((item) => parseInt(item.humeur)),
        borderColor: "#eb4034",
        backgroundColor: "#eb4034",
      },

    ];

    return <Line options={options} data={graphData} />;
  }
  return null;
}
