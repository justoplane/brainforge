import axios from "axios";


// https://www.youtube.com/watch?v=THgBePRV13o referenced for piston api

const API = axios.create({
  baseURL: "http://emkc.org/api/v2/piston"

});

export const runCode = async (language: string, code: string) => {
  try {
    const res = await API.post("/execute", {
      language,
      source: code,
      version: "*",
      files: [{
        content: code
      }]
    });
    return res.data;
  } catch (error) {
    console.log("error", error);
    return error;
  }
}