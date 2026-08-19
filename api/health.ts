interface VercelLikeResponse {
  status(code: number): { json(body: unknown): void }
}

export default function handler(_request: unknown, response: VercelLikeResponse) {
  response.status(200).json({ status: 'ok' })
}
