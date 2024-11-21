import React, { useState } from "react";
import microphone from './icons/microphone.gif';
import muteUnmute from './icons/mute-unmute.png';

export const ButtonRecognitionText = () => {
  const [audioURL, setAudioURL] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

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
      .then(response => response.json())
      .then(data => {
        if (data.transcription) {
          alert(`Transcripción: ${data.transcription}`);
        } else {
          alert(`Error: ${data.error}`);
        }
      })
      .catch(error => {
        console.error("Error al enviar el audio:", error);
      });
  }
  
  const startRecording = () => {
    if (!navigator.mediaDevices) {
      alert("Media devices not supported in your browser");
      return;
    }

    const constraints = {
      audio: {
        sampleRate: 16000, // Sample rate in Hz
        channelCount: 1,   // Mono (1 channel) or 2 for stereo
        sampleSize: 16,    // Bit depth
      },
      video: false
    };

    navigator.mediaDevices
      .getUserMedia({audio: constraints})
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        recorder.addEventListener("dataavailable", e => {
          const audio = new Blob([e.data], { type: "audio/wav" });
          const url = URL.createObjectURL(audio);
          setAudioURL(url);
          handleSendAudio(audio);  // Enviar automáticamente después de grabar
        });

        const maxRecordingTime = 6000;  // 6 segundos
        setTimeout(() => {
          recorder.stop();  // Detener grabación automáticamente después de 6 segundos
          setRecording(false);
        }, maxRecordingTime);

        recorder.start();
        setRecording(true);
        setMediaRecorder(recorder);
      })
      .catch(error => {
        console.error("Error accessing microphone:", error);
        alert("Error accessing microphone");
      });
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();  // Detener grabación manualmente si el usuario hace clic
      setRecording(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mt-4">
      {audioURL && <audio controls src={audioURL} />}
      <button onClick={recording ? stopRecording : startRecording}>
        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center">
          {recording
            ? <img src={{microphone}} width={28} height={28} />
            : <img src={{muteUnmute}} width={28} height={28} />}
        </div>
      </button>
    </div>
  );
};
