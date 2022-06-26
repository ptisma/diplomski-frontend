import { consoleLogger } from "@influxdata/influxdb-client";
import axios from "axios";
import {
  differenceInDays,
  format,
  isBefore,
  isSameDay,
  isSameYear,
  parseISO,
} from "date-fns";
import { useState } from "react";
import { ROOT_URL } from "../constants/URL";

const useDataYearApi = (url) => {
  //console.log("useDataYearApi", url);
  const [historyData, setHistoryData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [minYear, setMinYear] = useState(null);
  //currently empty
  const [metadata, setMetadata] = useState({});
  const [isError, setIsError] = useState(false);

  const fetchPoints = async () => {
    //console.log("Inside fetch points");
    //setIsError(false);
    //setIsLoading(true);
    try {
      // console.log(url);
      const response = await axios.get(url);
      let values = response.data;
      //console.log("values:", values);
      let historyData = [];
      let predictedData = [];
      //console.log(currentDate);
      let firstYear = values[0].year;
      let currentYear = new Date().getFullYear();
      let maxValue = 0;

      values.map((e) => {
        //console.log(parsedDate);
        if (e.value > maxValue) maxValue = e.value;
        let point = { x: e.year - firstYear, y: e.value };
        //console.log(point);
        //since year here marks actually the end of the year, 2021 is 31.12.2021
        //so current year 2022 is time till 31.12.2022 so its "predicted"
        if (e.year === currentYear) {
          historyData.push(point);
          predictedData.push(point);
          return;
        }
        if (e.year < currentYear) {
          //console.log("prije", point);
          historyData.push(point);
        } else {
          //console.log("kasnije", point);
          predictedData.push(point);
        }
      });

      setMaxValue(maxValue);
      setMinYear(firstYear);
      setHistoryData(historyData);
      setPredictedData(predictedData);
      setIsError(false);
      // console.log("over fetching points");
      //console.log(historyData, predictedData);
      // console.log("historyData:", historyData);
      // console.log("predictedData:", predictedData);
      // console.log("maxValue:", maxValue);
    } catch (error) {
      // console.log(error);
      setIsError(true);
    }
    //setIsLoading(false);
  };

  return [
    historyData,
    predictedData,
    maxValue,
    minYear,
    metadata,
    isError,
    fetchPoints,
  ];
};

export default useDataYearApi;
