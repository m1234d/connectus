// Determine the room name and public URL for this chat session.
function getRoom() {
    var query = location.search && location.search.split("?")[1];
  
    if (query) {
      return (location.search && decodeURIComponent(query.split("=")[1]));
    }
    return "default"
  }
  
  // Retrieve the absolute room URL.
  function getRoomURL() {
    return location.protocol + "//" + location.host + (location.path || "") + "?room=" + getRoom();
  }
  
  // Enable video on the page.
  function enableVideo() {
    document.getElementById("url").style.display = "block";
    document.getElementById("remotes").style.visibility = "visible";
    loadSimpleWebRTC();
  }
  
  // Dynamically load the simplewebrtc script so that we can
  // kickstart the video call.
  function loadSimpleWebRTC() {
    var script = document.createElement("script");
    script.src = "./static/latest-v3.js";
    document.head.appendChild(script);
  
    script.onload = function() {
      var webrtc = new SimpleWebRTC({
        localVideoEl: "selfVideo",
        // the id/element dom element that will hold remote videos
        remoteVideosEl: "",
        autoRequestMedia: true,
        debug: false,
        detectSpeakingEvents: true,
        autoAdjustMic: false
      });
  
      // Set the publicly available room URL.
      document.getElementById("roomUrl").innerText = getRoomURL();
  
      // Immediately join room when loaded.
      webrtc.on("readyToCall", function() {
        webrtc.joinRoom(getRoom());
      });
  
      function showVolume(el, volume) {
        if (!el) return;
        if (volume < -45) volume = -45; // -45 to -20 is
        if (volume > -20) volume = -20; // a good range
        el.value = volume;
      }
  
      // Display the volume meter.
      webrtc.on("localStream", function(stream) {
        var button = document.querySelector("form>button");
        if (button) button.removeAttribute("disabled");
        document.getElementById("localVolume").style.display = "block";
      });
  
      // If we didn't get access to the camera, raise an error.
      webrtc.on("localMediaError", function (err) {
        alert("This service only works if you allow camera access.Please grant access and refresh the page.");
      });
  
      // When another person joins the chat room, we'll display their video.
      webrtc.on("videoAdded", function(video, peer) {
        console.log("user added to chat", peer);
        var remotes = document.getElementById("remotes");
  
        if (remotes) {
          var outerContainer = document.createElement("div");
          outerContainer.className = "col-md-6";
  
          var container = document.createElement("div");
          container.className = "videoContainer";
          container.id = "container_" + webrtc.getDomId(peer);
          container.appendChild(video);
  
          // Suppress right-clicks on the video.
          video.oncontextmenu = function() { return false; };
  
          // Show the volume meter.
          var vol = document.createElement("meter");
          vol.id = "volume_" + peer.id;
          vol.className = "volume";
          vol.min = -45;
          vol.max = -20;
          vol.low = -40;
          vol.high = -25;
          container.appendChild(vol);
  
          // Show the connection state.
          if (peer && peer.pc) {
            var connstate = document.createElement("div");
            connstate.className = "connectionstate";
            container.appendChild(connstate);
  
            peer.pc.on("iceConnectionStateChange", function(event) {
              switch (peer.pc.iceConnectionState) {
                case "checking":
                  connstate.innerText = "connecting to peer...";
                  break;
                case "connected":
                case "completed": // on caller side
                  vol.style.display = "block";
                  connstate.innerText = "connection established";
                  break;
                case "disconnected":
                  connstate.innerText = "disconnected";
                  break;
                case "failed":
                  connstate.innerText = "connection failed";
                  break;
                case "closed":
                  connstate.innerText = "connection closed";
                  break;
              }
            });
          }
  
          outerContainer.appendChild(container);
          remotes.appendChild(outerContainer);
  
          // If we're adding a new video we need to modify bootstrap so we
          // only get two videos per row.
          var remoteVideos = document.getElementById("remotes").getElementsByTagName("video").length;
  
          if (!(remoteVideos % 2)) {
            var spacer = document.createElement("div");
            spacer.className = "w-100";
            remotes.appendChild(spacer);
          }
        }
      });
  
      // If a user disconnects from chat, we need to remove their video feed.
      webrtc.on("videoRemoved", function(video, peer) {
        console.log("user removed from chat", peer);
        var remotes = document.getElementById("remotes");
        var el = document.getElementById("container_" + webrtc.getDomId(peer));
        if (remotes && el) {
          remotes.removeChild(el.parentElement);
        }
      });
  
      // If our volume has changed, update the meter.
      webrtc.on("volumeChange", function(volume, treshold) {
        showVolume(document.getElementById("localVolume"), volume);
      });
  
      // If a remote user's volume has changed, update the meter.
      webrtc.on("remoteVolumeChange", function(peer, volume) {
        showVolume(document.getElementById("volume_" + peer.id), volume);
      });
  
      // If there is a P2P failure, we need to error out.
      webrtc.on("iceFailed", function(peer) {
        var connstate = document.querySelector("#container_" + webrtc.getDomId(peer) + " .connectionstate");
        console.log("local fail", connstate);
        if (connstate) {
          connstate.innerText = "connection failed";
          fileinput.disabled = "disabled";
        }
      });
  
      // remote p2p/ice failure
      webrtc.on("connectivityError", function (peer) {
        var connstate = document.querySelector("#container_" + webrtc.getDomId(peer) + " .connectionstate");
        console.log("remote fail", connstate);
        if (connstate) {
          connstate.innerText = "connection failed";
          fileinput.disabled = "disabled";
        }
      });
    }
  }
  loadSimpleWebRTC();
