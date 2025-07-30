const {google} = require(`googleapis`)
require('dotenv').config()

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/documents']
})

async function writeDocument(mydoucmentId) {
    try {
        const docs = google.docs({
            version: `v1`,
            auth
        })

        const writer = await docs.documents.batchUpdate({
            documentId: mydoucmentId,
            requestBody: {
                requests: {
                    insertText: {
                        location: {
                            index: 1,
                        },
                        text: `this was written using node.js, it'll later be written using the chat-gpt api`
                    }
                }
            }
        })
    } catch(err) {
        console.error(err)
    }
}
writeDocument(`122c642Y-FaQ-i8R1Nbq95QJIo8sNkd2GaT6SJYT-jq0`)