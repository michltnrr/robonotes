const {google} = require(`googleapis`)
require('dotenv').config()
const fs = require(`fs`)
const { text } = require('stream/consumers')

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/documents']
})


async function getLastIndex(docs, mydocumentId)
{
    const doc = await docs.documents.get({ documentId: mydocumentId });
    return  doc.data.body.content[doc.data.body.content.length - 1].endIndex;
}

async function writeDocument(mydocumentId) {
    try {
        const docs = google.docs({
            version: `v1`,
            auth
        })
        const essayFile = fs.readFileSync(`generated-essay.json`).toString()
        const paperData = JSON.parse(essayFile)
        const paperClassDeets = `${paperData.usersName}\n${paperData.className}\n${paperData.professorName}\n${paperData.date}\n`
        const paperTitle = `${paperData.title}\n`
        const documentText = `\t\t\n${paperData.intro} ${paperData.body} ${paperData.conclusion}`
        
        const writeDetails = await docs.documents.batchUpdate({
            documentId: mydocumentId,
            requestBody: {
                requests: [
                    {
                    insertText: {
                        location: {
                            index: 1,
                        },
                        text: paperClassDeets,
                    }
                },
            ]
        }

    })

    let recentIndex = await getLastIndex(docs, mydocumentId)
    
    const writeTitle = await docs.documents.batchUpdate({
        documentId: mydocumentId,
        requestBody: {
            requests: [
                {
                    insertText: {
                        location: {
                            index: recentIndex-1,
                        },
                        text: paperTitle,
                    }
                }
            ]
        }
    })
    
    const startIndexT = recentIndex -1
    const titleendIndex = startIndexT + paperTitle.length

    const centerTitle = await docs.documents.batchUpdate({
        documentId: mydocumentId,
        requestBody: {
            requests: [
                {
                    updateParagraphStyle: {
                        range: {
                            startIndex: startIndexT,
                            endIndex: titleendIndex,
                        },


                        paragraphStyle: {
                            alignment: "CENTER",
                        },
                        fields: "alignment",
                    }
                }
            ]
        }
    })
    
    recentIndex = await getLastIndex(docs, mydocumentId)
    
    const writeEssay = await docs.documents.batchUpdate({
        documentId: mydocumentId,
        requestBody: {
            requests: {
                insertText: {
                    location: {
                        index: recentIndex-1,
                    },
                    text: documentText
                }
            }
        }
    })
        
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