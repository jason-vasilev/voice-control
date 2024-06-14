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
// trainee code starts from here

//Link to my codeSandbox with artyom.js: https://codesandbox.io/p/sandbox/talk-to-your-computer-forked-kdy5y8?file=%2Fsrc%2Findex.js%3A208%2C11

//Data
const user = { name: null, todo: [], activeTimerId: null };

//helper functions
function isValidMathExpression(expression) {
  const validCharacters = "0123456789+-*/ ";
  for (let char of expression) {
    if (!validCharacters.includes(char)) {
      return false;
    }
  }
  return true;
}

const capitalizeFirstLetter = (string) =>
  `${string.charAt(0).toUpperCase()}${string.slice(1)}`; //benjamin -> Benjamin

//functions that extract data
const getName = (sentence) => {
  const userName = sentence.split("hello my name is ")[1]; //['', 'name']
  return capitalizeFirstLetter(userName);
};

function getActivity(sentence, isAdding = true) {
  //extracting a word/phrase from command that follow this specific pattern
  const matchPattern = isAdding
    ? /add (.*?) to my to-do/
    : /remove (.*?) from my to-do/;
  const match = sentence.match(matchPattern);
  return match[1];
}

function getMathExpression(sentence) {
  const mathExpression = sentence.split("what is ")[1]; //['', '3 + 3']
  const mathExpressionNormalized = mathExpression.includes("plus")
    ? mathExpression.replace("plus", "+")
    : mathExpression.includes("minus")
    ? mathExpression.replace("minus", "-")
    : mathExpression.includes("times")
    ? mathExpression.replace("times", "*")
    : mathExpression.includes("divided by")
    ? mathExpression.replace("divided by", "/")
    : mathExpression;
  return mathExpressionNormalized;
}

function getTimeInfo(sentence) {
  const valueAndUnit = sentence.split("set a timer for ")[1].split(" "); //['4', 'minutes']
  const timeValue = parseInt(valueAndUnit[0], 10); // Provides numeric conversion
  const timeUnit = valueAndUnit[1];
  return [timeValue, timeUnit]; //[4, 'minutes']
}

//functions that return response
function addUser(name) {
  if (user.name !== name) {
    user.name = name;
    return `Nice to meet you ${user.name}`;
  }
  return `I already know you, ${user.name}`;
}

function sayName() {
  if (!user.name) {
    return `It seems you haven't introduced yourself yet! What's your name?`;
  }
  return `You name is ${user.name}`;
}

function addActivity(activity) {
  if (user.todo.includes(activity)) {
    return "You already have this activity in to-do";
  } else {
    user.todo.push(activity);
    return `${activity} added to your to-do`;
  }
}

function removeActivity(activity) {
  const indexOfRemovingActivity = user.todo.indexOf(activity);
  if (indexOfRemovingActivity >= 0) {
    user.todo.splice(indexOfRemovingActivity, 1);
    return `Removed ${activity} from your to-do`;
  } else {
    return "There is no such activity in your to-do";
  }
}

function listTodos() {
  if (user.todo.length === 0) {
    return "Your todo is empty";
  } else {
    const todoItems = user.todo.join(" and ");
    return `You have ${user.todo.length} todos:\n${todoItems}`;
  }
}

function getCurrentDate() {
  const today = new Date();
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-GB", options); //15 May 2024
  const [day, month, year] = formattedDate.split(" ");
  return `Today is ${day}. of ${month} ${year}`;
}

function calcMathExpression(mathExpression) {
  if (isValidMathExpression(mathExpression)) {
    return eval(mathExpression).toString();
  } else {
    return "I am afraid I did not catch the numbers. Could you repeat please ";
  }
}

function setTimer(timeInfo, command) {
  //calculating milliseconds for a timer
  const [timeValue, timeUnit] = timeInfo;
  let timeInMilliseconds;
  switch (timeUnit) {
    case "seconds":
    case "second":
      timeInMilliseconds = timeValue * 1000;
      break;
    case "minutes":
    case "minute":
      timeInMilliseconds = timeValue * 60 * 1000;
      break;
    case "hours":
    case "hour":
      timeInMilliseconds = timeValue * 60 * 60 * 1000;
      break;
    default:
      return "Oh, I did not catch the time. Please use seconds, minutes, or hours."; // Return for invalid time units
  }

  // Clear existing timer
  if (user.activeTimerId !== null) {
    clearTimeout(user.activeTimerId);
  }
  // Set the new timer
  user.activeTimerId = setTimeout(() => {
    console.log(getReply(command)); //for seeing the message in consol
    //code for working artyom.js
    // const response = getReply(command);
    // artyom.say(response);
    clearTimeout(user.activeTimerId);
  }, timeInMilliseconds);

  return `Timer set for ${timeValue} ${timeUnit}`;
}

