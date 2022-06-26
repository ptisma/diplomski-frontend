import { useState, useEffect } from "react";
import axios from "axios";
import { ROOT_URL } from "../constants/URL";

const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(false);
  //console.log("useLocations");
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        if (true) {
          //console.log(ROOT_URL + "/culture");
          const response = await axios.get(ROOT_URL + "/location");
          let locations = response.data;
          //console.log(cultures);
          setLocations(locations);
          setError(false);
        }
      } catch (error) {
        setError(true);
      }
    };
    fetchLocations();
  }, []);

  return [locations, error];
};

export default useLocations;
