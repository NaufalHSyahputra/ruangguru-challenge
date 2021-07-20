import axios from "axios";

let url = process.env.REACT_APP_PUBLIC_API_URL;
let postUrl = process.env.REACT_APP_API_URL;

export const AxiosPost = (path, data, headers={}) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .post(`${postUrl}/${path}`, data, {
        headers: {
          ...headers,
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