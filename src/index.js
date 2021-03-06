let url = "http://localhost:3000/api/v1/";
let mainContainer = document.getElementById("main-container");
let entryContainer = document.getElementById("entry-container");
let userInfoContainer = document.getElementById("user-info-container");
let entriesLink = document.getElementById("entries-link");
let publicLinks = document.getElementById("other-links");
let commentList = document.getElementById("comment-list");
let commentForm = document.getElementById("comment-form");
let myEntriesDiv = document.createElement("div"); // maybe not needed
let headers = {
  headers: { "content-type": "application/json", accept: "application/json" },
};

let config = {
  method: "POST",
  ...headers,
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
  userInfoContainer.innerText = "";
  let userName = createH1(`${data.username}`);
    userName.classList.add('alignleft')
  let name = createH2(`Hello, ${data.name}! 🌛`);
    name.classList.add('alignright')
  // let age = createH2(`Age: ${data.age}`);
  //   age.classList.add('alignright')
  userInfoContainer.append(userName, name);
  // console.log(data.entries);
  if (data.entries.length > 0) renderEntry(data.entries[0]); 
  else { 
    entryCard.style.display = "none";
    postFormDiv.style.display = "";
    document.querySelector(".add-post").innerText = 'Cancel'
  }
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

// const makePublicFetch = (entryIdNum) => {

//   debugger

//   if (entryIdNum == entryContainer.dataset.entryId){

//     const makePublicConfig = {
//       method: "PATCH",
//       ...headers,
//       body: JSON.stringify({ public: "true" }),
//     };
//     fetch(`${url}entries/${entryIdNum}`, makePublicConfig)
//       .then((r) => r.json())
//       .then(console.log);

//   }
// };

const renderUpdatedEntry = (newEntry) => {
  ///find title links and change name OR delete previous title links

  // const myEntryDiv = document.getElementById('entries-link').querySelector('div')
  const myEntryTag = entriesLink.querySelector(
    `li[data-entry-id-num="${newEntry.id}"]`
  );

  // debugger

  renderEntry(newEntry);

  myEntryTag.innerText = newEntry.title;
  myEntryTag.addEventListener("click", () => {
    renderEntry(newEntry);
  });

  //append as li to ALL post list
  const myPublicEntryTag = publicLinks.querySelector(
    `li[data-entry-id-num="${newEntry.id}"]`
  );

  if (newEntry.public) {
    if (myPublicEntryTag) {
      myPublicEntryTag.innerText = newEntry.title;
      myPublicEntryTag.addEventListener("click", () => {
        renderEntry(newEntry);
      });
    } else {
      console.log("public", "doesnt exist");
      const otherLinksUl = publicLinks.querySelector("ul");
      const link = createLi(newEntry.title);
      link.classList.add("list-group-item");
      link.dataset.entryIdNum = newEntry.id;

      link.addEventListener("click", () => renderEntry(newEntry));
      otherLinksUl.append(link);
    }
  } else {
    if (myPublicEntryTag){
      myPublicEntryTag.remove();
    }
  }
};

const fetchPatchPost = (id) => {
  if (postForm["post-title"].value == "") return;

  const updatedEntryBody = {
    title: postForm["post-title"].value,
    description: postForm["post-desc"].value,
    public: postForm.public.checked,
  };

  const entryConfig = {
    method: "PATCH",
    ...headers,
    body: JSON.stringify(updatedEntryBody),
  };
  fetch(`${url}entries/${id}`, entryConfig)
    .then((r) => r.json())
    .then(renderUpdatedEntry);

  postForm.reset();
  postFormDiv.style.display = "none"
  postFormDiv.querySelector("h1").style.display = "";
  entryCard.style.display = "";
  updateBtn.style.display = "none";
  deleteBtn.style.display = "none"
  newPostBtn.style.display = "";
};

async function fetchEntry(id) {
  let response = await fetch(`${url}/entries/${id}`);
  let data = await response.json();
  return data;
}

const fetchDeletePost = (id) =>{

  const nodes = document.querySelectorAll(`[data-entry-id-num="${id}"]`)
  if (nodes.length > 0){

    nodes.forEach(node=>{
      node.remove()})

  
    // debugger
  
    fetch(`${url}entries/${id}`,{method: 'DELETE'})
    .then(r=>r.json())
    .then(nothing=>{
      entryCard.style.display = ""
      entryCard.classList.add('deleted')
      entryCard.querySelector('textarea').classList.add('deleted')
      commentList.classList.add('deleted')
      postForm.reset()
      postFormDiv.querySelector('h1').style.display = ""
      postFormDiv.style.display = "none";
      newPostBtn.style.display = ""
      updateBtn.style.display = "none"
      cancelUpBtn.style.display = "none"
      deleteBtn.style.display = "none"
      editPostBtn.style.display = "none";
      commentForm.querySelector('button').disabled = true;
      
    })

  }
  

}


const updatePost = async (id)=>{
  // debugger
    let entry = await fetchEntry(id)
    //hide entry container
    entryCard.style.display = "none";
    //display post form
    postFormDiv.querySelector('h1').style.display = "none"
    postFormDiv.style.display = "";
    postForm["post-title"].value = entry.title
    postForm["post-desc"].value = entry.description
    postForm.public.checked = entry.public

    // const updateBtn = postForm.querySelector('.update-btn')
    // const newPostBtn = postForm.querySelector('.new-post-btn')
    newPostBtn.style.display = "none"
    updateBtn.style.display = ""
    cancelUpBtn.style.display = ""
    deleteBtn.style.display = ""

    updateBtn.addEventListener('click', (e)=>{
      e.preventDefault()
      if (entryContainer.dataset.entryId == entry.id){
        fetchPatchPost(entry.id)
      }
    })

    cancelUpBtn.addEventListener('click', (e)=>{
      e.preventDefault()
      entryCard.style.display = ""
      postForm.reset()
      postFormDiv.querySelector('h1').style.display = ""
      postFormDiv.style.display = "none";
      newPostBtn.style.display = ""
      updateBtn.style.display = "none"
      cancelUpBtn.style.display = "none"
      deleteBtn.style.display = "none"

    })

    deleteBtn.addEventListener('click', (e)=>{
      e.preventDefault()
      if (entryContainer.dataset.entryId == entry.id){
        //delete function
        fetchDeletePost(entry.id)
      }

    })
}

///event listener conditionals for buttons on user's entry
const userBtnEvents = (userBtns, id, user_id) => {
  userBtns.addEventListener("click", (e) => {
    if (
      user_id == sessionStorage.getItem("user_id") &&
      id == entryContainer.dataset.entryId
    ) {
      const entryIdNum = id;
      // debugger
      e.preventDefault();
      if (e.target.matches(".edit-post")) {
        console.log("edit post clicked");
        updatePost(id);
        ///edit post patch fetch request function /// delete post function
      }
    }
  });
};

//button showing conditional statement
const thisUserEntry = (user_id, id) => {
  const userBtns = document.querySelector(".user-btns");
  if (sessionStorage.getItem("user_id") == user_id) {
    userBtns.style.display = "";
    userBtnEvents(userBtns, id, user_id);
  } else {
    userBtns.style.display = "none";
  }
};

// loads new post on THIS page when a different post is clicked
async function renderEntry({ title, description, id, user_id }) {
  if (entryCard.classList.contains('deleted')){
    entryCard.classList.remove('deleted')
    entryCard.querySelector('textarea').classList.remove('deleted')
    commentList.classList.remove('deleted')
    editPostBtn.style.display = "";
    commentForm.querySelector('button').disabled = false;
  }

  let { username, name } = await fetchUser(user_id);
  let comments = await fetchEntriesComments(id);
  entryContainer.dataset.entryId = id;
  entryContainer.dataset.userId = user_id;
  let [titleNode, text, buttons] = entryContainer
    .querySelector(".card-body")
    .querySelectorAll(".node");
  titleNode.innerHTML = `${title} <br>By: ${username}`;
  text.innerText = description;
  //button add event to go public / edit post / delete post
  /// function name here ///
  thisUserEntry(user_id, id);
  // debugger

  //create data set for entry - override
  if (comments) renderComments(comments);
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
  myPosts.textContent = "My Dreams 💤💤💤";
  const linksUl = document.createElement("ul");
  linksUl.classList.add("list-group");
  entries.forEach((entry) => {
    let entryLink = createLi(entry.title);
    entryLink.classList.add("list-group-item");
    entryLink.dataset.entryIdNum = entry.id;
    entryLink.addEventListener("click", () => {
      renderEntry(entry);
    });
    linksUl.append(entryLink);
  });
  console.log;
  entriesLink.append(myPosts, linksUl);
}

function renderComments(comments) {
  commentList.innerText = "";
  comments.forEach(renderComment);
}

const deleteCommentFetch = (id) =>{

  const commentNode = commentList.querySelector(`[data-comment-id="${id}"]`)
  const commentP = commentNode.nextSibling
  // debugger


  fetch(`${url}comments/${id}`,{method: 'DELETE'})
  .then(r=>r.json())
  .then(nothing=>{
    console.log(nothing)
    commentNode.remove()
    commentP.remove()
  })

}



async function renderComment({ comment, user_id, id }) {
  let { username, name } = await fetchUser(user_id);
  let user_name = createP(`${username}`);
  let commentNode = createLi(comment);
  commentNode.classList.add("list-group-item");
  if (sessionStorage.getItem("user_id") == user_id) {
    commentNode.dataset.commentId = id;
    const deleteCommentBtn = createButton("delete")
    deleteCommentBtn.classList.add('myDeleteButton')
    //delete comment function
    commentNode.append(deleteCommentBtn)
    deleteCommentBtn.addEventListener('click', (e)=>{
      e.preventDefault()
      // console.log("this is comment", e.target.parentNode, id)
      deleteCommentFetch(id)
    })
  }
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
  //renderPublicEntriesLinks
  publicLinks.innerText = "";
  const explore = document.createElement("h5");
  explore.textContent = "Explore Public Post!";
  const otherLinksUl = document.createElement("ul");
  otherLinksUl.classList.add("list-group");
  // otherLinksUl.textContent = "Post by Other Users";
  entries.filter(filterPrivatePost).forEach((entry) => {
    const link = createLi(entry.title);

    link.classList.add("list-group-item");

    if (sessionStorage.getItem("user_id") == entry.user_id) {
      link.dataset.entryIdNum = entry.id;
    }

    link.addEventListener("click", () => renderEntry(entry));
    otherLinksUl.append(link);
  });
  publicLinks.append(explore, otherLinksUl);
};

const filterPrivatePost = ({ public, user_id }) => public == true; // && user_id != sessionStorage.getItem('user_id')

const addComment = ({ id }) => {
  // debugger
  commentForm.addEventListener("submit", async (e) => {
    if (id == sessionStorage.getItem("user_id")) {
      // debugger
      // query for data set connected to current entry
      e.preventDefault();

      const entryConID = parseInt(entryContainer.dataset.entryId);
      let post = await fetch(`${url}comments`, {
        ...config,
        body: JSON.stringify({
          comment: document.getElementById("comment").value,
          user_id: id,
          entry_id: entryConID,
        }),
      });
      let data = await post.json();
      // debugger
      console.log(data);
      renderComment({
        comment: document.getElementById("comment").value,
        user_id: id,
        id: data.id
      });
    }
    commentForm.reset()
  });
};

function returnUser(user) {
  return user;
}

/// LOG IN + SIGN UP + LOG OUT VARIABLES ///
const logInLink = document.querySelector(".login-link");
const logInDom = document.querySelector(".login-options");
const signupLink = logInDom.querySelector(".signup-link");
const loginForm = logInDom.querySelector("form");
const logoutLink = document.querySelector(".logout");

/////// SIGNUP SECTION //////

// let sessionStorage.getItem('user_id');
const signUpDom = document.querySelector(".sign-up-options");
const loggedInDom = document.querySelector(".logged-in-options");
loggedInDom.style.display = "none";

let signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // user body from signup form
  const userObj = {
    name: signupForm.InputName.value,
    username: signupForm.InputUserName.value,
    age: signupForm.InputAge.value,
    password: signupForm.InputPassword.value,
  };

  const userObjConfig = {
    ...config,
    body: JSON.stringify(userObj),
  };

  fetch(`${url}users`, userObjConfig)
    .then((r) => r.json())
    .then((newUser) => {
      // sessionStorage.getItem('user_id') = newUser.id
      signUpDom.style.display = "none";
      // debugger
      // render your first entry (if you ha)
      console.log(newUser);
      logIn(newUser.id);
      saveUserSession(newUser);
    });
});

