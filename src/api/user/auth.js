import client from "../client";

export const join = async (
  firstName,
  lastName,
  email,
  phoneICC,
  phoneNSN,
  role,
  gender,
  lang,
  deviceToken,
  referralCode,
  socketId
) => {
  return await client.post("/auth/join/regular", {
    firstName,
    lastName,
    email,
    phoneICC,
    phoneNSN,
    role,
    gender,
    lang,
    deviceToken,
    referralCode,
    socketId,
  });
};

export const getUserByPhoneNumber = async (number) => {
  try {
    return await client.patch("users/getUserByPhoneNumber", { number });
  } catch (err) {
    console.log(err);
  }
};

export const isUserExists = async (number) => {
  try {
    return await client.get(`/users/isUserExists?number=${number}`);
  } catch (err) {
    console.log(err);
  }
};

export const sendOTP = async (number) => {
  try {
    return await client.get(`/users/phone/otp?number=${number}`);
  } catch (err) {
    console.log(err);
  }
};

export const verifyPhone = async () => {
  try {
    return await client.post("/users/phone/verify");
  } catch (err) {
    console.log(err);
  }
};
