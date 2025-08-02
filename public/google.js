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
                        text: `This paper should now be ready to be written completely using ai, which should be easy, the hard part will be diggign throught the docs for formatting. \nOnce we do that, we're in the green.`
                    }
                }
            }
        })
    } catch(err) {
        console.error(err)
    }
}
writeDocument(`122c642Y-FaQ-i8R1Nbq95QJIo8sNkd2GaT6SJYT-jq0`)