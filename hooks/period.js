import { useState, useEffect } from "react";
import axios from "axios";
import { ROOT_URL } from "../constants/URL";

const useTimePeriod = (locationID, flag) => {
  const [period, setPeriod] = useState({});
  const [error, setError] = useState(false);
  //console.log(locationID, flag);
  useEffect(() => {
    const fetchTimePeriod = async () => {
      try {
        if (flag) {
          // console.log(
          //   ROOT_URL + `/location/${locationID}` + `/microclimate/all/period`
          // );
          const response = await axios.get(
            ROOT_URL + `/location/${locationID}` + `/microclimate/all/period`
          );
          let timePeriod = response.data;
          // console.log(timePeriod);
          setPeriod(timePeriod);
          setError(false);
        }
      } catch (error) {
        setError(true);
      }
    };
    fetchTimePeriod();
  }, [locationID, flag]);

  return [period, error];
};

export default useTimePeriod;
