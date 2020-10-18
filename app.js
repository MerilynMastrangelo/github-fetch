const name = document.querySelector('#name');
const avatar = document.querySelector('#avatar');
const login = document.querySelector('#login');
const bio = document.querySelector('#bio');
const github_profile = document.querySelector('#github_profile');
const repos = document.querySelector('#repos');
const followers = document.querySelector('#followers');
const searchBtn = document.querySelector('.btn');
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
console.log(clientID);


// fetch
const fetchUser = async (user) => {
    const api = await fetch(`https://api.github.com/users/${user}?client_id=${clientID}&client_secret?${clientSecret}`);
    const data = await api.json();
    console.log(data)
    return {data}
}

const showUser = () => {
    fetchUser(username.value).then(res => {
        console.log(res)
        avatar.src = res.data.avatar_url;
        login.innerHTML = res.data.login;
        name.innerHTML = res.data.name;
        bio.innerHTML = res.data.bio;
        github_profile.href = res.data.html_url;
    })
}
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showUser();
});