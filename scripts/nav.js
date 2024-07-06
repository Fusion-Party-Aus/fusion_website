// https://codepen.io/andiio/pen/ARxgGb
// Notice that this depends on jQuery.

$(function () {
    // https://stackoverflow.com/a/19561886/1495729
    //  This is needed for mobile.
    $('.dropdown-toggle').hover(function () {
            $(this).addClass('hover');  // Notice that these are not Popper classes
        },
        function () {
            $(this).removeClass('hover');
        });
});

const isMouseCloseBelowElement = (element, event) => {
    const rect = element.getBoundingClientRect();
    const parent = element.parentElement;  // <li class="nav-item dropdown>
    const parentStyle = window.getComputedStyle(parent, null);
    const paddingBottom = parseInt(parentStyle.getPropertyValue('padding-bottom'));
    return rect.bottom + paddingBottom + 2 > event.clientY &&
        event.clientY > rect.top &&
        rect.left <= event.clientX &&
        event.clientX <= rect.right;
}

$(document).ready(
    function () {
        const nearTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--near-top'));

        function updateNavColor(targetHeight) {
            if (targetHeight < nearTop) {
                $("#header-nav").removeClass("bg-glass-opaque");
            } else {
                $("#header-nav").addClass("bg-glass-opaque");
            }
        }

        function hideNav() {
            $("#header-nav").addClass("hide-nav-bar");
        }

        function showNav() {
            $("#header-nav").removeClass("hide-nav-bar");
        }

        $(document).on('keydown', function (e) {
            if (e.key === 'Home') {
                showNav();
                updateNavColor(0);
            }
        });

        $('html').on('DOMMouseScroll mousewheel', function (e) {
            if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
                //scrolling down
                hideNav();
            } else {
                //scrolling up
                showNav();
            }
            updateNavColor(window.scrollY);
        });
        $('.navbar-toggler').on('click', function (event) {
            if ($(this).hasClass('clicked-open')) {
                $(this).removeClass('clicked-open');
                if (window.scrollY < nearTop) {
                    $("#header-nav").removeClass('bg-glass-opaque');
                }
            } else {
                $(this).addClass('clicked-open');
                $("#header-nav").addClass('bg-glass-opaque');
            }
        });

        // Here we're adding the same classes as Popper, so that mouse-over behaves the same as
        // what Popper would do, for a click.
        var dropdownToggles = document.querySelectorAll('.dropdown-toggle');

        dropdownToggles.forEach(function (toggle) {
            var dropdownUnorderedList = toggle.nextElementSibling;
            var parentLi = toggle.parentElement;
            const revealDropdown = () => {
                toggle.classList.add('show');
                // Open the clicked dropdown
                dropdownUnorderedList.classList.add('show');
                // For position.
                dropdownUnorderedList.setAttribute('data-bs-popper', 'static');
            }
            const hideDropdown = () => {
                toggle.classList.remove('show');
                dropdownUnorderedList.classList.remove('show');
                dropdownUnorderedList.removeAttribute('data-bs-popper');
            }
            const sleep = (delay_ms) => {
              return new Promise(resolve => setTimeout(resolve, delay_ms));
            }
            const delayedHiding = async () => {
                // Some other process was interfering with our clicks, so we need to revise it like this.
                await sleep(10);
                hideDropdown();
            }
            parentLi.addEventListener('mouseenter', function (event) {
                if ($('.navbar-toggler').css('display') !== 'none') {
                    // The screen is too narrow to use mouse hover.
                    return;
                }
                if (!dropdownUnorderedList.classList.contains('show')) {
                    // Close any other dropdowns
                    var openDropdowns = document.querySelectorAll('.dropdown-menu.show');
                    var reveal = true;
                    openDropdowns.forEach(function (openDropdown) {
                        if (dropdownUnorderedList !== openDropdown) {
                            var toggleTarget = openDropdown.previousElementSibling;
                            if (toggleTarget.classList.contains('clicked-open')) {
                                reveal = false;
                            } else {
                                openDropdown.classList.remove('show');
                                openDropdown.removeAttribute('data-bs-popper');
                            }
                        }
                    });
                    if (reveal) {
                        revealDropdown();
                    }
                }
            });
            toggle.addEventListener('click', function (event) {
                if (toggle.classList.contains('clicked-open')) {
                    // Popper has processing the click first, so we can't use 'show'
                    toggle.classList.remove('show');
                    toggle.classList.remove('clicked-open');
                    toggle.removeAttribute('data-bs-popper');
                    delayedHiding();
                } else {
                    revealDropdown();
                    toggle.classList.add('clicked-open');
                }
            });
            parentLi.addEventListener('mouseleave', function (event) {
                if ($('.navbar-toggler').css('display') !== 'none') {
                    // The screen is too narrow to use mouse hover.
                    return;
                }
                // https://stackoverflow.com/a/57321303/1495729
                if (!dropdownUnorderedList.classList.contains('hover')
                    && !isMouseCloseBelowElement(toggle, event)) {
                    delayedHiding();
                }
            });
        });

        function handleFragmentLinkClick(event) {
            hideNav();
        }

        $('a[href^="#"]:not([href="#"])').on('click', handleFragmentLinkClick);
    }
);