function getNiceMessage() {
  const nicePhrases = [
    "You are an incredible person",
    "You are a wonderful friend",
    "Your positivity is infectious",
    "You have a great sense of humor",
    "You are a great coder",
    "Regular expressions are a piece of cake for you",
    "You will soon be working as a web developer",
  ];
  const randomIndex = Math.floor(Math.random() * nicePhrases.length);
  return `${nicePhrases[randomIndex]}, ${user.name}`;
}

//functions for recognizing a command
const isSayHello = (command) => command.includes("hello my name is");
const askName = (command) => command.includes("what is my name");
const addTodo = (command) =>
  command.startsWith("add") && command.endsWith("to my to-do");
const removeTodo = (command) =>
  command.startsWith("remove") && command.endsWith("from my to-do");
const askListTodos = (command) => command.includes("what is on my to-do");
const askCurrentDate = (command) => command.includes("what day is it today");
const askDoingMath = (command) =>
  command.startsWith("what is") &&
  (command.includes("+") ||
    command.includes("plus") ||
    command.includes("-") ||
    command.includes("minus") ||
    command.includes("*") ||
    command.includes("times") || // Assuming "times" is used for multiplication
    command.includes("/") ||
    command.includes("divided by")); // Assuming "divided by" is used for division
const askSetTimer = (command) => command.includes("set a timer for");
const askSomethingNice = (command) => command.includes("say something nice");

//main function
function getReply(command) {
  const normalizedCommand = command.toLowerCase().trim();
  switch (true) {
    //greeting and introducing
    case isSayHello(normalizedCommand):
      const userName = getName(normalizedCommand);
      return addUser(userName);

    //asking a name
    case askName(normalizedCommand):
      return sayName();

    //adding an activity to a list of todo
    case addTodo(normalizedCommand):
      const newActivity = getActivity(normalizedCommand, true);
      return addActivity(newActivity);

    //removing an activity from a list of todo
    case removeTodo(normalizedCommand):
      const deletingActivity = getActivity(normalizedCommand, false);
      return removeActivity(deletingActivity);

    //listing activities from todo
    case askListTodos(normalizedCommand):
      return listTodos();

    //asking a date
    case askCurrentDate(normalizedCommand):
      return getCurrentDate();

    //doing simple math
    case askDoingMath(normalizedCommand):
      const mathExpression = getMathExpression(normalizedCommand);
      return calcMathExpression(mathExpression);

    //setting a timer
    case askSetTimer(normalizedCommand):
      const timeInfo = getTimeInfo(normalizedCommand);
      return setTimer(timeInfo, "timer done");

    case normalizedCommand === "timer done":
      return "Timer done";

    case askSomethingNice(normalizedCommand):
      return getNiceMessage();

    default:
      return `I didn't understand that command. Repeat, please`;
  }
}

//Testing
// console.log(getReply('What is my name')); //It seems you haven't introduced yourself yet! What's your name?
// console.log(getReply('Hello my name is Benjamin')); //Nice to meet you Benjamin
// console.log(getReply('Hello my name is Benjamin')); //I already know you, Benjamin
// console.log(getReply('What is my name')); //Your name is Benjamin
// console.log(getReply('Add fishing to my to-do')); //fishing added to your to-do
// console.log(getReply('Add fishing to my to-do')); //You already have this activity in to-do
// console.log(getReply('Add singing in the shower to my to-do')); //singing in the shower added to your to-do
// console.log(getReply('Remove fishing from my to-do')); //Removed fishing from your to-do
// console.log(getReply('Remove shopping from my to-do')); //There is no such activity in your to-do
// console.log(getReply('Add shopping to my to-do')); //shopping added to your to-do
// console.log(listTodos('What is on my to-do'));
// // You have 2 todos:
// // singing in the shower and shopping
// console.log(getReply('What day is it today')); //Today is 16. of May 2024
// //math
// console.log(getReply('What is 3 + 3')); //6
// console.log(getReply('What is 3 plus 3')); //6
// console.log(getReply('What is 4 * 10')); //40
// console.log(getReply('What is 4 times 10')); //40
// console.log(getReply('What is 15 - 5')); //10
// console.log(getReply('What is 15 minus 5')); //10
// console.log(getReply('What is 50 / 25')); //2
// console.log(getReply('What is 50 divided by 25')); //2
// console.log(getReply('What is 52 divided by free')); //I am afraid I did not catch the numbers. Could you please repeat
// //timer
// console.log(getReply('Set a timer for 5 seconds')); //Timer set for 5 seconds
// // 5 seconds later:
// // Timer done

// console.log(getReply('Say something nice')); //Regular expressions are a piece of cake for you, Benjamin
