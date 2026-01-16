export async function getLastIndex(docs, mydocumentId)
{
    const doc = await docs.documents.get({ documentId: mydocumentId });
    if (!doc.data.body.content || doc.data.body.content.length === 0) {
        return 1; // Default to start of document
    }
    return doc.data.body.content[doc.data.body.content.length - 1].endIndex;
}