const express = require("express");
require("dotenv").config();
const app = express();

const WolframAlphaAPI = require("wolfram-alpha-api");

const apiKey = process.env.API_KEY;
const waApi = WolframAlphaAPI(apiKey);

app.get("/plot", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  waApi
    .getFull({ i: req.query.expression, plotwidth: 400, width: 400 })
    .then((wolframData) => {
      if (wolframData.success === true) {
        const pods = wolframData.pods;
        console.log(wolframData);
        let img;
        pods.map((pod) => {
          if ("Plot" === pod.title) {
            pod.subpods.map((subpod) => {
              img = {
                imgSrc: subpod.img.src,
                imgWidth: subpod.img.width,
                imgHeigth: subpod.img.heigth,
              };
              return;
            });
          }
        });

        res.send(img);
      } else {
        res.status(500).send("Wrong expression!");
      }
    })
    .catch((reason) => {
      res.status(500).send(reason);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
