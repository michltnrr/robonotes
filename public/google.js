const {google} = require(`googleapis`)
require('dotenv').config()
const fs = require(`fs`)

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/documents']
})

async function writeDocument(mydocumentId) {
    try {
        const docs = google.docs({
            version: `v1`,
            auth
        })
        const essayFile = fs.readFileSync(`generated-essay.json`).toString()
        const paperData = JSON.parse(essayFile)
        const documentText = `${paperData.usersName}\n${paperData.className}\n${paperData.professorName}\n\n\t\t${paperData.title}\n\n ${paperData.intro} ${paperData.body} ${paperData.conclusion}`
        
        const writter = await docs.documents.batchUpdate({
            documentId: mydocumentId,
            requestBody: {
                requests: {
                    insertText: {
                        location: {
                            index: 1,
                        },
                        text: documentText,
                    }
                }
            }
        })
        
        //for mla format the date is also needed, need to add that 
        const formatter = await docs.documents.batchUpdate({
            documentId: mydocumentId,
            requestBody: {
                requests: [
                {
                    updateTextStyle: {
                        range: {
                            startIndex: 1,
                            endIndex: 1 + documentText.length,
                        },
                        textStyle: {
                            weightedFontFamily: {
                                fontFamily: `Times New Roman`,
                            },
                            
                            fontSize: {
                                magnitude: 12,
                                unit: `PT`
                            },
                        },
                        fields: `weightedFontFamily,fontSize` 
                        
                    }, 
                }, 
            
                {
                updateParagraphStyle: {
                    range: {
                        startIndex: 1,
                        endIndex: 1+ documentText.length,
                    },
                
                    paragraphStyle: {
                        lineSpacing: 2 * 100
                    },
                                
                    fields: 'lineSpacing'
                }
            }
        ]
    }
})

    } catch(err) {
        console.error(err)
    }
}
writeDocument(`122c642Y-FaQ-i8R1Nbq95QJIo8sNkd2GaT6SJYT-jq0`)