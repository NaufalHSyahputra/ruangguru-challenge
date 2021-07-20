import axios from "axios";

let url = process.env.REACT_APP_API_URL;

export const AxiosPost = (path, data, headers={}) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .post(`${url}/${path}`, data, {
        headers: {
          ...headers,
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          Accept: "application/json",
        },
      })
      .then(
        (result) => {
          resolve(result);
        },
        (err) => {
          reject(err);
        }
      );
  });
  return promise;
};

export const AxiosGet = (path, params={}) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(`${url}/${path}`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer "+localStorage.getItem("access_token")
        },
        params: {
          ...params
        }
      })
      .then(
        (result) => {
          resolve(result);
        },
        (err) => {
          reject(err);
        }
      );
  });
  return promise;
};

export const AxiosPatch = (path, data={}) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .patch(`${url}/${path}/${data.id}`, data, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer "+localStorage.getItem("access_token")
        }
      })
      .then(
        (result) => {
          resolve(result);
        },
        (err) => {
          reject(err);
        }
      );
  });
  return promise;
};

export const AxiosDelete = (path, params={}) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .delete(`${url}/${path}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          Accept: "application/json",
        },
        params: {
          ...params
        }
      })
      .then(
        (result) => {
          resolve(result);
        },
        (err) => {
          reject(err);
        }
      );
  });
  return promise;
};