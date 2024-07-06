document.addEventListener('DOMContentLoaded', function() {
    var videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      var videoSrc = 'https://fusionparty.space/video/muted_chat_340.webm';
      var videoHtml = `
        <video width="100%" autoplay="" loop="" muted="" playsinline="" class="rounded">
          <source src="${videoSrc}" type="video/mp4">
          Your browser must not support the video tag.
        </video>
      `;
      videoContainer.innerHTML = videoHtml;
    }
});
