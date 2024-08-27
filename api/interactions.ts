//  import "../src/database"
import { onInteractionCreate, TEST_SERVER } from "../src";
// import mongoose from "mongoose";
import { verifyKey, InteractionResponseType, InteractionType, InteractionResponseFlags } from "discord-interactions";
const InteractionCreateAction = require("discord.js/src/client/actions/InteractionCreate");
import { RESTPostAPIInteractionCallbackJSONBody } from "discord-api-types/v10";
import { verify } from "../src/verify";
import { APIInteractionResponse } from "discord.js";


export async function GET(req: Request) {
    const signature = req.headers.get('X-Signature-Ed25519');
    const timestamp = req.headers.get('X-Signature-Timestamp');
    const isValidRequest = await verifyKey(await req.text(), signature, timestamp, 'MY_CLIENT_PUBLIC_KEY');
    if (!isValidRequest) {
        return new Response("Bad request signature", { status: 400, })
    }
    // mongoose.connection.close();
    return new Response(`Hello from ${process.env.VERCEL_REGION} ${TEST_SERVER}`);
}


export async function POST(req: Request) {
    //  console.log(mongoose)
    //  console.log(mongoose.connection)
    const txt = await req.text()
    await verify(req, txt)
    console.log("body", req.body)
    console.log(req)
    console.log("txt", txt)
    const message = JSON.parse(txt) as { type: InteractionType, data: APIInteractionResponse };

    if (message.type === InteractionType.APPLICATION_COMMAND) {
        console.log("the command is an applicaiton responding", message)
        console.log("resoonding with type", InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE)

        const i = new InteractionCreateAction.handle(message)
        console.log("this is I", i)
        await onInteractionCreate(i)


        return Response.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Hello world',
            }
        })
    }

    if (message.type === InteractionType.PING) {
        console.log("ping", message)

        // return new Response(JSON.stringify({
        //     type: InteractionResponseType.PONG,
        // }))

        return Response.json({ type: InteractionResponseType.PONG, })
    }
}

