import { Component, OnInit, ViewChild, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { SocketioService } from '../services/socketio.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-videochat',
  templateUrl: './videochat.component.html',
  styleUrls: ['./videochat.component.css']
})
export class VideochatComponent implements OnInit {

  @ViewChild('f', { static: true })myForm: NgForm;
  @ViewChild('video', {static: true}) video: ElementRef<HTMLVideoElement>;
  model: any = {};
  message: string;
  messages: string[] = [];
  userEmail;
  deviceInfo;
  socket: any;
  formContainer = true;

  // DOM elements.
  roomSelectionContainer: any;
  roomInput: any;
  connectButton: any;

  videoChatContainer: any;
  localVideoComponent: any;
  remoteVideoComponent: any;

  // Variables.
  // socket = io()
  mediaConstraints: any = {
    audio: true,
    video: { width: 1280, height: 720 },
  };
  localStream: any;
  remoteStream: any;
  isRoomCreator: any;
  rtcPeerConnection: any; // Connection between the local device and the remote peer.
  roomId: any;

  // Free public STUN servers provided by Google.
  iceServers: any = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ],
  };
  constructor(private socketService: SocketioService, private _userService: UserService,
              private deviceService: DeviceDetectorService,
              @Inject(PLATFORM_ID) private _platform: Object,
              @Inject(DOCUMENT) document) {
      this.socket = io(environment.SOCKET_ENDPOINT);
      // DOM elements.
      this.roomSelectionContainer = document.getElementById('room-selection-container');
      this.roomInput = document.getElementById('room-input');
      this.connectButton = document.getElementById('connect-button');

      this.videoChatContainer = document.getElementById('video-chat-container');
      this.localVideoComponent = document.getElementById('local-video');
      this.remoteVideoComponent = document.getElementById('remote-video');
  }

  showVideoConference() {
    this.formContainer = false;
    // this.roomSelectionContainer.style = 'display: none';
    // this.videoChatContainer.style = 'display: block';
  }

  sendMessage() {
    console.log(this.model.message);
    // this.socketService.sendMessage(this.model);
    // this.myForm.resetForm();
    // this.connectButton.addEventListener('click', () => {
    //   this.joinRoom(this.model.message); //roomInput.value
    // });
    this.joinRoom(this.model.message);
    this.showVideoConference();
  }

  joinRoom(room: any) {
    if (room === '') {
      alert('Please type a room ID');
    } else {
      this.roomId = room;
      this.socket.emit('join', room);
      this.showVideoConference();
      this.getPermission();
    }
  }

  // FUNCTIONS ==================================================================
  async setLocalStream(mediaConstraints) {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    } catch (error) {
      console.error('Could not get user media', error);
    }

    this.localStream = stream;
    this.localVideoComponent.srcObject = stream;
  }

  addLocalTracks(rtcPeerConnection) {
    this.localStream.getTracks().forEach((track) => {
      rtcPeerConnection.addTrack(track, this.localStream);
    });
  }

  async createOffer(rtcPeerConnection) {
    let sessionDescription;
    try {
      sessionDescription = await rtcPeerConnection.createOffer();
      rtcPeerConnection.setLocalDescription(sessionDescription);
    } catch (error) {
      console.error(error);
    }
    const chatRoom: any = this.roomId;
    this.socket.emit('webrtc_offer', {
      type: 'webrtc_offer',
      sdp: sessionDescription,
      chatRoom,
      // roomId,
    });
  }

  async createAnswer(rtcPeerConnection) {
    let sessionDescription;
    try {
      sessionDescription = await rtcPeerConnection.createAnswer();
      rtcPeerConnection.setLocalDescription(sessionDescription);
    } catch (error) {
      console.error(error);
    }
    const chatRoom: any = this.roomId;

    this.socket.emit('webrtc_answer', {
      type: 'webrtc_answer',
      sdp: sessionDescription,
      // roomId,
      chatRoom
    });
  }

  setRemoteStream(event) {
    this.remoteVideoComponent.srcObject = event.streams[0];
    this.remoteStream = event.stream;
  }

  sendIceCandidate(event) {
    if (event.candidate) {
      const chatRoom: any = this.roomId;

      this.socket.emit('webrtc_ice_candidate', {
        // roomId,
        chatRoom,
        label: event.candidate.sdpMLineIndex,
        candidate: event.candidate.candidate,
      });
    }
  }

  getPermission() {
    this.socket.on('room_created', async () => {
      console.log('Socket event callback: room_created');
      await this.setLocalStream(this.mediaConstraints);
      this.isRoomCreator = true;
    });

    this.socket.on('room_joined', async () => {
      console.log('Socket event callback: room_joined');
      await this.setLocalStream(this.mediaConstraints);
      const chatRoom: any = this.roomId;
      this.socket.emit('start_call', chatRoom);
      // this.socket.emit('start_call', roomId);
    });

    this.socket.on('full_room', () => {
      console.log('Socket event callback: full_room');
      alert('The room is full, please try another one');
    });

    this.socket.on('start_call', async () => {
      console.log('Socket event callback: start_call');

      if (this.isRoomCreator) {
        this.rtcPeerConnection = new RTCPeerConnection(this.iceServers);
        this.addLocalTracks(this.rtcPeerConnection);
        this.rtcPeerConnection.ontrack = this.setRemoteStream;
        this.rtcPeerConnection.onicecandidate = this.sendIceCandidate;
        await this.createOffer(this.rtcPeerConnection);
      }
    });

    this.socket.on('webrtc_offer', async (event) => {
        console.log('Socket event callback: webrtc_offer');

        if (!this.isRoomCreator) {
          this.rtcPeerConnection = new RTCPeerConnection(this.iceServers);
          this.addLocalTracks(this.rtcPeerConnection);
          this.rtcPeerConnection.ontrack = this.setRemoteStream;
          this.rtcPeerConnection.onicecandidate = this.sendIceCandidate;
          this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
          await this.createAnswer(this.rtcPeerConnection);
        }
      });

    this.socket.on('webrtc_answer', (event) => {
        console.log('Socket event callback: webrtc_answer');

        this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
      });

    this.socket.on('webrtc_ice_candidate', (event) => {
        console.log('Socket event callback: webrtc_ice_candidate');

        // ICE candidate configuration.
        const candidate = new RTCIceCandidate({
          sdpMLineIndex: event.label,
          candidate: event.candidate,
        });
        this.rtcPeerConnection.addIceCandidate(candidate);
      });
  }

