export default function handler(req, res) {
  res.status(200).json({
    message: "Service sync temporarily disabled"
  });
}