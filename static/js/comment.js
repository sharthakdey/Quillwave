document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".comment-form").forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const postId = this.getAttribute("data-post-id");
            const formData = new FormData(this);
            const commentList = document.getElementById(`comments-list-${postId}`);
            const commentCount = document.getElementById(`comment-count-${postId}`);

            fetch(`/add_comment/${postId}`, {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    // ✅ Append new comment dynamically
                    const newComment = document.createElement("div");
                    newComment.classList.add("comment");
                    newComment.innerHTML = `<strong>${data.user}</strong>: ${data.content}`;
                    commentList.appendChild(newComment);

                    // ✅ Update comment count
                    commentCount.innerText = parseInt(commentCount.innerText) + 1;

                    // ✅ Clear input field
                    this.reset();
                }
            })
            .catch(error => console.error("Error:", error));
        });
    });
});
