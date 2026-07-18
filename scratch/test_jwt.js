const jwt = require('jsonwebtoken');
try {
  const token = jwt.sign({ id: 1 }, undefined);
  console.log("Token signed with undefined secret:", token);
  const decoded = jwt.verify(token, undefined);
  console.log("Decoded:", decoded);
} catch (e) {
  console.log("Error:", e.message);
}
