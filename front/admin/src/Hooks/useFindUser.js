import { useState, useEffect } from "react";
import axios from "axios";
export default function useFindUser() {
  const [user, setUser] = useState(null);
  let url = process.env.REACT_APP_API_URL;
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function findUser() {
      await axios
        .get(url + "/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
    findUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    user,
    isLoading,
    setUser
  };
}
