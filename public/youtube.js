import { YoutubeTranscript } from '@danielxceron/youtube-transcript';;

export async function getTranscript(url) {
    const transcript = await YoutubeTranscript.fetchTranscript(url)
    if(transcript.length === 0) {
        return `No transcript found`
    }
    let text = ''
    for (let i = 0; i < transcript.length; i++) {
        text += transcript[i].text + ' ';
    }
    return text
}