//// LOG IN SECTION ///

signupLink.addEventListener("click", (e) => {
  e.preventDefault();
  signUpDom.style.display = "";
  logInDom.style.display = "none";
});

logInLink.addEventListener("click", (e) => {
  e.preventDefault();
  signUpDom.style.display = "none";
  logInDom.style.display = "";
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const getLoggedUser = {
    username: loginForm["log-in-username"].value,
    password: loginForm["log-in-password"].value,
  };

  const userConfig = {
    ...config,
    body: JSON.stringify(getLoggedUser),
  };

  const logInOrNot = (user) => {
    if (JSON.stringify(user) == "{}") {
      console.log("incorrect password try again");
    } else {
      // console.log("correct password", user)
      // sessionStorage.getItem('user_id') = user.id

      //function to log in with user id argument
      logIn(user.id);

      // hide log in form
      logInDom.style.display = "none";

      return user;
    }
  };

  fetch(`${url}logs`, userConfig)
    .then((r) => r.json())
    .then(logInOrNot)
    .then(saveUserSession);
});

///// LOG OUT SECTION ///

logoutLink.addEventListener("click", (e) => {
  // debugger
  e.preventDefault();

  // removing previously logged in user info from DOM
  const cardbodyH5 = entryContainer.querySelector("h5");
  const cardbodyP = entryContainer.querySelector("p");
  cardbodyH5.innerText = "";
  cardbodyP.innerText = "";
  userInfoContainer.innerText = "";
  entriesLink.querySelector('ul').remove();
  entriesLink.querySelector('h3').remove();

  // entriesLink.removeChild(myEntriesDiv)

  publicLinks.innerText = "";
  sessionStorage.removeItem("user_id");

  // reveal main content after logging in
  // loggedInDom.textContent = ""
  // debugger
  loggedInDom.style.display = "none";
  logInDom.style.display = "none";
  // debugger
  signUpDom.style.display = "";

  entryCard.style.display = "";
  postFormDiv.style.display = "none";
  // document.querySelector(".add-post").innerText = 'Cancel'
});

