import { AxiosGet } from "../Helpers/AxiosHelper";
import { AxiosPost } from './../Helpers/AxiosHelper';

const getUserData = async (data = {}) => {
  try {
    const result = await AxiosGet(`rg-package-dummy`, data);
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};

const saveUserData = async (data = {}) => {
  try {
    const result = await AxiosPost(`api/client/redeem`, data);
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};

export { getUserData, saveUserData };
