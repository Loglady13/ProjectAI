import React, { useState } from "react";
import microphone from "./icons/microphone.gif";
import muteUnmute from "./icons/mute-unmute.png";

export const ButtonRecognitionText = () => {
  const [audioURL, setAudioURL] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  async function resampleAudio(blob, targetSampleRate = 44100) {
    const audioContext = new AudioContext();
    const arrayBuffer = await blob.arrayBuffer();

    // Decodificar el audio grabado
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Crear un OfflineAudioContext con la frecuencia de muestreo deseada
    const offlineAudioContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length * (targetSampleRate / audioBuffer.sampleRate),
      targetSampleRate
    );

    // Copiar el buffer de audio al contexto offline
    const bufferSource = offlineAudioContext.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(offlineAudioContext.destination);
    bufferSource.start(0);

    // Renderizar el audio resampleado
    const resampledAudioBuffer = await offlineAudioContext.startRendering();

    // Convertir el buffer resampleado a Blob WAV
    return audioBufferToWav(resampledAudioBuffer);
  }

  function audioBufferToWav(audioBuffer) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numberOfChannels * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + audioBuffer.length * numberOfChannels * 2, true);
    writeString(view, 8, "WAVE");

    // FMT sub-chunk
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, audioBuffer.sampleRate, true);
    view.setUint32(28, audioBuffer.sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);

    // Data sub-chunk
    writeString(view, 36, "data");
    view.setUint32(40, audioBuffer.length * numberOfChannels * 2, true);

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        let sample = audioBuffer.getChannelData(channel)[i];
        sample = Math.max(-1, Math.min(1, sample));
        view.setInt16(
          offset,
          sample < 0 ? sample * 0x8000 : sample * 0x7fff,
          true
        );
        offset += 2;
      }
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  function handleSendAudio(audio) {
    if (audio.type !== "audio/wav") {
      console.error("Invalid file type:", audio.type);
      alert("Please record audio in WAV format.");
      return;
    }
    const formData = new FormData();
    formData.append("audio", audio, "recording.wav");

    fetch("http://localhost:5000/transcribe", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.transcription) {
          alert(`Transcripción: ${data.transcription}`);
        } else {
          alert(`Error: ${data.error}`);
        }
      })
      .catch((error) => {
        console.error("Error al enviar el audio:", error);
      });
  }

  const startRecording = () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert("Media devices not supported in your browser");
      return;
    }

    const constraints = {
      audio: {
        sampleRate: 44000, // Sample rate in Hz
        channelCount: 1, // Mono (1 channel) or 2 for stereo
        sampleSize: 16, // Bit depth
      },
      video: false,
    };
    /*
    navigator.mediaDevices
      .getUserMedia({ audio: constraints })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        
        recorder.addEventListener("dataavailable", (e) => {
          const audio = new Blob([e.data], { type: "audio/wav" });
          const url = URL.createObjectURL(audio);
          setAudioURL(url);
          handleSendAudio(audio); // Enviar automáticamente después de grabar
        });
      */

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        const recorder = new MediaRecorder(stream);

        const audioChunks = []; // Almacenar los datos grabados
        recorder.addEventListener("dataavailable", (e) => {
          audioChunks.push(e.data);
        });

        recorder.addEventListener("stop", async () => {
          const blob = new Blob(audioChunks, { type: "audio/webm" });
          try {
            const wavBlob = await resampleAudio(blob, 44100); // Cambiar frecuencia a 44,100 Hz
            const wavUrl = URL.createObjectURL(wavBlob);

            console.log("Archivo WAV resampleado listo:", wavUrl);

            // Opcional: Manejo adicional del archivo WAV
            setAudioURL(wavUrl);
            handleSendAudio(wavBlob);
          } catch (error) {
            console.error("Error al procesar el audio:", error);
          }
        });

        const maxRecordingTime = 11000; // 6 segundos
        setTimeout(() => {
          recorder.stop(); // Detener grabación automáticamente después de 6 segundos
          setRecording(false);
        }, maxRecordingTime);

        recorder.start();
        setRecording(true);
        setMediaRecorder(recorder);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
        alert("Error accessing microphone");
      });
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop(); // Detener grabación manualmente si el usuario hace clic
      setRecording(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      {audioURL && <audio controls src={audioURL} />}
      <button onClick={recording ? stopRecording : startRecording}>
        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center">
          {recording ? (
            <img src={{ microphone }} width={28} height={28} />
          ) : (
            <img src={{ muteUnmute }} width={28} height={28} />
          )}
        </div>
      </button>
    </div>
  );
};
