// blog.js
fetch('/api/blog')
  .then(res => res.json())
  .then(posts => {
    const container = document.getElementById('blogPosts');
    if (!posts.length) {
      container.innerHTML = "<p>No blog posts yet.</p>";
      return;
    }
    container.innerHTML = posts.map(post => `
      <article class="blog-post">
<h2><a href="blog-post.html?id=${post.id}">${post.title}</a></h2>
        <p><em>${new Date(post.date).toLocaleDateString()}</em></p>
        <div>${post.content.substring(0, 200)}${post.content.length > 200 ? "..." : ""}</div>
      </article>
    `).join('');
  })
  .catch(() => {
    document.getElementById('blogPosts').innerHTML = "<p>Could not load blog posts.</p>";
  });
