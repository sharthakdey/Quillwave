document.addEventListener("DOMContentLoaded", function () {
    // Prevent buttons from refreshing the page
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault(); // Stop form submission
        });
    });
});


