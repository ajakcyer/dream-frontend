let url = "http://localhost:3000/api/v1/";
let mainContainer = document.getElementById("main-container");
let entryContainer = document.getElementById("entry-container");
let userInfoContainer = document.getElementById("user-info-container");
let entriesLink = document.getElementById("entries-link");
let publicLinks = document.getElementById("other-links");
let commentList = document.getElementById("comment-list");
let commentForm = document.getElementById("comment-form");
let config = {
  method: "post",
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
  let userName = createH1(data.username);
  let name = createH2(data.name);
  let age = createH2(`Age: ${data.age}`);
  userInfoContainer.append(userName, name, age);
  console.log(data.entries);
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
  const myPosts = document.createElement("h3");
  myPosts.textContent = "My Posts";
  entriesLink.append(myPosts);
  entries.forEach((entry) => {
    let entryButton = createP(entry.title);
    entryButton.addEventListener("click", () => {
      renderEntry(entry);
    });
    entriesLink.appendChild(entryButton);
  });
}

function renderComments(comments) {
  commentList.innerHTML = "";
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
  const otherLinksUl = document.createElement("ul");
  // otherLinksUl.textContent = "Post by Other Users";
  entries.forEach((entry) => {
    const link = createLi(entry.title);
    link.addEventListener("click", () => renderEntry(entry));
    otherLinksUl.append(link);
  });
  publicLinks.append(otherLinksUl);
};

const addComment = ({ id }) => {
  commentForm.addEventListener("submit", async (e) => {
      // query for data set connected to current entry
    e.preventDefault();
    // let post = fetch(`${url}comments`, {config, body: JSON.stringify({comment: document.getElementById('comment').value, user_id: id})});
    renderComment({
      comment: document.getElementById("comment").value,
      user_id: id,
    });
  });
};

async function logIn() {
  let response = await fetch(`${url}/users/2`);
  let data = await response.json();
  currentUser = returnUser(data);
  renderUser(data);
  renderEntriesLinks(data);
  fetchAllEntries(appendLinksToPage);
  addComment(data);
}

function returnUser(user) {
  return user;
}

logIn();
