document.addEventListener("DOMContentLoaded", function () {
    // Toggle Share Options
    document.querySelectorAll(".share-btn").forEach(button => {
        button.addEventListener("click", function () {
            const postId = this.getAttribute("data-post-id");
            const shareOptions = document.getElementById(`share-options-${postId}`);
            shareOptions.style.display = (shareOptions.style.display === "none") ? "flex" : "none";
        });
    });

    // WhatsApp Share
    document.querySelectorAll(".whatsapp-share").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const postId = this.getAttribute("data-post-id");
            const postTitle = document.querySelector(`h2`).innerText;
            const postURL = window.location.origin + "/home";  // Change to the actual post URL if needed
            const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(postTitle + " - " + postURL)}`;
            window.open(whatsappURL, "_blank");
        });
    });

    // Instagram Share (Manual Copy for Now)
    document.querySelectorAll(".instagram-share").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const postId = this.getAttribute("data-post-id");
            const postTitle = document.querySelector(`[data-post-id='${postId}'] h2`).innerText; 
    
            const postURL = window.location.origin + "/home"; // Change to actual post URL if needed
            const message = `${postTitle} - ${postURL}`;
    
            // Copy link to clipboard
            navigator.clipboard.writeText(message).then(() => {
                alert("Link copied! Open Instagram and paste it.");
            }).catch(err => console.error("Copy failed", err));
        });
    });
}); // ✅ Properly closed DOMContentLoaded event
