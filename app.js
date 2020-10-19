const clientID = 'Iv1.4664650d51f823ce';
const clientSecret = '6f86781666467b1caddadafd954800c99193d79';
const name = document.querySelector('#name');
const avatar = document.querySelector('#avatar');
const login = document.querySelector('#login');
const bio = document.querySelector('#bio');
const github_profile = document.querySelector('#github_profile');

const searchBtn = document.querySelector('form');

//Repos
let last_repos = document.querySelector('#last-repos');
let repos_nbr = document.querySelector('#repos_nbr');
let repos_count = 4;
let repos_sort = 'created:desc';

//Followers
let followers_title = document.querySelector('#followers-title');
let followers_nbr = document.querySelector('#followers-nbr');
let followers_count = 4;


// Input function
let username= '';
const inputUser = () => {
    let input_user = document.querySelector('#username').value.trim();
    if(input_user.length <= 0){
        //alert('Please type a gitHub username');
        document.querySelector('#username').value = '';
        document.querySelector('#username').focus();
        return false;
    }else{
        username = input_user.split(' ').join('');
        showDetails();
    }
}

// Fetch function
const fetchUser = async (user) => {
    const user_url = await fetch(`https://api.github.com/users/${user}?client_id=${clientID}&client_secret?${clientSecret}`);
    const followers_url = await fetch(`https://api.github.com/users/${user}/followers?per_page=${followers_count}&client_id=${clientID}&client_secret=${clientSecret}`);
    const repos_url = await fetch(`https://api.github.com/users/${user}/repos?per_page=${repos_count}&sort=${repos_sort}&client_id=${clientID}&client_secret=${clientSecret}`);

    const data = await user_url.json();
    const followers_data = await followers_url.json();
    const repos_data = await repos_url.json();
    console.log(data)
    return {data: data, followers_data: followers_data, repos_data: repos_data}
}

const showUser = (data) => {
        avatar.src = data.avatar_url;
        login.innerHTML = data.login;
        name.innerHTML = data.name;
        bio.innerHTML = data.bio;
        github_profile.href = data.html_url;
        repos_nbr.innerHTML = `<span class="badge red white-text" data-badge-caption="repos" style="font-size=11px;">${data.public_repos}</span>`;
        followers_nbr.innerHTML = `<span class="badge red white-text" data-badge-caption="followers">${data.followers}</span>`;
        last_repos.appendChild(repos_nbr);
        followers_title.appendChild(followers_nbr);
}

const showFollowers = (followers_data) => {
    let followers = document.querySelector('#followers');
    followers_data.forEach((follower) => {
        let li = document.createElement('li');
        li.classList.add('collection-item', 'avatar');
        li.innerHTML = `<img src="${follower.avatar_url}" alt="Follower Avatar" class="circle">
        <span class="title">@${follower.login}</span>
        <p>
        <a href="${follower.html_url}" target="_blank">${follower.html_url}</a>
        </p>`;
        followers.appendChild(li);
    });
}

const showRepos = (repos) => {
    let repos_content = document.querySelector('#repos');
    repos.forEach((repo) => {
        let li = document.createElement('li');
        li.classList.add('collection-item');
        li.innerHTML = `<a href="${repo.html_url}" target="_blank"><span class="title">${repo.name}</span></a>
        <div class="secondary-content grey-text text-darken-3">
            <i class="material-icons">grade</i>${repo.stargazers_count}
        </div>
        `;
        repos_content.appendChild(li);
    });
}

const showDetails = () => {
    fetchUser(username).then(res => {
        showUser(res.data);
        showFollowers(res.followers_data);
        showRepos(res.repos_data);
    })
}


searchBtn.addEventListener("submit", (e) => {
    e.preventDefault();

    inputUser();
});