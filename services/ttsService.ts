
// Text-to-Speech service using Web Speech API

export interface TTSVoice {
  name: string;
  lang: string;
  voiceURI: string;
}

export class TTSService {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (!('speechSynthesis' in window)) {
      throw new Error('Web Speech API is not supported in this browser');
    }
    this.synth = window.speechSynthesis;
  }

  // Get available voices
  getVoices(): TTSVoice[] {
    const voices = this.synth.getVoices();
    return voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      voiceURI: voice.voiceURI
    }));
  }

  // Get Italian voices
  getItalianVoices(): TTSVoice[] {
    return this.getVoices().filter(v => v.lang.startsWith('it'));
  }

  // Get English voices
  getEnglishVoices(): TTSVoice[] {
    return this.getVoices().filter(v => v.lang.startsWith('en'));
  }

  // Speak text
  speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      volume?: number;
      voiceURI?: string;
      onEnd?: () => void;
      onError?: (error: Error) => void;
      onBoundary?: (event: SpeechSynthesisEvent) => void;
    }
  ): void {
    // Cancel any ongoing speech
    this.stop();

    this.utterance = new SpeechSynthesisUtterance(text);

    // Set options
    if (options?.rate !== undefined) this.utterance.rate = options.rate;
    if (options?.pitch !== undefined) this.utterance.pitch = options.pitch;
    if (options?.volume !== undefined) this.utterance.volume = options.volume;

    // Set voice
    if (options?.voiceURI) {
      const voices = this.synth.getVoices();
      const voice = voices.find(v => v.voiceURI === options.voiceURI);
      if (voice) {
        this.utterance.voice = voice;
      }
    } else {
      // Try to use an Italian voice by default
      const voices = this.synth.getVoices();
      const italianVoice = voices.find(v => v.lang.startsWith('it'));
      if (italianVoice) {
        this.utterance.voice = italianVoice;
      }
    }

    // Set event handlers
    if (options?.onEnd) {
      this.utterance.onend = options.onEnd;
    }

    if (options?.onError) {
      this.utterance.onerror = (event) => {
        options.onError!(new Error(`Speech synthesis error: ${event.error}`));
      };
    }

    if (options?.onBoundary) {
      this.utterance.onboundary = options.onBoundary;
    }

    // Speak
    this.synth.speak(this.utterance);
  }

  // Pause speech
  pause(): void {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  // Resume speech
  resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  // Stop speech
  stop(): void {
    this.synth.cancel();
    this.utterance = null;
  }

  // Check if speaking
  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  // Check if paused
  isPaused(): boolean {
    return this.synth.paused;
  }

  // Convert text to audio blob (for download)
  async textToAudioBlob(text: string, options?: { voiceURI?: string }): Promise<Blob> {
    // Note: Web Speech API doesn't support direct audio capture
    // This is a limitation - we can only play audio, not save it
    // For saving, we'd need a server-side TTS service
    throw new Error('Web Speech API does not support audio file generation. Audio can only be played in real-time.');
  }
}

// Export a singleton instance
export const ttsService = new TTSService();
