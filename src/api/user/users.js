import client from "../client";
import authStorage from "../../auth/storage";

export const authenticate = async () => {
  const token = await authStorage.getToken();

  if (!token) {
    throw new Error("");
  }

  return await client.get("/users/authenticate", {
    headers: {
      Authorization: token,
    },
  });
};

export const joinSocket = async (socketId) => {
  const token = await authStorage.getToken();
  if (!token) {
    throw new Error("");
  }

  // console.log("token:", token);
  // console.log("socketId: ", socketId);

  return await client.get(`/users/socket/join?socketId=${socketId}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const toggleNotifications = async () => {
  const token = await authStorage.getToken();

  return await client.patch(
    "/users/notifications/toggle",
    {},
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const verifyPhone = async (code) => {
  const token = await authStorage.getToken();
  return await client.post(
    "/users/phone/verify",
    { code: code },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const toggleConnection = async () => {
  const token = await authStorage.getToken();

  return await client.patch(
    "/users/driver/connection/toggle",
    {},
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const setBusy = async (busy) => {
  const token = await authStorage.getToken();

  return await client.patch(
    "/users/driver/setBusy",
    { busy },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};
export const setDeviceToken = async (newToken) => {
  // console.log("In set device token");
  const token = await authStorage.getToken();
  return await client.patch(
    "/users/setDeviceToken",
    { newToken },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const requestAccountDeletion = async () => {
  const token = await authStorage.getToken();

  return await client.get("/users/account/deletion/request", {
    headers: {
      Authorization: token,
    },
  });
};

export const switchLanguage = async () => {
  const token = await authStorage.getToken();

  return await client.patch(
    "/users/profile/language/switch",
    {},
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const seeNotifications = async () => {
  const token = await authStorage.getToken();

  return await client.get("/users/notifications/see", {
    headers: {
      Authorization: token,
    },
  });
};

export const updateAvatar = async (image) => {
  const token = await authStorage.getToken();

  const body = {
    avatar: {
      base: image.base64,
      name: Date.now().toString(),
    },
  };
  console.log(image.base64);

  return await client.patch("/users/profile/avatar/update", body, {
    headers: {
      Authorization: token,
    },
  });
};

export const updateProfile = async (data) => {
  const token = await authStorage.getToken();

  return await client.patch("/users/profile/update", data, {
    headers: {
      Authorization: token,
    },
  });
};

export const updateLocation = async (location) => {
  // console.log(location);
  const token = await authStorage.getToken();
  try {
    return await client.post(
      "/users/location/update",
      { longitude: location.longitude, latitude: location.latitude },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } catch (err) {}
};

export const getMyFavLoations = async () => {
  const token = await authStorage.getToken();

  return await client.get("/users/places/get", {
    headers: {
      Authorization: token,
    },
  });
};

export const savePlace = async (data) => {
  const token = await authStorage.getToken();

  return await client.post("/users/places/add", data, {
    headers: {
      Authorization: token,
    },
  });
};

export const updatePlace = async (
  placeId,
  title,
  type,
  longitude,
  latitude
) => {
  const token = await authStorage.getToken();

  const body = {
    title,
    type,
    longitude,
    latitude,
  };

  return await client.patch(`/users/places/${placeId}/update`, body, {
    headers: {
      Authorization: token,
    },
  });
};

export const deletePlace = async (placeId) => {
  const token = await authStorage.getToken();

  return await client.delete(`/users/places/${placeId}/delete`, {
    headers: {
      Authorization: token,
    },
  });
};

export const getDriversStats = async () => {
  const token = await authStorage.getToken();

  try {
    return await client.get("/users/admin/stats", {
      headers: {
        Authorization: token,
      },
    });
  } catch (err) {}
};

export const getAllDrivers = async (driverStatus, page, limit) => {
  const token = await authStorage.getToken();

  return await client.get(
    `/users/admin/drivers/get?driverStatus=${driverStatus}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const getAllPassengers = async (page, limit) => {
  const token = await authStorage.getToken();

  return await client.get(
    `/users/admin/passengers/get?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const acceptDriver = async (driverId) => {
  try {
    const token = await authStorage.getToken();

    return await client.post(
      "/users/admin/drivers/accept",
      { driverId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const rejectDriver = async (driverId) => {
  try {
    const token = await authStorage.getToken();

    return await client.post(
      "/users/admin/drivers/reject",
      { driverId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const addDriver = async (formData) => {
  const token = await authStorage.getToken();

  return await client.post(`/users/admin/drivers/add`, formData, {
    headers: {
      Authorization: token,
    },
  });
};

export const sendNotification = async (
  userIds,
  titleEN,
  titleAR,
  bodyEN,
  bodyAR
) => {
  const token = await authStorage.getToken();

  return await client.post(
    `/users/admin/notifications/send`,
    { userIds, titleEN, titleAR, bodyEN, bodyAR },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const exportUsersToExcel = async () => {
  const expiryInMins = 10;
  const token = await authStorage.getToken();

  return await client.get(
    `/users/admin/export`,
    {
      headers: {
        Authorization: token,
      },
    },
    expiryInMins
  );
};

export const exportCardsToExcel = async () => {
  const expiryInMins = 10;
  const token = await authStorage.getToken();

  return await client.get(
    `/users/admin/exportCards`,
    {
      headers: {
        Authorization: token,
      },
    },
    expiryInMins
  );
};

export const findUserByName = async (name) => {
  const token = await authStorage.getToken();

  return await client.get(`/users/admin/findUser?userName=${name}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const blockUser = async (userId) => {
  const token = await authStorage.getToken();

  return await client.patch(
    `/users/admin/${userId}/blockUser`,
    {},
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const assignAsAdmin = async (userId) => {
  const token = await authStorage.getToken();

  return await client.post(
    `/users/admin/${userId}/assignAdmin`,
    {},
    {
      headers: {
        Authorization: token,
      },
    }
  );
};

export const addEvaluation = async (evaluation, driverId) => {
  const token = await authStorage.getToken();

  return await client.patch(
    `/users/driver/${driverId}/addEvaluation`,
    { evaluation },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};
