const axios = require("axios");

const data = {
  deal: "Buy now https://www.flipkart.com/vivo-y27-burgundy-black-128-gb/p/itm78b2110c431dd?pid=MOBGR5TSZH4ZGVZT&lid=LSTMOBGR5TSZH4ZGVZTSA5BUC&marketplace=FLIPKART&store=tyy%2F4io&srno=b_9_200&otracker=browse&fm=organic&iid=26371cff-b1e3-4fd4-b7a7-10caac9ddefd.MOBGR5TSZH4ZGVZT.SEARCH&ppt=browse&ppn=browse&ov_redirect=true",
  convert_option: "convert_only"
};

axios.post(
  "https://ekaro-api.affiliaters.in/api/converter/public",
  data,
  {
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTk5NTRmMTIxMjRjODNjMjY0NTI3NDMiLCJlYXJua2FybyI6IjQ3NjAyMzYiLCJpYXQiOjE3NzE2NTcwMTN9.Q-D3pAjob9pUOoDb5G7NOMa57Up79j2ZKz3ZYZXeANw",
      "Content-Type": "application/json"
    }
  }
)
.then(response => {
  console.log("Converted Deal:", response.data);
})
.catch(error => {
  console.error("Error:", error.response?.data || error.message);
});