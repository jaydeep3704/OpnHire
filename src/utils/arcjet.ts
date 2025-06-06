import arcjet, { detectBot, tokenBucket, fixedWindow, shield } from "@arcjet/next";

export{detectBot,tokenBucket,fixedWindow,shield}

export default arcjet({
    key:process.env.ARCJET_KEY!,
    rules:[
        
    ]
})