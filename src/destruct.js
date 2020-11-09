var obj = {
  status: "approved",
  headers: "dfdfdaf",
  body: {
    data: [1, 2],
  },
};

let {
    body: {
      data: [two],
    },
  } = obj;

function grab2({body: {data: [,two]}}) {
  return two;
}

console.log(grab2(obj));
