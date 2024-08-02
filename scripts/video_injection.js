document.addEventListener('DOMContentLoaded', function() {
    var videoContainers = document.getElementsByClassName('video-placeholder');
    if (videoContainers.length > 0) {
        for (var i = 0; i < videoContainers.length; i++) {
            var videoContainer = videoContainers[i];
            console.log(`Considering ${videoContainer.id}`);
            var videoSrc;
            if (videoContainer.id === 'video-big-ideas-container') {
                videoSrc = 'https://fusionparty.space/video/muted_chat_340.webm';
            } else if (videoContainer.id === 'video-events') {
                videoSrc = 'https://fusionparty.space/video/online_highlights_400.webm';
            } else {
                console.error("Unrecognized video container");
                continue; // Skip this container if the ID is unrecognized
            }
            var videoHtml = `
                <video width="100%" autoplay="" loop="" muted="" playsinline="" class="rounded">
                    <source src="${videoSrc}" type="video/mp4">
                    Your browser must not support the video tag.
                </video>
            `;
            videoContainer.innerHTML = videoHtml;
        }
    } else {
        console.log('No video containers found');
    }
});
