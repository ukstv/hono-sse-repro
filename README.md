# Repro for a @hono/node-server bug

Disposition:
1. There is a Hono server, with a POST endpoint replying with Server-Sent Events
2. The response is consumed through `fetch().response.body.getReader()` Reader
3. Either (a) the reader cancels via `reader.cancel()`,
4. Or (b) fetch AbortSignal gets aborted

Expectation: things are working well
Reality:
- Node.js reports an error: `TypeError: Response body object should not be disturbed or locked` :(
- You can not catch the error :(( It is just on console