const clientID = 'Iv1.4664650d51f823ce';
const clientSecret = '6f86781666467b1caddadafd954800c99193d79';
//DOM Elements
const searchBtn = document.querySelector('form');
const profile = document.querySelector('#profile');

//Repos
let repos_number = 0;
let repos_count = 4;
let repos_sort = 'created:desc';
let repositories = document.querySelector('#repositories');

//Followers
let followers_count = 4;
let followers_number = 0;
let followers_content = document.querySelector('#followers-content');

// Input function
let username= '';
const inputUser = () => {
    let input_user = document.querySelector('#username').value.trim();
    if(input_user <= 0){
        alert('Please type a gitHub username');
        document.querySelector('#username').value = '';
        document.querySelector('#username').focus();
        return false;
    }else{
        username = input_user.split(' ').join('');
        showDetails();
        document.querySelector('#username').value = '';
        document.querySelector('#username').focus();
        profile.innerHTML = ``;
        followers_content.innerHTML = ``;
        repositories.innerHTML = ``;
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

    
    return {data: data, followers_data: followers_data, repos_data: repos_data}
}

// Show Users details
const showUser = (data) => {
        if(data.message === 'Not Found'){
            alert('User not found');
            profile.innerHTML = ``;
        }else{
            profile.innerHTML = `
            <div class="col s12 l4 offset-l1">
                <div class="card-panel">
                    <div class="card-image center">
                        <img id="avatar" src="${data.avatar_url}" class="responsive-img circle" style="max-width: 200px;">
                    </div>
                    <ul>
                        <li id="name" class="bold">${data.name}</li>
                        <li id="login" class="grey-text">${data.login}</li>
                        <br>
                        <li id="bio">${data.bio}</li>
                    </ul>
                    <br>
                    <div class="card-action center">
                        <a id="github_profile" href="${data.html_url}">View Profile</a>
                    </div>
                </div>
            </div>
        `
            repos_number = data.public_repos;
            followers_number = data.followers;
        }
}

// Show Followers Detais
const showFollowers = (followers_data, followers_number) => {
    let output = '';
    console.log(followers_number);
    followers_data.forEach((follower) => {
        output += `<li class="collection-item avatar"><img src="${follower.avatar_url}" alt="Follower Avatar" class="circle">
        <span class="title">@${follower.login}</span>
        <p>
        <a href="${follower.html_url}" target="_blank">${follower.html_url}</a>
        </p></li>`;
    });
    followers_content.innerHTML = `
    <div class="col s12 l6">
        <div class="card-panel">
            <div class="card-title">
                <h5 id="followers-title">Followers <span class="badge red white-text" data-badge-caption="followers" style="font-size=11px;">${followers_number}</span></h5>
            </div>
            <br>
            <div class="card-content">
                <ul id="followers" class="collection">
                    ${output}
                </ul>
            </div>
        </div>
    </div>`;
}

// Show Repos Details
const showRepos = (repos, repos_number) => {
    let output = '';
    repos.forEach((repo) => {
        output += `
        <li class="collection-item"><a href="${repo.html_url}" target="_blank"><span class="title">${repo.name}</span></a>
        <div class="secondary-content grey-text text-darken-3">
            <i class="material-icons">grade</i>${repo.stargazers_count}
        </div></li>
        `;
    });
    repositories.innerHTML = `<div class="col s12 l10 offset-l1">
    <div class="card-panel">
        <div class="card-title">
            <h5 id="last-repos">Latest Repos<span class="badge red white-text" data-badge-caption="repos" style="font-size=11px;">${repos_number}</span></h5>
        </div>
        <br>
        <div class="card-content">
            <ul class="collection" id="repos">
            ${output}
            </ul>
        </div>
    </div>
    </div>`;
}

// Call to display everything
const showDetails = () => {
    fetchUser(username).then(res => {
        showUser(res.data);
        showFollowers(res.followers_data, res.data.followers);
        showRepos(res.repos_data, res.data.public_repos);
    });
}


searchBtn.addEventListener("submit", (e) => {
    inputUser();
    e.preventDefault();
});