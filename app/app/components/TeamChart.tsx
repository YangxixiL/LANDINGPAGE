"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { TeamMemberGroup } from "../data";

ChartJS.register(ArcElement, Tooltip, Legend);

type TeamProps = {
  team: TeamMemberGroup[];
};

const chartOptions = {
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        usePointStyle: true,
        boxWidth: 10,
      },
    },
  },
  cutout: "62%",
};

const defaultColors = ["#2563EB", "#DC2626", "#059669", "#D97706", "#7C3AED", "#0EA5E9"];

export function Team({ team }: TeamProps) {
  const chartData = {
    labels: team.map((item) => item.label),
    datasets: [
      {
        data: team.map((item) => item.value),
        backgroundColor: team.map((item, index) => item.color ?? defaultColors[index % defaultColors.length]),
        borderWidth: 1,
        label: '# of Researcher'
      },
    ],
  };

  return (
    <div className="mt-3 rounded border border-gray-200 bg-white p-3">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
}
