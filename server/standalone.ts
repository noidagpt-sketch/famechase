import { createServer } from "./index.js";

const app = createServer();
const port = parseInt(process.env.API_PORT || "3001");

app.listen(port, "0.0.0.0", () => {
  console.log(`API server running on port ${port}`);
});

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
