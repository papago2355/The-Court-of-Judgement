import { Howl } from "howler";

// Local files served by the Python server at /sounds/* if present;
// otherwise these will silently 404 and Howl will not play.
// Provide CC0 audio in mcp-server/judgement_mcp/web/sounds/ when ready.
let _gavel: Howl | null = null;
let _bell: Howl | null = null;
let _ambient: Howl | null = null;
let _unlocked = false;

function maybe(src: string, opts: Partial<ConstructorParameters<typeof Howl>[0]> = {}): Howl {
  return new Howl({ src: [src], html5: false, preload: true, ...opts });
}

export function unlockAudio() {
  if (_unlocked) return;
  _unlocked = true;
  _gavel = maybe("/sounds/gavel.mp3", { volume: 0.85 });
  _bell = maybe("/sounds/bell.mp3", { volume: 0.6 });
  _ambient = maybe("/sounds/courtroom.mp3", { loop: true, volume: 0.18 });
  try {
    _ambient.play();
  } catch {
    /* ignore */
  }
}

export function gavel() {
  _gavel?.play();
}

export function bell() {
  _bell?.play();
}

export function isAudioUnlocked() {
  return _unlocked;
}
