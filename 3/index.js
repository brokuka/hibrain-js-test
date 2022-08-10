const form = document.getElementById("form");
const input = document.getElementById("input");
const button = document.querySelector("button");
const winNum = "56478";

let maxTries = 3;
let tries = 0;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!input.value) return;

  let valuesp = input.value.split("");
  let correctNum = [];
  let incorrectNum = [];

  if (tries <= maxTries) {
    tries++;

    valuesp.map((num, index) => {
      if (index === winNum.indexOf(num)) return correctNum.push(num);

      return winNum.includes(num) && incorrectNum.push(num);
    });
  }

  if (tries >= maxTries) {
    alert("Ваши попытки закончились, обновите страничку :(");
    button.disabled = true;
    input.disabled = true;
  }

  if (valuesp.join("") === winNum) {
    button.disabled = true;
    return console.log("You win!");
  }

  return console.log(
    `совпавших цифр не на своих местах - ${
      incorrectNum.length
    } (${incorrectNum.join(", ")}), цифр на своих местах - ${
      correctNum.length
    } (${correctNum.join(", ")})`
  );
});
