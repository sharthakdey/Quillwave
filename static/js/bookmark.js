document.querySelectorAll(".bookmark-btn").forEach(button => {
    button.addEventListener("click", function () {
        const postId = this.getAttribute("data-post-id");

        fetch(`/bookmark/${postId}`, {
            method: "POST",
            headers: { "X-Requested-With": "XMLHttpRequest" }
        })
        .then(response => response.json())
        .then(data => {
            if (data.bookmarked) {
                this.classList.add("bookmarked");
            } else {
                this.classList.remove("bookmarked");
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
