import { AxiosGet,AxiosPatch } from "../Helpers/AxiosHelper";

const getRedeemData = async (data = {}) => {
  try {
    const result = await AxiosGet(`api/admin/redeem/`, data);
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};

const updateRedeemData = async (id, data = {}) => {
  data = {
    ...data,
    id
  }
  try {
    const result = await AxiosPatch(`api/admin/redeem`, data);
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};

export { getRedeemData,updateRedeemData };
