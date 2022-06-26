import { useState, useEffect } from "react";
import axios from "axios";
import { ROOT_URL } from "../constants/URL";

const useParameters = (flag) => {
  const [parameters, setParameters] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        if (flag) {
          //console.log(ROOT_URL + "/microclimate");
          const response = await axios.get(ROOT_URL + "/microclimate");
          let parameters = response.data;
          setParameters(parameters);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchParameters();
  }, [flag]);

  return [parameters, error];
};

export default useParameters;
