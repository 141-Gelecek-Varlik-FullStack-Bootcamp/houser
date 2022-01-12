import { message as messageAlert } from "antd";
export const alertError = (errorMessage) => {
  messageAlert.error(errorMessage);
};
export const alertSuccess = (successMessage) => {
  messageAlert.success(successMessage);
};
