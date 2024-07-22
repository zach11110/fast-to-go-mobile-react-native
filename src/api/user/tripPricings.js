import client from "../client";
import authStorage from "../../auth/storage";

export const getTripPricing = async (carType, distanceFrom, distanceTo) => {
  const expiryInMins = 1;
  const token = await authStorage.getToken();

  return await client.get(
    `/trips/pricing/get?carType=${carType}&distanceFrom=${distanceFrom}&distanceTo=${distanceTo}`,
    {
      headers: {
        Authorization: token,
      },
    },
    expiryInMins
  );
};

export const getAllPricing = async ()=>{

  try {
        return await client.get('/trips/pricing/getAll')
  } catch (error) {
    throw error
  }
}

export const updateTripPricing = async (
  carType,
  distanceFrom,
  distanceTo,
  pricePerKm,
  doorOpeningPrice
) => {
  const token = await authStorage.getToken();

  return await client.patch(
    "/trips/pricing/update",
    { carType: carType, distanceFrom, distanceTo, pricePerKm, doorOpeningPrice },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};
