document.addEventListener("DOMContentLoaded", function() {
    var observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                console.log('Time to spread!');
                function slideCardsInContainer(container){
                    // Get the children with the class 'spreadable'
                    var spreadableItems = container.getElementsByClassName('spreadable');
                    var card1 = spreadableItems[1];
                    card1.style.top = "18%";
                    card1.style.left = "-12%";
                    card1.style.transform = "rotate(-18deg)";
                    var card2 = spreadableItems[1];
                    card2.style.top = "15%";
                    card2.style.left = "15%";
                    card2.style.transform = "rotate(-5deg)"
                    var card3 = spreadableItems[2];
                    card3.style.top = "10%";
                    card3.style.left = "45%";
                    card3.style.transform = "rotate(10deg)";
                }
                slideCardsInContainer(entry.target);
                // Optional: Stop observing the element after animating
                observer.unobserve(entry.target);
            }
        });
    });

    // Select all elements to observe
    var targets = document.querySelectorAll('.spreadable-container');
    targets.forEach(function(target) {
        observer.observe(target);
    });
});
