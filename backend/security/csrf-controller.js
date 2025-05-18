export function sendCsrfToken(request, res) {
  const token = request.csrfToken();
  res.status(200).json({ csrfToken: token });
}
