import { YoutubeTranscript } from 'youtube-transcript';

export async function getTranscript(url) {
     const transcript = await YoutubeTranscript.fetchTranscript(url)
    let text = ''
    for (let i = 0; i < transcript.length; i++) {
        text += transcript[i].text + ' ';
    }
    return text
}