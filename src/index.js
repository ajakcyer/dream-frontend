let url = "http://localhost:3000/api/v1/";
let mainContainer = document.getElementById("main-container");
let entryContainer = document.getElementById("entry-container");
let userInfoContainer = document.getElementById("user-info-container");
let entriesLink = document.getElementById("entries-link");
let publicLinks = document.getElementById("other-links");
let commentList = document.getElementById("comment-list");
let commentForm = document.getElementById("comment-form");
let myEntriesDiv = document.createElement('div')
let config = {
  method: "POST",
  headers: { "content-type": "application/json", accept: "application/json" },
};


var currentUser;
// function to create elements with 'element' as argument and string you want inside element as 2nd argument.
const createElements = (element) => (string) => {
  let node = document.createElement(element);
  node.innerText = string;
  return node;
};

const GLOBALID = (id = () => id);

const createH1 = createElements("h1");
const createH2 = createElements("h2");
const createH3 = createElements("h3");
const createButton = createElements("button");
const createP = createElements("p");
const createLi = createElements("li");

//places THIS user's info data on page
function renderUser(data) {
  userInfoContainer.innerText = ""
  let userName = createH1(data.username);
  let name = createH2(data.name);
  let age = createH2(`Age: ${data.age}`);
  userInfoContainer.append(userName, name, age);
  // console.log(data.entries);
  if (data.entries.length > 0) renderEntry(data.entries[0]);
}

async function fetchUser(id) {
  let response = await fetch(`${url}/users/${id}`);
  let data = await response.json();
  return data;
}
async function fetchEntriesComments(id) {
  let response = await fetch(`${url}/entries/${id}`);
  let data = await response.json();
  return data.comments;
}

// loads new post on THIS page when a different post is clicked
async function renderEntry({ title, description, id, user_id }) {
  let { username, name } = await fetchUser(user_id);
  let comments = await fetchEntriesComments(id);
  entryContainer.dataset.entryId = id
  let [titleNode, text, button] = entryContainer
    .querySelector(".card-body")
    .querySelectorAll(".node");
  titleNode.innerText = `${title}: By ${name} Follow ${username}`;
  text.innerText = description;
  //button add event to go public

  //create data set for entry - override 
  renderComments(comments);
}

// let userName = createH3(user.username)
// let name = createH3(user.name)
// let title = createH2("Title");
// let dreamDesc = createP(description);
// entryContainer.append(title, userName, name, dreamDesc, commentNode);
// let commentNode = renderComments(comments);

// fetches THIS user's posts and links them as buttons
function renderEntriesLinks({ entries }) {
  // entriesLink.innerText = ""
  // const modalBtn = document.createElement
  const myPosts = document.createElement("h3");
  myPosts.textContent = "My Posts";
  myEntriesDiv.append(myPosts);
  debugger
  entries.forEach((entry) => {
    let entryLink = createP(entry.title);
    entryLink.addEventListener("click", () => {
      renderEntry(entry);
    });
    myEntriesDiv.appendChild(entryLink)
  });
  entriesLink.appendChild(myEntriesDiv);
}

function renderComments(comments) {
  commentList.innerText = "";
  comments.forEach(renderComment);
}

async function renderComment({ comment, user_id }) {
  let { username, name } = await fetchUser(user_id);
  let user_name = createP(`${username} ${name}`);
  let commentNode = createLi(comment);
  commentNode.classList.add("list-group-item");
  commentList.append(commentNode, user_name);
}

//rendering other user posts (public vs private not specified)
const fetchAllEntries = (callBackFunc) => {
  fetch(url + `entries`)
    .then((r) => r.json())
    .then((entries) => {
      callBackFunc(entries);
    });
};

const appendLinksToPage = (entries) => {
  publicLinks.innerText = ""
  const explore = document.createElement('h5')
    explore.textContent = "Explore Public Post!"
  const otherLinksUl = document.createElement("ul");
  // otherLinksUl.textContent = "Post by Other Users";
  entries.forEach((entry) => {
    const link = createLi(entry.title);
    link.addEventListener("click", () => renderEntry(entry));
    otherLinksUl.append(link);
  });
  publicLinks.append(explore, otherLinksUl);
};

