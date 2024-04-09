export default function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = JSON.parse(req.body);
    if (email === "" && password === "") {
      res.status(200).json({
        username: "Abderrahmane",
        avatarUrl:
          "https://ca-times.brightspotcdn.com/dims4/default/0f13f1e/2147483647/strip/true/crop/4937x3292+0+0/resize/1200x800!/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F4e%2F4e%2Fba20004c41a5bc970aad01b5739b%2Fhttps-delivery.gettyimages.com%2Fdownloads%2F1199826353.jpg",
      });
    } else {
      res.status(401).json({
        error: "Identifiants invalides",
      });
    }
  } else {
    res.status(405).json({ error: "Method non acceptée" });
  }
}
