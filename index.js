//all students from the spreadsheet

let allStudents = [];
let attendees = [];

//unique list of people who attended during the day

const copyTextareaToClipboard = (el) => {
  el.select();
  document.execCommand("copy");
  console.log(`copied ${el.value} to clipboard`);
};
const observer = (function () {
  "use strict";
  const events = {};
  return {
    subscribe: function (ev, callback) {
      if (!events.hasOwnProperty(ev)) {
        events[ev] = [];
      }
      events[ev].push(callback);
    },
    publish: function (ev) {
      console.log("Broadcasting: ", ev);
      let data = Array.prototype.slice.call(arguments, 1);
      let index = 0;
      let length = 0;
      if (events.hasOwnProperty(ev)) {
        length = events[ev].length;
        for (; index < length; index++) {
          events[ev][index].apply(this, data);
        }
      }
    },
    unsubscribe: function (ev, callback) {
      let x = events[ev].indexOf(callback);
      events[ev].splice(x, 1);
    },
  };
})();

observer.subscribe("step", (args) => {
  if (typeof window[`step${args}`] === "function") {
    window[`step${args}`]();
  }
  console.log({ step: args, allStudents, attendees });
});
observer.publish("step", 1);
function setStep(nextNum) {
  document.body.dataset.step = nextNum;
  observer.publish("step", nextNum);
}
function back() {
  setStep(Number(document.body.dataset.step) - 1);
}
function next() {
  setStep(Number(document.body.dataset.step) + 1);
}
document.querySelector("button#back").addEventListener("click", () => {
  back();
});
document.querySelector("button#next").addEventListener("click", () => {
  next();
});
document.querySelector("button#restart").addEventListener("click", () => {
  window.location = "";
});

function handleFileSelect(evt) {
  const selectedFile = evt.target.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.addEventListener("load", handleEvent);
    function handleEvent(theFile) {
      const raw = theFile.target.result;
      const asArray = raw.split("\n");
      const parsed = new Set();
      for (let i = 0; i < asArray.length; i++) {
        const parts = asArray[i].split("\t");
        if (parts[1] === "Joined" || parts[1] === "Joined before") {
          parsed.add(parts[0]);
        }
      }
      attendees = [...parsed].sort();
      next();
    }
    reader.readAsText(selectedFile);
  }
}

function step3() {
  console.log("step 3");
  if (allStudents.length && attendees.length) {
    const outputArray = allStudents.map((student) => {
      return attendees.includes(student) ? `X` : ``;
    });
    document.querySelector("#output").value = outputArray.join("\n");
    document.querySelector("#studentCheck").textContent = allStudents.join(
      "\n"
    );
  }
}
function step2() {
  console.log("step 2");
  const asArray = document
    .querySelector("#studentsFromExcel")
    .value.split("\n");
  allStudents = asArray.map((stud) => stud.replace("\t", " "));
}
document.querySelector("#studentsFromExcel").addEventListener("input", (e) => {
  step2();
});
document.querySelector("#output").addEventListener("click", (e) => {
  copyTextareaToClipboard(document.querySelector("#output"));
});
document
  .querySelector("#upload")
  .addEventListener("change", handleFileSelect, false);
