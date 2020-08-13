const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const port = process.env.PORT || 3000;
const middlewares = jsonServer.defaults();

const axios = require("axios");
const url = "https://graph.microsoft.com/v1.0/me/";

const getData = async (url) => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
    console.log(data);
  } catch (error) {
    return error;
    console.log(error);
  }
};

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Option"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

server.use(async (req, res, next) => {
  if (req.method == "GET") {
    if (req.headers.authorization) {
      //console.log (req.headers.authorization)
      axios.defaults.headers.get["Authorization"] = req.headers.authorization;
      let sendata = await getData(url);
      if (sendata.id) {
        next();
      } else {
        //console.log('error2')
        res
          .status(401)
          .json({ status: "Error", code: 401, message: "User can not Access" });
      }
    } else {
      //console.log('error1')
      res
        .status(401)
        .json({ status: "Error", code: 401, message: "Unauthorized" });
    }
  } else {
    next();
  }
});
server.use(middlewares);
server.use(router);
server.listen(port, () => {
  console.log("JSON Server is running");
});
