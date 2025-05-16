function playTransition() {
  const overlay = document.getElementById("videoOverlay");
  const video = document.getElementById("transitionVideo");

  overlay.style.display = "block";
  video.currentTime = 0;
  video.play();

  video.onended = () => {
    overlay.style.display = "none";
  };
}