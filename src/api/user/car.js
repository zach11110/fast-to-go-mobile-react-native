import client from "../client";
import authStorage from "../../auth/storage";

export const addCar = async (
  plateNumber,
  productionYear,
  model,
  color,
  avatar,
  photo1,
  photo2,
  photo3,
  photo4,
  brochure,
  driverLicense,
  insurance,
  passport
) => {
  const token = await authStorage.getToken();
  console.log(photo1);

  return await client.post(
    "/cars/driver/add",
    {
      plateNumber,
      productionYear,
      model,
      color,
      avatar,
      photo1,
      photo2,
      photo3,
      photo4,
      brochure,
      driverLicense,
      insurance,
      passport,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const getCar = async (id) => {
  const token = await authStorage.getToken();

  return await client.get(`/cars/driver/get/${id}`, {
    headers: {
      Authorization: token,
    },
  });
};
