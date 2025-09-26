import { writeFileSync, mkdirSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const sampleRate = 44100
const durationSeconds = 3.2
const totalSamples = Math.floor(sampleRate * durationSeconds)
const channels = 1
const bytesPerSample = 2
const buffer = Buffer.alloc(44 + totalSamples * bytesPerSample * channels)

// Write WAV header
buffer.write('RIFF', 0)
buffer.writeUInt32LE(36 + totalSamples * bytesPerSample * channels, 4)
buffer.write('WAVE', 8)
buffer.write('fmt ', 12)
buffer.writeUInt32LE(16, 16) // PCM chunk size
buffer.writeUInt16LE(1, 20) // PCM format
buffer.writeUInt16LE(channels, 22)
buffer.writeUInt32LE(sampleRate, 24)
const byteRate = sampleRate * channels * bytesPerSample
buffer.writeUInt32LE(byteRate, 28)
const blockAlign = channels * bytesPerSample
buffer.writeUInt16LE(blockAlign, 32)
buffer.writeUInt16LE(bytesPerSample * 8, 34) // bits per sample
buffer.write('data', 36)
buffer.writeUInt32LE(totalSamples * bytesPerSample * channels, 40)

let offset = 44
for (let i = 0; i < totalSamples; i += 1) {
  const t = i / sampleRate
  const progress = i / totalSamples
  const baseFreq = 180 + progress * 420
  const wobble = 10 * Math.sin(progress * Math.PI * 6)
  const frequency = baseFreq + wobble
  const envelope = progress < 0.05 ? progress / 0.05 : 1 - (progress - 0.05) * 0.8
  const amplitude = 0.85 * Math.max(0, envelope)
  const value = Math.sin(2 * Math.PI * frequency * t)
  const tick = Math.sin(2 * Math.PI * (frequency * 2.5) * t) * (progress % 0.09 < 0.045 ? 0.25 : 0)
  const sample = Math.max(-1, Math.min(1, value * amplitude + tick))
  const intSample = Math.floor(sample * 32767)
  buffer.writeInt16LE(intSample, offset)
  offset += bytesPerSample
}

const outputDir = join(__dirname, '..', 'public', 'assets', 'sounds')
mkdirSync(outputDir, { recursive: true })
const tempWav = join(outputDir, 'spin_temp.wav')
const outputMp3 = join(outputDir, 'spin.mp3')

writeFileSync(tempWav, buffer)

const ffmpegResult = spawnSync(ffmpegInstaller.path, [
  '-y',
  '-i', tempWav,
  '-codec:a', 'libmp3lame',
  '-qscale:a', '4',
  outputMp3,
], { stdio: 'inherit' })

if (ffmpegResult.status !== 0) {
  console.error('Falha ao gerar spin.mp3 via ffmpeg')
  process.exit(ffmpegResult.status ?? 1)
}

unlinkSync(tempWav)
console.log(`Gerado arquivo de audio: ${outputMp3}`)
