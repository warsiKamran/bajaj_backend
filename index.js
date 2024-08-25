const express = require("express");
const app = express();

app.use(express.json());

// Function to format user_id
function formatUserId(fullName, dob) {
  const nameFormatted = fullName.toLowerCase().replace(/\s+/g, "_");
  return `${nameFormatted}_${dob}`;
}

app
  .route("/bfhl")
  .get((req, res) => {
    res.status(200).json({ operation_code: 1 });
  })
  .post((req, res) => {
    try {
      const { full_name, dob, data } = req.body;

      // Input validation
      if (!full_name || !dob || !Array.isArray(data)) {
        return res.status(400).json({
          is_success: false,
          message: "Invalid input.",
        });
      }

      const numbers = [];
      const alphabets = [];

      for (const item of data) {
        if (!isNaN(item)) {
          numbers.push(item);
        } else if (item.length === 1 && isNaN(item)) {
          alphabets.push(item);
        }
      }

      const user_id = formatUserId(full_name, dob);

      res.json({
        is_success: true,
        user_id: user_id,
        numbers: numbers,
        alphabets: alphabets,
      });
    } catch (error) {
      res.status(500).json({
        is_success: false,
        message: "An error occurred. Please try again.",
      });
    }
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

