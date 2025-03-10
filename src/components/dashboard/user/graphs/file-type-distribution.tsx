"use client";

import { formatBytes } from "@/lib/utils/utils";
import { UserGraphResponse } from "@/type/api/user/graph-response";
import {
  ArcElement,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(ArcElement);

type ChartTypes = "doughnut";

const options: ChartOptions<ChartTypes> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

type UserFileTypeDistributionProps = {
  userGraphData: UserGraphResponse;
};

// Function to generate a color from a string
function generateColor(str: string, border: boolean = false): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 75%, 55%${border ? ", 0.7)" : ")"}`;
}

export default function UserFileTypeDistribution({
  userGraphData,
}: UserFileTypeDistributionProps) {
  const mimeTypes = Object.keys(userGraphData.mimetypeDistribution);
  const backgroundColor = mimeTypes.map((type) => generateColor(type));
  const borderColor = mimeTypes.map((type) => generateColor(type, true));

  const chartData: ChartData<ChartTypes> = {
    labels: mimeTypes,
    datasets: [
      {
        type: "doughnut" as const,
        label: "Amount",
        data: Object.values(userGraphData.mimetypeDistribution),
        backgroundColor,
        borderColor,
      },
    ],
  };

  return (
    <div className="h-[400px] w-[400px] p-2 bg-background/70 rounded-md border border-muted">
      <Chart
        type="doughnut"
        options={options}
        data={chartData}
        plugins={[
          {
            id: "legend-padding",
            beforeInit: (chart) => {
              if (chart.legend) {
                const originalFit = chart.legend.fit;
                chart.legend.fit = function fit() {
                  originalFit.bind(chart.legend)();
                  if (this.height !== undefined) {
                    this.height += 6;
                  }
                };
              }
            },
          },
        ]}
      />
    </div>
  );
}
