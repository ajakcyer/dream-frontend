let url = "http://localhost:3000/api/v1/";

let signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

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
  .then(console.log)

});

// async function createNewUser() {}
