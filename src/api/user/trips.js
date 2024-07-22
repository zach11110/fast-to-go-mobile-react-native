import client from "../client";
import authStorage from "../../auth/storage";

export const getMyPassengerTrips = async (page, limit) => {
  const expiryInMins = 1;
  const token = await authStorage.getToken();

  return await client.get(
    `/trips/driver/my?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: token,
      },
    },
    expiryInMins
  );
};

export const requestTrip = async (
  carType,
  fromLongitude,
  fromLatitude,
  fromTitle,
  toLongitude,
  toLatitude,
  toTitle,
  tripPrice,
  paymentMethod,
  couponCode
) => {
  const token = await authStorage.getToken();

  try {
    return await client.post(
      "/trips/passenger/request",
      {
        carType,
        fromLongitude,
        fromLatitude,
        fromTitle,
        toLongitude,
        toLatitude,
        toTitle,
        tripPrice,
        paymentMethod,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

export const approveTrip = async (tripId) => {
  try {
    const token = await authStorage.getToken();

    return await client.post(
      `/trips/driver/${tripId}/approve`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } catch (err) {
    throw err;
  }
};

export const rejectTrip = async (tripId) => {
  try {
    const token = await authStorage.getToken();
    return await client.post(
      `/trips/driver/${tripId}/reject`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

export const sendSos = async (driverId) => {
  const token = await authStorage.getToken();

  try {
    return await client.post(
      `/trips/passenger/sendSos`,
      { driverId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } catch (error) {}
};

export const endTrip = async (tripId) => {
  try {
    const token = await authStorage.getToken();

    return await client.post(
      `/trips/driver/${tripId}/end`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

export const arrived = async (tripId) => {
  try {
    const token = await authStorage.getToken();

    return await client.post(
      `/trips/driver/${tripId}/arrived`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } catch (err) {
    throw err;
  }
};

export const deleteTrip = async (tripId) => {
  try {
    const token = await authStorage.getToken();

    return await client.patch(
      `/trips/passenger/${tripId}/cancel`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};
