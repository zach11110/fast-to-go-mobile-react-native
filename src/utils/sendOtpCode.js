import axios from "axios";

export default async function (phone, code) {
  try {
    return await axios.get(
      `https://api.libyasms.com:3236/sendtext?apikey=9bdef100909c6649&secretkey=30b21c22&callerID=fast-go&toUser=218${phone.nsn}&messageContent=your verify code is: ${code}`
    );
  } catch (err) {
    console.log(err);
  }
}
