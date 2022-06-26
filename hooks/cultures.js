import { useState, useEffect } from "react";
import axios from "axios";
import { ROOT_URL } from "../constants/URL";

const useCultures = (flag) => {
  const [cultures, setCultures] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCultures = async () => {
      try {
        if (flag) {
          //console.log(ROOT_URL + "/culture");
          const response = await axios.get(ROOT_URL + "/culture");
          let cultures = response.data;
          //console.log(cultures);
          setCultures(cultures);
          setError(false);
        }
      } catch (error) {
        setError(true);
      }
    };
    fetchCultures();
  }, [flag]);

  return [cultures, error];
};

export default useCultures;
