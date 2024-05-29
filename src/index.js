import "./styles.scss";

// Or if installed from NPM to use with a bundler
import Artyom from "artyom.js";
// const artyom = require("artyom.js");
const artyom = new Artyom();

function isgetReplyAvailable() {
  return typeof getReply !== "undefined" && typeof getReply === "function";
}

if (isgetReplyAvailable()) {
  let command;
  let timeoutId;
  let setIntervalTimer;

  const button = document.querySelector("button");
  button.addEventListener("click", () => {
    button.innerHTML = "Talk now 🙂";
    setIntervalTimer = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * 6) + 2;
      if (randomNumber % 2 === 0) {
        button.innerHTML = "Talk now 😮";
      } else {
        button.innerHTML = "Talk now 🙂";
      }
    }, 100);
    clearTimeout(timeoutId);

    command = "";
    timeoutId = setTimeout(() => {
      clearInterval(setIntervalTimer);
      const response = getReply(command);

      artyom.say(response);

      button.innerHTML = "Give a new command";
    }, 5000);
  });

  var UserDictation = artyom.newDictation({
    continuous: false, // Enable continuous if HTTPS connection
    onResult: function (text) {
      // Do something with the text
      if (text.length > command.length) {
        command = text;
        console.log(command);
      }
    },
    onStart: function () {
      console.log("Dictations started by the users");
    },
    onEnd: function () {
      console.log("Dictation stopped by the user");
    },
  });

  UserDictation.start();
} else {
  alert("add the getReply function!");
}

// DATA

let nameOfUser = "Vasya";
const todo = [];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
};

// LOGIC

function getReply(command) {
  if (command.startsWith("Hello my name is")) {
    if (nameOfUser) {
      return `You have already introduced as ${nameOfUser}`;
    } else {
      const arr = command.split(" ");
      nameOfUser = arr.splice(arr.length - 1, 1)[0];
    }

    return `Nice to meet you ${nameOfUser}`;
  }

  if (command === "What is my name") {
    if (nameOfUser) {
      return `Your name is ${nameOfUser}`;
    } else {
      return "I do not know your name";
    }
  }

  if (command.startsWith("Add") && command.endsWith("to my todo")) {
    let task = command.slice(4, -11);
    todo.push(task);
    return `${task} added to your todo`;
  }

  if (command.startsWith("Remove") && command.endsWith("from my todo")) {
    if (todo.length === 0) {
      return "Your todo is empty";
    }

    let task = command.slice(7, -13);
    let indexToRemove = todo.indexOf(task);

    if (indexToRemove !== -1) {
      todo.splice(indexToRemove, 1);
      return `Removed ${task} from your todo`;
    } else {
      return `${task} is not in your todo`;
    }
  }

  if (command === "What is on my todo?") {
    // if (todo.length === 0) {
    //   return "Your todo is empty";
    // }

    return `You have ${todo.length} todos - ${todo.join(", ")}`;
  }

  if (command === "What day is it today?") {
    const todayDate = new Date();
    const day = todayDate.getDate();
    const month = monthNames[todayDate.getMonth()];
    const year = todayDate.getFullYear();

    return `${day}. of ${month} ${year}`;
  }

  if (
    command.includes("/") ||
    command.includes("*") ||
    command.includes("-") ||
    command.includes("+")
  ) {
    const keys = Object.keys(operators);
    let indexOfOperator;
    let pickedOperator;

    for (const key of keys) {
      if (command.includes(key)) {
        pickedOperator = key;
        indexOfOperator = command.indexOf(pickedOperator);
        break;
      }
    }

    let num1 = "";
    let num2 = "";

    // Find num1
    for (let i = indexOfOperator - 1; i >= 0; i--) {
      if (!isNaN(command[i])) {
        num1 = command[i] + num1;
      } else {
        break;
      }
    }
    num1 = parseInt(num1);

    // Find num2
    for (let i = indexOfOperator + 1; i < command.length; i++) {
      if (!isNaN(command[i])) {
        num2 += command[i];
      } else {
        break;
      }
    }
    num2 = parseInt(num2);

    console.log("Operand 1:", num1);
    console.log("Operand 2:", num2);

    const result = operators[pickedOperator](num1, num2);

    return result;
  }

  if (command.startsWith("Set a timer for")) {
    function setTimer(duration) {
      setTimeout(() => {
        console.log("Timer done");
      }, duration);
    }

    const minutesIndex = command.indexOf("minutes");
    if (minutesIndex !== -1) {
      const durationStr = command.substring(16, minutesIndex);
      const duration = parseInt(durationStr);
      if (!isNaN(duration)) {
        const milliseconds = duration * 60 * 1000; // Convert minutes to milliseconds
        setTimer(milliseconds);
        return `Timer set for ${duration} minutes`;
      }
    }
    return "Invalid timer command. Please use the format: 'Set a timer for X minutes'";
  }
}

// RENDER

console.log(getReply("The last dancer"));
console.log(getReply("Hello my name is Kazhe"));
console.log(getReply("Add fishing to my todo"));
console.log(getReply("Add singing in the shower to my todo"));
console.log(getReply("Add cleaning to my todo"));
console.log(getReply("Remove cleaning from my todo"));
console.log(getReply("What is on my todo?"));
console.log(getReply("What day is it today?"));
console.log(getReply("What is 8 / 4"));
console.log(getReply("Set a timer for 2 minutes"));
