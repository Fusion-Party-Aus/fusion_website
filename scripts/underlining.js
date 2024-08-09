document.addEventListener("DOMContentLoaded", function() {
    if (window.matchMedia("(max-width: 767px)").matches) {
        // Our styles will not apply any underlining animations on mobile, as Google thinks it's delaying the largest
        // contentful paint 😿
        return;
    }

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
