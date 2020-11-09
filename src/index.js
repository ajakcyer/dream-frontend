let url = "http://localhost:3000/api/v1/";
let mainContainer = document.getElementById("main-container");
let entryContainer = document.getElementById("entry-container");
let userInfoContainer = document.getElementById("user-info-container");
let entriesLink = document.getElementById("entries-link");

const createElements = (element) => (string) => {
  let node = document.createElement(element);
  node.innerText = string;
  return node;
};

const createH1 = createElements("h1");
const createH2 = createElements("h2");
const createH3 = createElements("h3");
const createButton = createElements("button");
const createP = createElements("p");
const createLi = createElements("li");

async function getEntryData() {
  let response = await fetch(`${url}/users/1`);

  let data = await response.json();

  renderUser(data);
  renderEntriesLinks(data);
}

function renderUser(data) {
  let userName = createH1(data.username);
  let name = createH2(data.name);
  let age = createH2(data.age);
  userInfoContainer.append(userName, name, age);
  renderEntry(data.entries[0]);
}

async function fetchEntriesComments(id) {
  let response = await fetch(`${url}/entries/${id}`);
  let data = await response.json();
  return data.comments;
}

async function renderEntry({ description, id }) {
  entryContainer.innerHTML = ""
  let comments = await fetchEntriesComments(id);
  console.log(comments)
  let div = document.createElement("div");
  let title = createH3("Title");
  let dreamDesc = createP(description);
  let commentNode = renderComments(comments);
  div.append(title, dreamDesc, commentNode);
  entryContainer.append(div);
}

function renderEntriesLinks({ entries }) {
  entries.forEach((entry) => {
    let entryButton = createButton("My Title");
    entryButton.addEventListener("click", () => {
      renderEntry(entry);
    });
    entriesLink.appendChild(entryButton);
  });
}
function renderComments(comments) {
  let commentList = document.createElement("ul");
  comments.forEach(({ comment }) => {
    let commentNode = createLi(comment);
    commentList.append(commentNode);
  });
  return commentList;
}
getEntryData();
