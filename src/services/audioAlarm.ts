// Audio & Speech Synthesis Engine for Water Reminders (Web + Hybrid Native Bridge)

export class WaterAlarmAudioService {
  private static audioCtx: AudioContext | null = null;

  // Initialize or resume web AudioContext on user gesture
  private static getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!this.audioCtx) {
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play an escalating dual-tone phone/ring alarm sound
  public static playAlarmRing(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Ring sequence: 3 sets of dual chime beeps
      const playBeep = (time: number, freq1: number, freq2: number, duration: number) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(freq1, time);
        osc2.frequency.setValueAtTime(freq2, time);

        gain.gain.setValueAtTime(0.01, time);
        gain.gain.exponentialRampToValueAtTime(0.3, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + duration);
        osc2.stop(time + duration);
      };

      // Ring pattern
      playBeep(now + 0.0, 587.33, 880, 0.2); // D5 + A5
      playBeep(now + 0.25, 659.25, 987.77, 0.2); // E5 + B5
      playBeep(now + 0.5, 783.99, 1174.66, 0.35); // G5 + D6

      // Second burst
      playBeep(now + 1.1, 587.33, 880, 0.2);
      playBeep(now + 1.35, 659.25, 987.77, 0.2);
      playBeep(now + 1.6, 880, 1318.51, 0.4);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Play high quality, soothing water sound effect based on preference
  public static playWaterDrinkSound(effectType: string = 'crystal_drop', _amount: number = 1): void {
    if (effectType === 'silent') return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Master output gain for soft, soothing pleasant volume
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.4, now);
      masterGain.connect(ctx.destination);

      if (effectType === 'gentle_bubble') {
        // 2 Soothing organic rising micro-bubbles
        const playBubble = (startTime: number, fStart: number, fEnd: number, vol: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';

          osc.frequency.setValueAtTime(fStart, startTime);
          osc.frequency.exponentialRampToValueAtTime(fEnd, startTime + 0.09);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.1);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.11);
        };

        playBubble(now, 420, 950, 0.4);
        playBubble(now + 0.08, 560, 1180, 0.35);

      } else if (effectType === 'crisp_pour') {
        // Delicate 3-note liquid chime (E6 -> G6 -> B6)
        const notes = [1318.51, 1567.98, 1975.53];
        notes.forEach((freq, idx) => {
          const startTime = now + idx * 0.06;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';

          osc.frequency.setValueAtTime(freq, startTime);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + 0.12);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(0.25 - idx * 0.05, startTime + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.2);
        });

      } else if (effectType === 'subtle_pop') {
        // Gentle, rounded tactile click / pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';

        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.04);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.06);

      } else {
        // Default: 'crystal_drop' (Ultra-clean, crisp, soothing water droplet - Minnaert model)
        // 1. Pure primary water drop tone (rapid upward frequency chirp)
        const dropOsc = ctx.createOscillator();
        const dropGain = ctx.createGain();
        dropOsc.type = 'sine';

        // Classic natural water drop sweep: 460 Hz -> 1520 Hz
        dropOsc.frequency.setValueAtTime(460, now);
        dropOsc.frequency.exponentialRampToValueAtTime(1520, now + 0.075);

        dropGain.gain.setValueAtTime(0.001, now);
        dropGain.gain.linearRampToValueAtTime(0.5, now + 0.015);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        dropOsc.connect(dropGain);
        dropGain.connect(masterGain);

        dropOsc.start(now);
        dropOsc.stop(now + 0.14);

        // 2. Warm sub-body resonance for deep liquid acoustic feel
        const bodyOsc = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        bodyOsc.type = 'triangle';

        bodyOsc.frequency.setValueAtTime(240, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

        bodyGain.gain.setValueAtTime(0.001, now);
        bodyGain.gain.linearRampToValueAtTime(0.2, now + 0.01);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        bodyOsc.connect(bodyGain);
        bodyGain.connect(masterGain);

        bodyOsc.start(now);
        bodyOsc.stop(now + 0.1);

        // 3. Gentle harmonic shimmer ring
        const shimmerOsc = ctx.createOscillator();
        const shimmerGain = ctx.createGain();
        shimmerOsc.type = 'sine';

        shimmerOsc.frequency.setValueAtTime(2200, now + 0.02);
        shimmerOsc.frequency.exponentialRampToValueAtTime(1760, now + 0.14);

        shimmerGain.gain.setValueAtTime(0.001, now + 0.02);
        shimmerGain.gain.linearRampToValueAtTime(0.08, now + 0.04);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(masterGain);

        shimmerOsc.start(now + 0.02);
        shimmerOsc.stop(now + 0.16);
      }
    } catch (e) {
      console.warn('Water drink sound error:', e);
    }
  }

  // --- CELEBRATION & GAMIFICATION SOUND EFFECTS ---

  // 1. Triumphant Celebration Fanfare (for Daily Goal completed & major achievements)
  public static playCelebrationFanfare(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.45, now);
      master.connect(ctx.destination);

      // Cheerful rising major arpeggio fanfare (C5 -> E5 -> G5 -> C6 -> E6 -> G6)
      const notes = [
        { f: 523.25, t: 0.0, d: 0.18, v: 0.35 },  // C5
        { f: 659.25, t: 0.12, d: 0.18, v: 0.38 }, // E5
        { f: 783.99, t: 0.24, d: 0.22, v: 0.42 }, // G5
        { f: 1046.5, t: 0.38, d: 0.35, v: 0.5 },  // C6
        { f: 1318.5, t: 0.52, d: 0.6, v: 0.55 },  // E6
        { f: 1567.98, t: 0.68, d: 0.9, v: 0.6 }, // G6 (sustained finale)
      ];

      notes.forEach(({ f, t, d, v }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        g.gain.setValueAtTime(0.001, now + t);
        g.gain.linearRampToValueAtTime(v, now + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + t + d);

        osc.connect(g);
        g.connect(master);

        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });

      // Shimmering chime sparkles on top
      const sparkleFreqs = [2093, 2637, 3135, 4186];
      sparkleFreqs.forEach((sf, idx) => {
        const st = now + 0.5 + idx * 0.08;
        const sOsc = ctx.createOscillator();
        const sGain = ctx.createGain();
        sOsc.type = 'sine';
        sOsc.frequency.setValueAtTime(sf, st);

        sGain.gain.setValueAtTime(0.001, st);
        sGain.gain.linearRampToValueAtTime(0.12, st + 0.01);
        sGain.gain.exponentialRampToValueAtTime(0.0001, st + 0.4);

        sOsc.connect(sGain);
        sGain.connect(master);

        sOsc.start(st);
        sOsc.stop(st + 0.45);
      });
    } catch (e) {
      console.warn('Celebration fanfare sound error:', e);
    }
  }

  // 2. Badge Unlocked Sound (Bright golden sparkle harp chime)
  public static playBadgeUnlockedSound(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.4, now);
      master.connect(ctx.destination);

      // Sparkling high harp notes
      const notes = [880, 1174.66, 1318.51, 1760, 2093];
      notes.forEach((freq, idx) => {
        const startTime = now + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.35 - idx * 0.04, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(master);

        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch (e) {
      console.warn('Badge unlock sound error:', e);
    }
  }

  // 3. Sad Broken Streak Sound (Disappointing "Goal Conceded / Fotmob style" low drone + minor fall)
  public static playStreakBrokenSadSound(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.5, now);
      master.connect(ctx.destination);

      // Step 1: Heavy, dull low-impact thud (like the devastating sound of ball hitting the net / buzzer)
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(95, now);
      thudOsc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

      thudGain.gain.setValueAtTime(0.001, now);
      thudGain.gain.linearRampToValueAtTime(0.65, now + 0.02);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      thudOsc.connect(thudGain);
      thudGain.connect(master);

      thudOsc.start(now);
      thudOsc.stop(now + 0.42);

      // Step 2: Melancholic descending minor slide (Fotmob goal conceded disappointment motif)
      // Dissonant minor tones sliding down: Eb4 (311Hz) -> D4 (293Hz) -> C#4 (277Hz) -> Bb3 (233Hz) -> G3 (196Hz)
      const sadSlideOsc1 = ctx.createOscillator();
      const sadGain1 = ctx.createGain();
      sadSlideOsc1.type = 'sawtooth';

      // Lowpass filter to make it dull, mournful, and muffled
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.frequency.linearRampToValueAtTime(220, now + 0.9);

      sadSlideOsc1.frequency.setValueAtTime(311.13, now + 0.05); // Eb4
      sadSlideOsc1.frequency.linearRampToValueAtTime(277.18, now + 0.35); // C#4
      sadSlideOsc1.frequency.linearRampToValueAtTime(207.65, now + 0.7); // G#3
      sadSlideOsc1.frequency.exponentialRampToValueAtTime(130.81, now + 1.1); // C3 (flat ending)

      sadGain1.gain.setValueAtTime(0.001, now + 0.05);
      sadGain1.gain.linearRampToValueAtTime(0.35, now + 0.12);
      sadGain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

      sadSlideOsc1.connect(filter);
      filter.connect(sadGain1);
      sadGain1.connect(master);

      sadSlideOsc1.start(now + 0.05);
      sadSlideOsc1.stop(now + 1.2);

      // Step 3: Second detuned sad oscillator for depressing acoustic beating
      const sadSlideOsc2 = ctx.createOscillator();
      const sadGain2 = ctx.createGain();
      sadSlideOsc2.type = 'sine';

      sadSlideOsc2.frequency.setValueAtTime(320.0, now + 0.05);
      sadSlideOsc2.frequency.linearRampToValueAtTime(185.0, now + 0.75);
      sadSlideOsc2.frequency.exponentialRampToValueAtTime(125.0, now + 1.1);

      sadGain2.gain.setValueAtTime(0.001, now + 0.05);
      sadGain2.gain.linearRampToValueAtTime(0.25, now + 0.1);
      sadGain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

      sadSlideOsc2.connect(sadGain2);
      sadGain2.connect(master);

      sadSlideOsc2.start(now + 0.05);
      sadSlideOsc2.stop(now + 1.2);

    } catch (e) {
      console.warn('Sad streak broken sound error:', e);
    }
  }

  private static speechTimeoutId: any = null;

  // Speak personalized Persian reminder voice: "لیوان آبت رو نخوردی {اسم}"
  public static speakPersianReminder(name?: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const userName = name && name.trim() ? name.trim() : '';
      const textToSpeak = userName
        ? `لیوان آبت رو نخوردی ${userName}!`
        : 'وقتشه یه لیوان آب بنوشی!';

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'fa-IR';
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      // Try finding Persian / Arabic / multilingual voice
      const voices = window.speechSynthesis.getVoices();
      const persianVoice = voices.find(
        (v) =>
          v.lang.startsWith('fa') ||
          v.lang.startsWith('per') ||
          v.name.toLowerCase().includes('persian') ||
          v.name.toLowerCase().includes('farsi')
      );

      if (persianVoice) {
        utterance.voice = persianVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // Trigger full alarm cycle (Phone ring tone + Voice speech)
  public static triggerFullAlarm(name?: string): void {
    this.playAlarmRing();
    if (this.speechTimeoutId) {
      clearTimeout(this.speechTimeoutId);
      this.speechTimeoutId = null;
    }
    // Speak voice after ringtone starts
    this.speechTimeoutId = setTimeout(() => {
      this.speakPersianReminder(name);
      this.speechTimeoutId = null;
    }, 2000);
  }

  // Play a pleasant water drop bubble notification chime (Duolingo style)
  public static playWaterDropNotification(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.4, now);
      master.connect(ctx.destination);

      // Play soft dual-tone water pop
      const freqs = [659.25, 987.77, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const st = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.7, st);
        osc.frequency.exponentialRampToValueAtTime(freq, st + 0.04);

        gain.gain.setValueAtTime(0.001, st);
        gain.gain.linearRampToValueAtTime(0.3 - idx * 0.05, st + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.25);

        osc.connect(gain);
        gain.connect(master);

        osc.start(st);
        osc.stop(st + 0.3);
      });
    } catch (e) {
      console.warn('Notification audio playback error:', e);
    }
  }

  // Play mascot cute chirp based on state
  public static playMascotChirp(expression: 'happy' | 'miss_you' | 'celebrate' | 'sad' = 'happy'): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      if (expression === 'celebrate') {
        this.playCelebrationFanfare();
        return;
      }
      if (expression === 'sad') {
        this.playStreakBrokenSadSound();
        return;
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (expression === 'happy') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
      } else {
        // miss_you: soft gentle whistle
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
      }

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Mascot chirp error:', e);
    }
  }

  // Immediately cancel any active voice or scheduled reminder speech
  public static stopAllAlarms(): void {
    if (this.speechTimeoutId) {
      clearTimeout(this.speechTimeoutId);
      this.speechTimeoutId = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }
}
