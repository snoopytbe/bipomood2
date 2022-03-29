import React, { useState, useEffect } from "react";
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
        y: { min: 1, max: 10 },
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
      {
        label: "Energie",
        data: sortedData.map((item) => parseInt(item.energie)),
        borderColor: "#3244e6",
        backgroundColor: "#3244e6",
      },
    ];

    return <Line options={options} data={graphData} />;
  }
  return null;
}
