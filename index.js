import {Hono} from "hono";
import {streamSSE} from "hono/streaming";
import {serve} from "@hono/node-server";

const app = new Hono().post('/feed', c => {
    let id = 0
    return streamSSE(c, async (stream) => {
        let canContinue = true;
        stream.onAbort(() => {
            console.log('abort.0')
            canContinue = false;
        });
        console.log('write')
        while (canContinue) {
            await stream.writeSSE({
                data: String(id),
                event: "time-update",
                id: String(id++),
            });
        }
    })
})

const server = await new Promise((resolve) => {
    const server = serve({
        fetch: app.fetch, port: 3000
    }, () => {
        resolve(server);
    })
})

const abortController= new AbortController()
const response = await fetch('http://localhost:3000/feed', { method: 'POST', signal: abortController.signal });
const reader = response.body.getReader()
await reader.read()
await reader.read()
// Same result if you do AbortSignal
// abortController.abort('d')
// Or just cancel the reader
await reader.cancel('Done')

await server.close()