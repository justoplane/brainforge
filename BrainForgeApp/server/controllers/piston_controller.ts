import { version } from "os";
import { EndpointBuilder, controller } from "./controller";
import axios from "axios";

export const runCode: EndpointBuilder = (_) => async (req, res) => {
  try {
    console.log("run called");
    console.log(req.body);
    // const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
    //   language: req.body.language,
    //   source: req.body.source,
    //   version: "*"
    // });
    // res.json(response.data);
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: req.body.language,  // Replace with the language you are using
      version: '*',   // Replace with the correct version
      files: [
          {
              content: req.body.code  // Your code here
          }
      ]
  }, {
      headers: {
          'Content-Type': 'application/json'
      }
  });

  res.json(response.data);

  console.log(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to execute code." });
  }
};

export const PistonController = controller([
  {
    method: "post",
    path: "/run",
    builder: runCode,
  },
]);