// function openForm() {
//   document.getElementById("myForm").style.display = "block";
// }

// function closeForm() {
//   document.getElementById("myForm").style.display = "none";
// }

/////// CREATE A POST SECTION!!! //////

// Variables

const addPostBtn = document.querySelector(".add-post");
const entryCard = document.querySelector("#entry-container");
const postFormDiv = document.querySelector(".myForm");
const postForm = postFormDiv.querySelector("form");
const updateBtn = postForm.querySelector('.update-btn')
const cancelUpBtn = postForm.querySelector('.cancel-update-btn')
const deleteBtn = postForm.querySelector('.delete-post-btn')
const newPostBtn = postForm.querySelector('.new-post-btn')

// event listener on add post btn to open a form for new post
addPostBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (addPostBtn.innerText == "Cancel") {
    addPostBtn.innerText = "Add New Post";
    entryCard.style.display = "";
    postFormDiv.style.display = "none";
    console.log("entry shown again and button should go back to normal");
  } else {
    addPostBtn.innerText = "Cancel";
    entryCard.style.display = "none";
    postFormDiv.style.display = "";
    console.log("display form here and post button name change");
  }
});

// new entry functions to slap to DOM with event listeners
const newEntryFunc = (newEntry) => {
  //initial render entry after submitting form
  renderEntry(newEntry);

  // append as p tag to MY post list
  // if no div section in my entriesLink create one and add it
  const newEntryTitle = createLi(newEntry.title);
  newEntryTitle.classList.add("list-group-item");
  newEntryTitle.dataset.entryIdNum = newEntry.id
  const entriesUl = entriesLink.querySelector("ul");
  if (entriesUl) {
    entriesLink.querySelector("ul").append(newEntryTitle);
  } else {
    const ul = document.createElement("ul");
    ul.append(newEntryTitle)
    entriesLink.append(ul)
  }
  //listener for new entry added to render form when clicked later

  newEntryTitle.addEventListener("click", () => {
    renderEntry(newEntry);
  }); // generalize to function

  //append as li to ALL post list
  if (newEntry.public) {
    const otherLinksUl = publicLinks.querySelector("ul");
    const link = createLi(newEntry.title);
    link.classList.add("list-group-item");
    link.dataset.entryIdNum = newEntry.id
    link.addEventListener("click", () => renderEntry(newEntry));
    otherLinksUl.append(link);
  }

  //hide post form and reset contents if successful
  postForm.reset();
  addPostBtn.innerText = "Add New Post";
  entryCard.style.display = "";
  postFormDiv.style.display = "none";
  console.log("entry shown again and button should go back to normal");
};