const addComment = ({ id }) => {
  // debugger
  commentForm.addEventListener("submit", async (e) => {
    if (id === currentLoggedInUserId){
      // debugger
        // query for data set connected to current entry

      e.preventDefault();

      const entryConID = parseInt(entryContainer.dataset.entryId)
      let post = await fetch(`${url}comments`, {...config, body: JSON.stringify({comment: document.getElementById('comment').value, user_id: id, entry_id: entryConID})});
      let data = await post.json();
      // debugger

      renderComment({
        comment: document.getElementById("comment").value,
        user_id: id,
      });
      
    }
  });
};

function logIn(id) {
  fetch(`${url}/users/${id}`)
  .then(r=>r.json())
  .then(data=>{
    // commentForm.removeEventListener('submit', ()=>{})
    renderUser(data);
    renderEntriesLinks(data);
    fetchAllEntries(appendLinksToPage);
    addComment(data);
  })
}

function returnUser(user) {
  return user;
}



/// LOG IN + SIGN UP + LOG OUT VARIABLES ///
const logInLink = document.querySelector('.login-link')
const logInDom = document.querySelector('.login-options')
const signupLink = logInDom.querySelector('.signup-link')
const loginForm = logInDom.querySelector('form')
const logoutLink = document.querySelector('.logout')

/////// SIGNUP SECTION //////

let currentLoggedInUserId;
const signUpDom = document.querySelector('.sign-up-options')
const loggedInDom = document.querySelector('.logged-in-options')
  loggedInDom.style.display = "none"

let signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // user body from signup form
  const userObj = {
    name: signupForm.InputName.value,
    username: signupForm.InputUserName.value,
    age: signupForm.InputAge.value,
    password: signupForm.InputPassword.value
  }

  const userObjConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(userObj)
  }

  fetch(`${url}users`, userObjConfig)
  .then(r=>r.json())
  .then(newUser => {
    currentLoggedInUserId = newUser.id
    signUpDom.style.display = "none"
    // debugger
    // render your first entry (if you ha)
    logIn(currentLoggedInUserId)
    //reveal the page with the entries
    loggedInDom.style.display = ""

  })
});

//// LOG IN SECTION ///

signupLink.addEventListener('click', (e)=>{
  e.preventDefault()
  signUpDom.style.display = ""
  logInDom.style.display = "none"
})

logInLink.addEventListener('click', (e)=>{
  e.preventDefault()
  signUpDom.style.display = "none"
  logInDom.style.display = ""
} )


loginForm.addEventListener('submit', (e)=>{
  e.preventDefault()

  const getLoggedUser = {
    username: loginForm['log-in-username'].value,
    password: loginForm['log-in-password'].value
  }

  const userConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(getLoggedUser)
  }

  const logInOrNot = (user) =>{
    if (JSON.stringify(user) == "{}"){
      console.log("incorrect password try again")
    } else {
      // console.log("correct password", user)
      currentLoggedInUserId = user.id

      //function to log in with user id argument
      logIn(currentLoggedInUserId)

      // hide log in form
      logInDom.style.display = "none"

      // reveal main content after logging in
      loggedInDom.style.display = ""
    }
  }

  fetch(`${url}logs`, userConfig)
  .then(r=>r.json())
  .then(logInOrNot)

})


///// LOG OUT SECTION ///

logoutLink.addEventListener('click', (e)=>{
  e.preventDefault()

  // removing previously logged in user info from DOM
  const cardbodyH5 = document.querySelector('.card-body').querySelector('h5')
  const cardbodyP = document.querySelector('.card-body').querySelector('p')
  cardbodyH5.innerText = ""
  cardbodyP.innerText = ""
  userInfoContainer.innerText = ""
  myEntriesDiv.innerText = ""

  // entriesLink.removeChild(myEntriesDiv)

  publicLinks.innerText = ""



  // hide log in form
  logInDom.style.display = ""
  currentLoggedInUserId = ""

  console.log(currentLoggedInUserId)
  // reveal main content after logging in
  // loggedInDom.textContent = ""
  // debugger
  loggedInDom.style.display = "none"
})


// logIn();
