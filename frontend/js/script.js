document.addEventListener("DOMContentLoaded", function () {
    // late movement   --   just one second
    setTimeout(() => {
        animateElement("burble-left", 100, 1); // left burble movement 
    }, 1000);

    setTimeout(() => {
        animateElement("burble-right", -100, 1); // right burble movement 
    }, 1500);

    setTimeout(() => {
        fadeInElement("text-container"); // text apperance 
    }, 2000);

    setTimeout(() => {
        slideInElement("underline"); // underline move 
    }, 2500);
});

// function of burbles movement
function animateElement(id, translateX, duration) {
    let element = document.getElementById(id);
    element.style.transition = `opacity ${duration}s ease-out, transform ${duration}s ease-out`;
    element.style.opacity="1";
    element.style.transform = `translateX(${translateX}px)`;
}

// function of text
function fadeInElement(id) {
    let element = document.getElementById(id);
    element.style.transition = "opacity 1s ease-out";
    element.style.opacity = "1";
}

// function of underline
function slideInElement(id) {
    let element = document.getElementById(id);
    element.style.transition = "transform 1s ease-out";
    element.style,transform = "translateX(0)";
}