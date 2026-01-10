import {google} from 'googleapis'
import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs'

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

// const appScriptUrl = process.env.APP_SCRIPT_URL

// async function applyMLAHeader(documentId, lastName) {
//   const response = await fetch(appScriptUrl, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ documentId, lastName }),
//   });

//   if (!response.ok) {
//     throw new Error(`Header failed: ${response.status}`);
//   }

//   const text = await response.text();
//   console.log('✅ Header applied:', text);
//   return true;
// }



export async function writeDocument(mydocumentId) {
    try {
        const docs = google.docs({
            version: `v1`,
            auth
        })
        const essayFile = fs.readFileSync(`generated-essay.json`).toString()
        const paperData = JSON.parse(essayFile)
        
        const userLastName = paperData.usersName
        const last = userLastName.slice(userLastName.indexOf(" ")).trim()
        console.log(last)
        
        const paperClassDeets = `${paperData.usersName}\n${paperData.className}\n${paperData.professorName}\n${paperData.date}\n`
        const paperTitle = `${paperData.title}\n`
        const documentText = `\t\t\n${paperData.intro} ${paperData.body} ${paperData.conclusion}`
        const paperSources = paperData.citations
        console.log(`All essay data prepped for writing ✅`)
        
        // console.log('A: before header')
        // // await applyMLAHeader(mydocumentId, last)
        // console.log('B: after header')

        
        
        // console.log('Header written!')
        // // await applyMLAHeader(mydocumentId, last)
        
        // write usersname, classname etc
        console.log(`Writing essay details...`)
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
        
        //write title & format of paper 
        console.log(`Writing paper title`)
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
        console.log(`formatting title`)
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
    
    //write essay body 
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
    
    //create works cited page
    recentIndex = await getLastIndex(docs, mydocumentId)
    const writeSources = await docs.documents.batchUpdate({
        documentId: mydocumentId,
        requestBody: {
            requests: [
                {
                    insertPageBreak: {
                        location: {
                            index: recentIndex-1,
                        }
                    }
                },
            ]
        }
    })
    
    //write "Works Cited"
     recentIndex = await getLastIndex(docs, mydocumentId)
    await docs.documents.batchUpdate({
        documentId: mydocumentId,
        requestBody: {
            requests: [
                {
                    insertText: {
                        location: {
                            index:recentIndex-1,
                        },
                        text: "Works Cited",
                    } 
                }, 
            ]
        }
    })

    //center works cited
     const startWrkIndex = recentIndex -1
     const WrkendIndex = startWrkIndex + "Works Cited".length

     await docs.documents.batchUpdate({
        documentId: mydocumentId,
        requestBody: {
            requests: [
                {
                    updateParagraphStyle: {
                        range: {
                            startIndex: startWrkIndex,
                            endIndex: WrkendIndex,
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

    //realign to left (simple way)
    recentIndex = await getLastIndex(docs, mydocumentId)
    await docs.documents.batchUpdate({
        documentId: mydocumentId,
        requestBody: {
            requests: [
                {
                insertText: {
                    location: {
                        index: recentIndex-1,
                    },
                    text: "\n\n\b\t"
                }
                }
            ]
        }
    })

    //actually write the sources
    for(let i = 0; i < paperSources.length; i++) {
        
        recentIndex = await getLastIndex(docs, mydocumentId)
        await docs.documents.batchUpdate({
            documentId: mydocumentId,
            requestBody: {
                requests: [
                    {
                        insertText: {
                            location: {
                                index: recentIndex-1,
                            },
                            text: `${paperSources[i]}\n`
    
                        }
                    }
                ]
            }
        })
    }

        await new Promise((r) => setTimeout(r, 1000))

        const doc = await docs.documents.get({documentId: mydocumentId})
        const fullLength = doc.data.body.content[doc.data.body.content.length-1].endIndex
        
        const formatter = await docs.documents.batchUpdate({
            documentId: mydocumentId,
            requestBody: {
                requests: [
                {
                    updateTextStyle: {
                        range: {
                            startIndex: 1,
                            endIndex: fullLength,
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
                        endIndex: fullLength,
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
  console.log(`Essay written`)
} 
catch(err) {
        console.log(err)
        throw err
    }
}
writeDocument(`122c642Y-FaQ-i8R1Nbq95QJIo8sNkd2GaT6SJYT-jq0`)