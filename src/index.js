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




///event listener for buttons on user's entry

const thisUserEntry = (user_id) => {
  const hrTag = document.querySelector('.line')
  if (currentLoggedInUserId == user_id){
    const div = document.createElement('div')
      div.classList.add('node', 'user-btns')
      div.innerHTML = `<a href="#" class="btn btn-primary node make-public">Go Public</a>
      <a href="#" class="btn btn-secondary node edit-post">Edit Post</a>
      <a href="#" class="btn btn-danger node delete-post">Delete Post</a>`
    hrTag.insertBefore(div)
  }
}

// loads new post on THIS page when a different post is clicked
async function renderEntry({ title, description, id, user_id }) {
  let { username, name } = await fetchUser(user_id);
  let comments = await fetchEntriesComments(id);
  entryContainer.dataset.entryId = id
  entryContainer.dataset.userId = user_id
  let [titleNode, text, buttons] = entryContainer
    .querySelector(".card-body")
    .querySelectorAll(".node");
  titleNode.innerText = `${title}: By ${name} Follow ${username}`;
  text.innerText = description;
  //button add event to go public / edit post / delete post
  /// function name here ///
  thisUserEntry(user_id)

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

  }).then(saveUserSession)

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


    return user
    }
  }

   fetch(`${url}logs`, userConfig)
   .then(r=>r.json())
   .then(logInOrNot)
   .then(saveUserSession)

 })


///// LOG OUT SECTION ///

logoutLink.addEventListener('click', (e)=>{
  e.preventDefault()

  // removing previously logged in user info from DOM
  const cardbodyH5 = entryContainer.querySelector('h5')
  const cardbodyP = entryContainer.querySelector('p')
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

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}


/////// CREATE A POST SECTION!!! //////

// Variables

const addPostBtn = document.querySelector('.add-post')
const entryCard = document.querySelector('#entry-container')
const postFormDiv = document.querySelector('.myForm')
const postForm = postFormDiv.querySelector('form')

// event listener on add post btn to open a form for new post
addPostBtn.addEventListener('click', (e)=>{
  e.preventDefault()

  if (addPostBtn.innerText == "Cancel"){
    addPostBtn.innerText = "Add New Post"
    entryCard.style.display = ""
    postFormDiv.style.display = "none"
    console.log("entry shown again and button should go back to normal")
  } else {
    addPostBtn.innerText = "Cancel"
    entryCard.style.display = "none"
    postFormDiv.style.display = ""
    console.log("display form here and post button name change")

  }
})


// new entry functions to slap to DOM with event listeners
const newEntryFunc = (newEntry) => {
  //initial render entry after submitting form
  renderEntry(newEntry)
  const newEntryTitle = newEntry.title

  // append as p tag to MY post list
    // if no div section in my entriesLink create one and add it
  const newEntryTitleP = createP(newEntryTitle)

  myEntriesDiv.append(newEntryTitleP)

  //listener for new entry added to render form when clicked later
  newEntryTitleP.addEventListener("click", () => {
    renderEntry(newEntry);
  });

  //append as li to ALL post list
  const otherLinksUl = publicLinks.querySelector('ul')
  const link = createLi(newEntryTitle);
  link.addEventListener("click", () => renderEntry(newEntry))
  otherLinksUl.append(link)

  //hide post form and reset contents if successful
  postForm.reset()
  addPostBtn.innerText = "Add New Post"
  entryCard.style.display = ""
  postFormDiv.style.display = "none"
  console.log("entry shown again and button should go back to normal")
}


// event listener for submitting new post
postForm.addEventListener('submit', (e)=>{
  e.preventDefault()

  const postTitle = postForm['post-title'].value
  const postDesc = postForm['post-desc'].value
  const thisUser = currentLoggedInUserId
  const publicPost = postForm.public.checked

  
  const newPostObj = {
    title: postTitle,
    description: postDesc,
    user_id: thisUser,
    public: publicPost
  }
  
  const newPostConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(newPostObj)
  }
  
  fetch(`${url}entries`, newPostConfig)
  .then(r=>r.json())
  .then(newEntryFunc)

  // debugger
})


///// EDITING POST SECTION /////

//find edit post button a-tag
const editPostBtn = document.querySelector('.edit-post')

//event listener for btn
// editPostBtn.addEventListener('click', (e)=>{
//   e.preventDefault()
//   console.log("edit post button clicked")
// })

  //making sure this post is mine (post title comes with entryId and userId) (if currentUserId == userId)



/////// END ///////





//////// DELETING POST SECTION ///////
const deletePostBtn = document.querySelector('.delete-post')

// //event listener for btn
// deletePostBtn.addEventListener('click', (e)=>{
//   e.preventDefault()
//   console.log("delete post button clicked")
// })


function saveUserSession({id}) {
       sessionStorage.setItem('user_id', id)
}
//// END //////

function logIn(id) {
    // reveal main content after logging in
    loggedInDom.style.display = "" //visible
    console.log(id)
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


function init() {
    let id = sessionStorage.getItem('user_id')
    if(id) {
        signupForm.style.display = 'none'
        loginForm.style.display = 'none'
        logInDom.style.display = "none"
        signUpDom.style.display = "none"
        logIn(id)
    }
}

init()