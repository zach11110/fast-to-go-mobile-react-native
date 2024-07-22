import axios from "axios";

export default getDistance = async (origin, destination) => {
  try {
    const apiKey = "AIzaSyAj7XozIeVkkLz9V3YpObHfsGNRwvCrSYs";

    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin} &key=${apiKey}`
    );
    console.log(data.rows[0]);

    return parseFloat(data.rows[0].elements[0].distance.text);
  } catch (error) {
    //  console.log(error)
    throw error;
  }
};