// SOCKET EVENT CALLBACKS =====================================================
// this.socket.on('room_created', async () => {
//     console.log('Socket event callback: room_created');

//     await this.setLocalStream(this.mediaConstraints);
//     this.isRoomCreator = true;
//   });

// this.socket.on('room_joined', async () => {
//     console.log('Socket event callback: room_joined');

//     await this.setLocalStream(this.mediaConstraints);
//     this.socket.emit('start_call', roomId);
//   });

// this.socket.on('full_room', () => {
//     console.log('Socket event callback: full_room');

//     alert('The room is full, please try another one');
//   });

// this.socket.on('start_call', async () => {
//     console.log('Socket event callback: start_call');

//     if (this.isRoomCreator) {
//       this.rtcPeerConnection = new RTCPeerConnection(this.iceServers);
//       addLocalTracks(this.rtcPeerConnection);
//       this.rtcPeerConnection.ontrack = setRemoteStream;
//       this.rtcPeerConnection.onicecandidate = sendIceCandidate;
//       await createOffer(this.rtcPeerConnection);
//     }
//   });

// this.socket.on('webrtc_offer', async (event) => {
//     console.log('Socket event callback: webrtc_offer');

//     if (!isRoomCreator) {
//       rtcPeerConnection = new RTCPeerConnection(iceServers);
//       addLocalTracks(rtcPeerConnection);
//       rtcPeerConnection.ontrack = setRemoteStream;
//       rtcPeerConnection.onicecandidate = sendIceCandidate;
//       rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
//       await createAnswer(rtcPeerConnection);
//     }
//   });

// this.socket.on('webrtc_answer', (event) => {
//     console.log('Socket event callback: webrtc_answer');

//     rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
//   });

// this.socket.on('webrtc_ice_candidate', (event) => {
//     console.log('Socket event callback: webrtc_ice_candidate');

//     // ICE candidate configuration.
//     const candidate = new RTCIceCandidate({
//       sdpMLineIndex: event.label,
//       candidate: event.candidate,
//     });
//     rtcPeerConnection.addIceCandidate(candidate);
//   });

ngOnInit() {

}

}
