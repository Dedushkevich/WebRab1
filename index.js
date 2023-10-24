const $list = document.querySelector(".list");
const $counter = document.querySelector(".sub-title");
const $input = document.querySelector(".searchbar");

if (!localStorage.getItem("pokemons")) {
  await fetch("https://pokeapi.co/api/v2/pokemon")
    .then((r) => r.json())
    .then((data) => {
      localStorage.setItem("pokemons", JSON.stringify(data.results));
    });
}

const pokemons = JSON.parse(localStorage.getItem("pokemons"));

$list.innerHTML = makeHtmll(pokemons);

$counter.textContent = `${pokemons.length} users`;

$input.addEventListener("input", (e) => {
  const filteredList = filter(pokemons, e.target.value.trim());

  if (filteredList.length === 0) {
    $list.innerHTML = "ERROR";
    $counter.textContent = `0 users`;
    return;
  }

  $list.innerHTML = makeHtmll(filteredList);

  $counter.textContent = `${filteredList.length} users`;
});

$list.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn")) {
    const currentBtn = e.target.getAttribute("id");

    const index = pokemons.findIndex((el) => el.url === currentBtn);

    pokemons.splice(index, 1);

    localStorage.setItem("pokemons", JSON.stringify(pokemons));

    $list.innerHTML = makeHtmll(filter(pokemons, $input.value));

    $counter.textContent = `${filter(pokemons, $input.value).length} user`;
  }

  if (e.target.classList.contains("table-title")) {
    $input.value = e.target.textContent;
    $list.innerHTML = makeHtmll(filter(pokemons, $input.value));
  }

  if (pokemons.length === 0) {
    localStorage.removeItem("pokemons");
  }
});

function filter(pokemons, value) {
  return pokemons.filter((el) => el.name.includes(value.toLowerCase()));
}

function makeHtmll(data) {
  return data
    .map(
      (el) =>
        `<tr class="table-row"><td class="table-title">${el.name}</td><td>${el.url}</td><td><button id="${el.url}" class="btn">Delete</button></td></tr>`
    )
    .join("");
}
