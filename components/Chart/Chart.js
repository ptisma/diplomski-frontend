import { View, Text } from "react-native";
import React from "react";
import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
  Tooltip,
} from "react-native-responsive-linechart";

//not used anywhere
const Chart = ({ historyData, predictedData, maxValue }) => {
  return (
    <View>
      <Chart
        style={{ height: styles.chart.height, width: styles.chart.width }}
        padding={{
          left: styles.chart.paddingLeft,
          right: styles.chart.paddingRight,
          top: styles.chart.paddingTop,
          bottom: styles.chart.paddingBottom,
        }}
        xDomain={{
          min: 0,
          max:
            predictedData.length > 0
              ? historyData.length + predictedData.length - 2
              : historyData.length - 1,
        }}
        yDomain={{ min: 0, max: Math.ceil(maxValue) }}
      >
        <VerticalAxis
          tickCount={
            predictedData.length > 0
              ? historyData.length + predictedData.length - 2
              : historyData.length - 1
          }
          includeOriginTick={false}
          theme={{
            axis: { stroke: { color: "#00BFFF", width: 2 } },
            ticks: { stroke: { color: "#DCDCDC", width: 2 } },
            labels: {
              label: { color: "#21618C" },
              formatter: (v) => v.toFixed(2),
            },
          }}
        />
        <HorizontalAxis
          tickCount={
            predictedData.length > 0
              ? historyData.length + predictedData.length - 2
              : historyData.length - 1
          }
          includeOriginTick={false}
          theme={{
            axis: { stroke: { color: "#00BFFF", width: 2 } },
            ticks: { stroke: { color: "#DCDCDC", width: 2 } },
            labels: {
              label: { color: "#21618C" },
              //find min for 2014
              formatter: (v) => minYear + v,
            },
          }}
        />
        <Area data={historyData} theme={historyAreaStyle} />
        <Line data={historyData} theme={historyDataStyle} />
        {predictedData.length > 0 && (
          <View>
            <Area data={predictedData} theme={predictedAreaStyle} />
            <Line data={predictedData} theme={predictedDataStyle} />
          </View>
        )}
      </Chart>
    </View>
  );
};

export default Chart;
