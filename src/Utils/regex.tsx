const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const specialCharRegex = /^[a-zA-Z0-9\s]+$/;
const urlRegex = /^(http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
const charRegex = /^[A-Za-z ]+$/
const checkPositiveInt = /^\d+$/
const userNameRegex = /^[a-zA-Z0-9_ ]{1,100}$/
const checkPhoneNo = /^[0-9-+()]*$/
const alphanumeric = /^[A-Za-z0-9? ,_-]+$/
const atListOneChar = /^[0-9]*[a-zA-Z][a-zA-Z0-9]*$/


export const isValidEmail = (emailString: string) => {
  return emailRegex.test(emailString);
};

export const isValidPassWord = (passwordString: string) => {
  return passwordRegex.test(passwordString);
};
export const checkIfSpecialCharPresent = (charString: string) => {
  return specialCharRegex.test(charString);
};
export const checkUrl = (urlString: string) => {
  return urlRegex.test(urlString);
};
export const validateOrg = (charString: string) => {
  return alphanumeric.test(charString);
};
export const validateIsNo = (int: any) => {
  return checkPositiveInt.test(int);
};
export const validateUserName = (int: any) => {
  return userNameRegex.test(int);
};
export const validatePhoneNumber = (number: any) => {
  return checkPhoneNo.test(number);
};
export const  oneCharReq= (value: any) => {
  return atListOneChar.test(value);
};
