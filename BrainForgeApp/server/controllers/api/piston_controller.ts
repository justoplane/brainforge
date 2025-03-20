import { EndpointBuilder, controller } from "../controller";
import axios from "axios";

export const runCode: EndpointBuilder = (_) => async (req, res) => {
  try {
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: req.body.language, 
      version: '*',
      files: [
          {
              content: req.body.code
          }
      ]
  }, {
      headers: {
          'Content-Type': 'application/json'
      }
  });

  res.json(response.data);

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