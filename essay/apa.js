const {google} = require('googleapis')
const dotenv = require('dotenv')
const fs = require('fs')
const {getLastIndex} = require('./utils/getIndex')
const path = require('path')
const { fileURLToPath } = require('url')

dotenv.config()

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/documents']
})

async function writeAPA(mydocumentId) {
    try {
        const docs = google.docs({
            version: `v1`,
            auth
        })

    const ESSAY_PATH = path.join(__dirname, 'generated-essay.json')
    const essayFile = fs.readFileSync(ESSAY_PATH, 'utf8')
    const paperData = JSON.parse(essayFile)
    
    const title = paperData.title

    const paperCredentials = `\n\n${paperData.usersName}\n${paperData.affiliation}\n${paperData.className}\n${paperData.professorName}\n${paperData.date}`
    const paperHeadings = paperData.headings

    const writefirstPage = await docs.documents.batchUpdate({
        documentId: mydocumentId,
        requestBody: {
            requests: [
                {
                    insertText: {
                        location: { index: 1 },
                        text: title
                    }
                },
                {
                    updateTextStyle: {
                        range: {
                            startIndex: 1,
                            endIndex: 1 + title.length
                        },
                        textStyle: { bold: true },
                        fields: "bold"
                    }
                },

                {
                    insertText : {
                        location: {
                            index: 1+ title.length
                        }, text: `\n${paperCredentials}\n`
                    }
                },

                {
                    updateTextStyle: {
                        range: {
                            startIndex: 1 + title.length+1,
                            endIndex: 1+ title.length + 1+ paperCredentials.length
                        },
                        textStyle: {bold: false},
                        fields: "bold"
                    }
                },
               
                {
                    updateParagraphStyle: {
                        range: {
                            startIndex: 1,
                            endIndex: 1 + title.length + 1 + paperCredentials.length + 2
                        },
                        paragraphStyle: {
                            alignment: "CENTER"
                        },
                        fields: "alignment"
                    }
                }, 
                
                {
                    insertPageBreak: {
                        location: {
                            index: 1 + title.length + 1 + paperCredentials.length
                        }
                    }
                }
            ]
        }
    })
    
    let recentIndex = (await getLastIndex(docs, mydocumentId)) || 1
    recentIndex = recentIndex
    const introBody = `\n\b\t${paperHeadings[0].body}`
    const bodyStartIndex = recentIndex-1+title.length
    const bodyEndIndex = bodyStartIndex + introBody.length
    
    const writeintroPage = await docs.documents.batchUpdate({
    documentId: mydocumentId,
    requestBody: {
        requests: [
            {
                insertText: {
                    location: {
                        index: recentIndex-1
                    },
                    text: title
                }
            },
            {
                updateTextStyle: {
                    range: {
                        startIndex: recentIndex-1,
                        endIndex: recentIndex + title.length
                    },
                    textStyle: {
                        bold: true,
                    },
                    fields: "bold"
                }
            },
            
            {
                updateParagraphStyle: {
                    range: {
                        startIndex: recentIndex,
                        endIndex: recentIndex+ title.length
                    },
                    paragraphStyle: {
                        alignment: "CENTER"
                    },
                    fields: "alignment"
                }
            },
            {
                insertText: {
                    location: {
                        index: recentIndex-1 + title.length
                    }, text: `\n\b\t${paperHeadings[0].body}`
                }
            }, 

            {
                updateTextStyle: {
                    range: {
                        startIndex: bodyStartIndex,
                        endIndex: bodyEndIndex
                    },
                    textStyle: {
                        bold: false
                    },
                    fields: "bold"
                }
            }
        ]
    }
})

for(let i = 1; i < paperHeadings.length; i++) {
    recentIndex = await getLastIndex(docs, mydocumentId)
    const titleText = `\n\n${paperHeadings[i].title}`
    const titleStart = recentIndex -1 + 2
    const titleEnd = titleStart + paperHeadings[i].title.length

    const subText = `\n${paperHeadings[i].subheading}`
    const subStart = titleEnd+1
    const subEnd = subStart + paperHeadings[i].subheading.length

    const subheadBody = `\n\t${paperHeadings[i].body}`
    const subheadbodyStart = subEnd+1
    const subheadbodyEnd = subheadbodyStart + paperHeadings[i].body.length

    const writesubsnBods = await docs.documents.batchUpdate({
        documentId: mydocumentId, 
        requestBody: {
            requests: [
                //titles
                {
                    insertText: {
                        location: {
                            index: recentIndex-1, 
                        }, text: titleText
                    }
                },
                
                {
                    updateTextStyle: {
                        range: {
                            startIndex: titleStart,
                            endIndex: titleEnd
                        },
                        textStyle: {bold: true},
                        fields: "bold"
                    }
                },
                
                {
                    updateParagraphStyle: {
                        range: {
                            startIndex: recentIndex,
                            endIndex: recentIndex+ paperHeadings[i].title.length
                        },
                        paragraphStyle: {
                            alignment: "CENTER"
                        },
                        fields: "alignment"
                    }
                }, 
                //subheadings
                {
                    insertText: {
                        location: {
                            index: titleEnd,
                        }, text: subText
                    }
                }, 
                
                {
                    updateParagraphStyle: {
                        range: {startIndex: subStart, endIndex: subEnd},
                        paragraphStyle: {alignment: "START"},
                        fields: "alignment"
                    }
                },
                //subhead bodies
                {
                    insertText: {
                        location: {
                            index: subEnd
                        }, text: subheadBody
                    }
                }, 
                
                {
                    updateTextStyle: {
                        range: {
                            startIndex: subheadbodyStart,
                            endIndex: subheadbodyEnd
                        },
                        textStyle: {bold: false},
                        fields: "bold"
                    }
                }, 
            ]
        }
    })
}


recentIndex = await getLastIndex(docs, mydocumentId)
const conclusionTitle = `\n\n${paperData.conclusion.title}`
const conclusionBody = `\n\t${paperData.conclusion.body}`

const conclusionStart = recentIndex -1 + 2
const conclusionEnd = conclusionStart+ paperData.conclusion.title.length

const conclusionbodyStart = recentIndex -1 + conclusionTitle.length
const conclusionbodyEnd = conclusionbodyStart + conclusionBody.length

const writeconclusion = await docs.documents.batchUpdate({
    documentId: mydocumentId,
    requestBody: {
        requests:
        [ 
            {
            insertText: {
                location: {
                    index: recentIndex-1,
                }, text: conclusionTitle
            }
        },

        {
            updateTextStyle: {
                range: {
                    startIndex: conclusionStart,
                    endIndex: conclusionEnd
                },
                textStyle: {bold: true},
                fields: "bold"
            }
        },
    
        {
            insertText: {
                location: {
                    index: recentIndex-1 + conclusionTitle.length,
                }, text: conclusionBody
            }
        },

        {
            updateTextStyle: {
                range: {
                    startIndex: conclusionbodyStart,
                    endIndex: conclusionbodyEnd
                },
                textStyle: {bold: false},
                fields: "bold"
            }
        },

        {
            insertPageBreak: {
                location: {
                    index: conclusionbodyEnd
                }
            }
        }, 
      ]
    }
})

recentIndex = await getLastIndex(docs, mydocumentId)
const writereferencesPage = await docs.documents.batchUpdate({
    documentId: mydocumentId,
    requestBody: {
        requests: [
            {
                insertText: {
                    location: {
                        index: recentIndex-1,
                    }, text: "References"
                }
            },

            {
                updateTextStyle: {
                    range: {
                        startIndex: recentIndex-1,
                        endIndex: recentIndex -1 + "References".length
                    },
                    textStyle: {bold: true},
                    fields: "bold"
                }
            }, 

            {
                updateParagraphStyle: {
                    range: {
                        startIndex: recentIndex-1,
                        endIndex: recentIndex-1 + "References".length
                    },
                    paragraphStyle: {
                        alignment: "CENTER"
                    },
                    fields: "alignment"
                }
            }
        ]
    }
})

recentIndex = await getLastIndex(docs, mydocumentId)
for(let i = 0; i < paperData.references.length; i++) {
    const reference = `\n${paperData.references[i]}\n`
    const end = recentIndex-1 + reference.length
    await docs.documents.batchUpdate({
        documentId: mydocumentId,
        requestBody: {
            requests: [
                {
                    insertText: {
                        location: {
                            index: recentIndex-1
                        }, text: reference
                    }
                }, 

                {
                    updateTextStyle: {
                        range: {
                            startIndex: recentIndex-1,
                            endIndex: end
                        },
                        textStyle: {bold: false},
                        fields: "bold"
                    }
                }
            ]
        }
    })
}

const doc = await docs.documents.get({ documentId: mydocumentId });
const fullLength = doc.data.body.content.reduce((acc, elem) => acc + ((elem.endIndex || 0) - (elem.startIndex || 0)), 0);

await docs.documents.batchUpdate({
  documentId: mydocumentId,
  requestBody: {
    requests: [
      {
        updateParagraphStyle: {
          range: { startIndex: 1, endIndex: fullLength },
          paragraphStyle: { lineSpacing: 200 },
          fields: "lineSpacing"
        }
      }
    ]
  }
})

} catch(err) {
    console.log(`Error: ${err}`)
    throw err
}
}

module.exports = {writeAPA}