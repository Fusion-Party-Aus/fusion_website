document.addEventListener("DOMContentLoaded", function() {

    var observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("h-underline-animate");
                // Optional: Stop observing the element after animating
                observer.unobserve(entry.target);
            }
        });
    });

    // Select all elements to observe
    var targets = document.querySelectorAll('.h-underline');
    targets.forEach(function(target) {
        observer.observe(target);
    });
});
