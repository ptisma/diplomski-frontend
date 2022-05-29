import { useState, useEffect } from "react";
import axios from "axios";

const useTimePeriod = (locationID) => {
  const [period, setPeriod] = useState({});
  const [error, setError] = useState({});

  useEffect(() => {
    const fetchTimePeriod = async () => {
      try {
        console.log(
          ROOT_URL + `/location/${locationID}` + `/microclimate/all/period`
        );
        const response = await axios.get(
          ROOT_URL + `/location/${locationID}` + `/microclimate/all/period`
        );
        let timePeriod = response.data;
        setPeriod(timePeriod);
      } catch (error) {
        setError(error);
      }
    };
    fetchTimePeriod();
  }, [locationID]);

  return period;
};

export default useTimePeriod;
