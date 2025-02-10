
document.addEventListener("DOMContentLoaded", function () {
    const likeButtons = document.querySelectorAll(".like-btn");

    likeButtons.forEach(button => {
        button.addEventListener("click", function () {
            const postId = this.getAttribute("data-post-id");
            const likeCount = document.getElementById(`like-count-${postId}`);
            const likeIcon = this.querySelector(".like-icon");

            fetch(`/like/${postId}`, {
                method: "POST",
                headers: { "X-Requested-With": "XMLHttpRequest" }
            })
            .then(response => response.json())
            .then(data => {
                if (data.likes !== undefined) {
                    likeCount.innerText = data.likes; // ✅ Update like count
                    if (data.liked) {
                        likeIcon.classList.add("liked");  // ✅ Add glowing effect
                    } else {
                        likeIcon.classList.remove("liked");  // ✅ Remove glow on unlike
                    }
                }
            })
            .catch(error => console.error("Error:", error));
        });
    });
});

