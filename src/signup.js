let url = "http://localhost:3000/api/v1/";

let signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let [
    name,
    username,
    age,
    password,
    confirmPass,
  ] = signupForm.querySelectorAll(".val");
  let opts = {
    name: name.value,
    age: age.value,
    username: username.value,
    password: password.value,
    password_confirmation: confirmPass.value
  }

  let post = await fetch(`${url}users`, {
    method: "post",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(opts),
  });

  let data = await post.json();
  console.log(data);
});

async function createNewUser() {}
