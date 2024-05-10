import { useEffect, useRef } from 'react'
import './App.css'

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

let peerConnection: null | RTCPeerConnection = null;
let localStream: null | MediaStream = null;

function App() {
  const socket = useRef<WebSocket | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  async function handleOffer(offer: any) {
    if (peerConnection) {
      console.log("Existing peer connection detected; closing it first");
      return;
    }

    try {
      peerConnection = new RTCPeerConnection(configuration);
      peerConnection.onicecandidate = event => {
        const message: any = {
          type: "candidate",
          candidate: null
        }

        if (event.candidate) {
          message.candidate = event.candidate.candidate;
          message.sdpMid = event.candidate.sdpMid;
          message.sdpMLineIndex = event.candidate.sdpMLineIndex;
        }

        console.log("Candidate", message)
        socket.current?.send(JSON.stringify(message));
      }

      peerConnection.ontrack = event => {
        console.log('Received remote stream');
        const remoteVideo = remoteVideoRef.current

        if (remoteVideo) {
          const [remoteStream] = event.streams;
          remoteVideo.srcObject = remoteStream;
        }
      }

      if (localStream) {
        localStream.getTracks().forEach(track => peerConnection!.addTrack(track, localStream as any));
      }

      await peerConnection.setRemoteDescription(offer);

      const answer = await peerConnection.createAnswer();
      socket.current?.send(JSON.stringify({
        type: 'answer',
        sdp: answer.sdp
      }));

      await peerConnection.setLocalDescription(answer);
    } catch (error) {
      console.error('Error creating peer connection:', error);
    }
  }

  async function handleAnswer(answer: any) {
    if (!peerConnection) {
      console.error("No peer connection found");
      return;
    }

    try {
      await peerConnection.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error setting remote description:', error);
    }
  }

  async function handleCandidate(candidate: any) {
    try {
      if (!peerConnection) {
        console.error("No peer connection found");
        return;
      }

      if (!candidate) {
        await peerConnection.addIceCandidate(undefined);
      } else {
        console.log('Adding ICE candidate:', candidate);
        await peerConnection.addIceCandidate(candidate);
      }
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  async function handleReady() {
    if (peerConnection) {
      console.log("Existing peer connection detected; closing it first");
      return;
    }

    try {
      peerConnection = new RTCPeerConnection(configuration);
      peerConnection.onicecandidate = event => {
        const message: any = {
          type: "candidate",
          candidate: null
        }

        if (event.candidate) {
          message.candidate = event.candidate.candidate;
          message.sdpMid = event.candidate.sdpMid;
          message.sdpMLineIndex = event.candidate.sdpMLineIndex;
        }

        console.log("Candidate", message)
        socket.current?.send(JSON.stringify(message));
      }

      peerConnection.ontrack = event => {
        console.log('Received remote stream');
        const remoteVideo = remoteVideoRef.current

        if (remoteVideo) {
          const [remoteStream] = event.streams;
          remoteVideo.srcObject = remoteStream;
        } else {
          console.error('Remote video not ready');
        }
      }

      if (localStream) {
        localStream.getTracks().forEach(track => peerConnection!.addTrack(track, localStream as any));
      }

      const offer = await peerConnection.createOffer();

      socket.current?.send(JSON.stringify({
        type: 'offer',
        sdp: offer.sdp
      }));

      await peerConnection.setLocalDescription(offer);
    } catch (error) {
      console.error('Error creating peer connection:', error);
    }
  }

  async function handleBye() {
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
  }

  useEffect(() => {
    var url = import.meta.env.VITE_APP_WEBRTC_SIGNALING_SERVER

    if (url.includes('localhost') && window.location.hostname !== 'localhost') {
      url = url.replace('localhost', window.location.hostname)
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        const video = videoRef.current

        if (video) {
          video.srcObject = stream;
        }

        localStream = stream;

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2JlZmZlMDE0YmE4ZTJmZjFmZWE2ZCJ9.JRCQT593L13NYk5UHe5_c6CFssBD9BO4-ktiH2oS6s4"
        const _socket = new WebSocket(url, ["Authorization", token]);

        _socket.addEventListener('open', () => {
          console.log('Connected to signaling server');

          _socket.addEventListener('message', event => {
            if (!localStream) {
              console.log('Local stream not ready');
              return;
            }

            const data: any = JSON.parse(event.data);

            switch (data.type) {
              case 'init':
                handleReady();
                break;
              case 'offer':
                handleOffer(data);
                break;
              case 'answer':
                handleAnswer(data);
                break;
              case 'candidate':
                handleCandidate(data);
                break;
              case "bye":
                handleBye();
                break;
              default:
                console.log('Unknown message type:', data.type);
                break;
            }
          })
        })

        socket.current = _socket;
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
      })

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    }
  }, [])

  return (
    <div className='p-5'>
      <h1 className='text-3xl font-bold'>P2P</h1>
      <div className='flex gap-10 p-10 justify-center'>
        <video ref={videoRef} className='w-[800px] h-[400px] border-4 border-black' autoPlay playsInline muted></video>
        <video ref={remoteVideoRef} className='w-[800px] h-[400px] border-4 border-black' autoPlay playsInline></video>
      </div>
    </div>
  )
}

export default App;
