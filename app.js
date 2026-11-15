const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeText = document.getElementById('themeText');
const themeIcon = document.getElementById('themeIcon');

const moonSVG = `<path d="M19.513 11.397a.701.701 0 00-.588.128 7.496 7.496 0 01-2.276 1.336 7.101 7.101 0 01-2.583.462 7.505 7.505 0 01-5.32-2.209 7.568 7.568 0 01-2.199-5.342c0-.873.154-1.72.41-2.49a6.904 6.904 0 011.227-2.21.657.657 0 00-.102-.924.701.701 0 00-.589-.154C5.32.397 3.347 1.682 2.013 3.556A9.776 9.776 0 00.18 9.272c0 2.67 1.052 5.186 2.95 7.086 1.898 1.9 4.412 2.952 7.079 2.952 2.232 0 4.361-.745 6.105-2.105 1.744-1.36 3.001-3.233 3.591-5.367a.685.685 0 00-.392-.441z"/>`;
const sunSVG = `<path d="M10 14.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0-12a.75.75 0 00.75-.75v-1a.75.75 0 00-1.5 0v1c0 .414.336.75.75.75zm0 15a.75.75 0 00-.75.75v1a.75.75 0 001.5 0v-1a.75.75 0 00-.75-.75zm7.5-7.5a.75.75 0 00.75.75h1a.75.75 0 000-1.5h-1a.75.75 0 00-.75.75zm-15 0a.75.75 0 00-.75-.75h-1a.75.75 0 000 1.5h1a.75.75 0 00.75-.75zm12.803-5.303a.75.75 0 001.06 0l.708-.707a.75.75 0 00-1.061-1.061l-.707.707a.75.75 0 000 1.061zm-10.606 10.606a.75.75 0 00-1.06 0l-.708.707a.75.75 0 101.061 1.061l.707-.707a.75.75 0 000-1.061zm10.606 0a.75.75 0 000 1.061l.707.707a.75.75 0 101.061-1.061l-.707-.707a.75.75 0 00-1.061 0zM4.697 4.697a.75.75 0 000-1.061l-.707-.707a.75.75 0 10-1.061 1.061l.707.707a.75.75 0 001.061 0z"/>`;

// Dark / Light Mode almashtirish
themeToggle.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  if (isDark) {
    html.setAttribute('data-theme', 'light');
    themeText.textContent = 'DARK';
    themeIcon.innerHTML = moonSVG;
  } else {
    html.setAttribute('data-theme', 'dark');
    themeText.textContent = 'LIGHT';
    themeIcon.innerHTML = sunSVG;
  }
});

// GitHub API orqali foydalanuvchi ma'lumotlarini olish
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const errorMsg = document.getElementById('errorMsg');

async function fetchUser(username) {
  try {
    errorMsg.style.display = 'none';
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      errorMsg.style.display = 'block';
      return;
    }
    const data = await response.json();
    updateUI(data);
  } catch (err) {
    errorMsg.style.display = 'block';
  }
}

function updateUI(user) {
  document.getElementById('desktopAvatar').src = user.avatar_url;
  document.getElementById('mobileAvatar').src = user.avatar_url;
  document.getElementById('userName').textContent = user.name || user.login;
  
  const loginEl = document.getElementById('userLogin');
  loginEl.textContent = `@${user.login}`;
  loginEl.href = user.html_url;

  const date = new Date(user.created_at);
  const formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  document.getElementById('joinedDate').textContent = `Joined ${formattedDate}`;

  const bioEl = document.getElementById('userBio');
  bioEl.textContent = user.bio || 'This profile has no bio';
  bioEl.style.opacity = user.bio ? '1' : '0.65';

  document.getElementById('reposCount').textContent = user.public_repos;
  document.getElementById('followersCount').textContent = user.followers;
  document.getElementById('followingCount').textContent = user.following;

  // Qo'shimcha havolalarni yangilash
  setLink('locationItem', 'userLocation', user.location);
  setLink('twitterItem', 'userTwitter', user.twitter_username, `https://twitter.com/${user.twitter_username}`);
  
  const blogUrl = user.blog ? (user.blog.startsWith('http') ? user.blog : `https://${user.blog}`) : null;
  setLink('blogItem', 'userBlog', user.blog, blogUrl);
  setLink('companyItem', 'userCompany', user.company);
}

function setLink(itemId, textId, value, href = null) {
  const item = document.getElementById(itemId);
  const textEl = document.getElementById(textId);
  if (value) {
    item.classList.remove('not-available');
    textEl.textContent = value;
    if (href) textEl.href = href;
  } else {
    item.classList.add('not-available');
    textEl.textContent = 'Not Available';
    if (href) textEl.removeAttribute('href');
  }
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) fetchUser(query);
});

searchInput.addEventListener('input', () => {
  errorMsg.style.display = 'none';
});

// Boshlang'ich holatda 'octocat' profilini yuklash
fetchUser('octocat');