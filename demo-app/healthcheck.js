const port = process.env.PORT || "5173";
const url = `http://127.0.0.1:${port}/health`;

try {
  const response = await fetch(url);
  if (!response.ok) {
    process.exit(1);
  }
} catch {
  process.exit(1);
}
