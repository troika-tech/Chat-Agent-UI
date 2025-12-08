# Sound Files for Chat Notifications

This directory contains sound files used for chat notifications.

## Required Sound Files

You need to add the following sound files to this directory:

1. **send-sound.mp3** - Sound played when user sends a message
   - Recommended: Short, subtle "whoosh" or "pop" sound
   - Duration: 0.2-0.5 seconds
   - Volume: Moderate (will be adjusted to 40% in code)

2. **receive-sound.mp3** - Sound played when bot message is received
   - Recommended: Gentle notification sound like a "ding" or "chime"
   - Duration: 0.3-0.6 seconds
   - Volume: Moderate (will be adjusted to 40% in code)

## Sound File Requirements

- **Format**: MP3
- **Size**: Keep files small (< 50KB each) for fast loading
- **Duration**: Short sounds (0.2-0.6 seconds) work best
- **Quality**: 44.1kHz or 48kHz sample rate is recommended

## Where to Find Free Sound Effects

You can find free sound effects from:
- [Freesound.org](https://freesound.org) - Free sound effects library
- [Zapsplat](https://www.zapsplat.com) - Free sound effects (requires free account)
- [Mixkit](https://mixkit.co/free-sound-effects/) - Free sound effects
- [Pixabay](https://pixabay.com/sound-effects/) - Free sound effects

## Testing

After adding the sound files:
1. Make sure the files are named exactly: `send-sound.mp3` and `receive-sound.mp3`
2. Test by sending a message - you should hear the send sound
3. Wait for a bot response - you should hear the receive sound
4. Use the sound toggle button (speaker icon) in the input area to enable/disable sounds

## Note

If sound files are not found, the application will continue to work normally without playing sounds. Errors are handled silently to prevent console spam.