// event listener for submitting new post
postForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const postTitle = postForm["post-title"].value;
  const postDesc = postForm["post-desc"].value;
  const thisUser = sessionStorage.getItem("user_id");
  const publicPost = postForm.public.checked;

  const newPostObj = {
    title: postTitle,
    description: postDesc,
    user_id: thisUser,
    public: publicPost,
  };

  const newPostConfig = {
    ...config,
    body: JSON.stringify(newPostObj),
  };

  fetch(`${url}entries`, newPostConfig)
    .then((r) => r.json())
    .then(newEntryFunc);

  // debugger
});

///// EDITING POST SECTION /////

//find edit post button a-tag
const editPostBtn = document.querySelector(".edit-post");

//event listener for btn
// editPostBtn.addEventListener('click', (e)=>{
//   e.preventDefault()
//   console.log("edit post button clicked")
// })

//making sure this post is mine (post title comes with entryId and userId) (if currentUserId == userId)

/////// END ///////

//////// DELETING POST SECTION ///////
const deletePostBtn = document.querySelector(".delete-post");

// //event listener for btn
// deletePostBtn.addEventListener('click', (e)=>{
//   e.preventDefault()
//   console.log("delete post button clicked")
// })

function saveUserSession({ id }) {
  sessionStorage.setItem("user_id", id);
}
//// END //////

function logIn(id) {
  // reveal main content after logging in
  loggedInDom.style.display = ""; //visible
  // console.log(id);
  fetch(`${url}/users/${id}`)
    .then((r) => r.json())
    .then((data) => {
      // commentForm.removeEventListener('submit', ()=>{})
      renderUser(data);
      renderEntriesLinks(data);
      fetchAllEntries(appendLinksToPage);
      addComment(data);
    });
  return;
}

function init() {
  let id = sessionStorage.getItem("user_id");
  if (id) {
    // signupDom.style.display = 'none'
    logInDom.style.display = "none";
    signUpDom.style.display = "none";
    logIn(id);
  }
}

init();
