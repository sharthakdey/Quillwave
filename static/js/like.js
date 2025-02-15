document.querySelectorAll(".like-btn").forEach(button => {
    button.addEventListener("click", function () {
        const postId = this.getAttribute("data-post-id");
        const likeCount = document.getElementById(`like-count-${postId}`);

        fetch(`/like/${postId}`, {
            method: "POST",
            headers: { "X-Requested-With": "XMLHttpRequest" }
        })
        .then(response => response.json())
        .then(data => {
            if (data.likes !== undefined) {
                likeCount.innerText = data.likes;
                this.classList.toggle("liked"); // Toggle like button glow
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
