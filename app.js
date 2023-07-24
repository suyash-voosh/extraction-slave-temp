const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

let clientObjectsData = [];

// Route for health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Function to simulate a delayed process
async function simulateProcess(client) {
  return new Promise((resolve, reject) => {
    // Simulate some asynchronous process with a timeout
    setTimeout(() => {
      // In this example, we'll randomly succeed or fail the process
      const success = Math.random() < 0.5;

      // if (success) {
      resolve("successful");
      // } else {
      //   reject("failed");
      // }
    }, 10000); // Simulate a process that takes 2 seconds
  });
}

// Route to receive clientObjects via POST request
app.post("/client-data", async (req, res) => {
  const clientObjects = req.body;

  // Process the clientObjects as needed (e.g., save to a database, perform operations)

  console.log("Received clientObjects:", clientObjects);

  // Process the clientObjects
  for (const client of clientObjects) {
    try {
      // Set the status to "pending" initially
      client.status = "pending";

      // Simulate the process
      const status = await simulateProcess(client);

      // Update the status to "successful" if the process succeeded
      client.status = "successful";
    } catch (error) {
      // Update the status to "failed" if the process failed
      client.status = "failed";
    }
  }

  console.log("Received clientObjects:", clientObjects);

  clientObjectsData.push(clientObjects);

  // Send the status details to the master server
  const masterUrl = "http://52.53.226.185:8000/update-status"; // Replace with your master's IP and port
  const postData = JSON.stringify( clientObjects );
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(masterUrl, postData, { headers });
    if (response.status !== 200) {
      console.error("Failed to update status on the master.");
    }
  } catch (error) {
    console.error("Failed to update status on the master:", error.message);
  }

  // Respond with the updated status
  res.status(200).json({ message: "ClientObjects processed successfully" });
});

// Route to get the status of each client object
app.get("/client-status", (req, res) => {
  res.status(200).json({ clientObjects: clientObjectsData });
});

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
