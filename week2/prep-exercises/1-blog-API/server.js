const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/blogs", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("Title and content are required!");
  }

  if (fs.existsSync(title)) {
    return res.status(409).send("Blog post already exists!");
  }

  fs.writeFileSync(title, content);
  res.status(201).send("Blog post created successfully!");
});

app.put("/blogs/:title", (req, res) => {
  const { title } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).send("Content is required for update!");
  }

  if (!fs.existsSync(title)) {
    return res.status(404).send("This post does not exist!");
  }

  fs.writeFileSync(title, content);
  res.status(200).send("Blog post updated successfully!");
});

app.delete("/blogs/:title", (req, res) => {
  const { title } = req.params;

  if (!fs.existsSync(title)) {
    return res.status(404).send("This post does not exist!");
  }

  fs.unlinkSync(title);
  res.status(200).send("Blog post deleted successfully!");
});

app.get("/blogs/:title", (req, res) => {
  const { title } = req.params;

  if (!fs.existsSync(title)) {
    return res.status(404).send("This post does not exist!");
  }

  const content = fs.readFileSync(title, "utf-8");
  res.status(200).send(content);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
