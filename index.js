//all students from the spreadsheet
let allStudents = [];
//unique list of people who attended during the day
let attendees = [];

document.querySelector("button#back").addEventListener("click", () => {
  document.body.dataset.step = Number(document.body.dataset.step) - 1;
});
document.querySelector("button#next").addEventListener("click", () => {
  document.body.dataset.step = Number(document.body.dataset.step) + 1;
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
      document.body.dataset.step = "2";
    }
    reader.readAsText(selectedFile);
  }
}

function setOutput() {
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
document.querySelector("#studentsFromExcel").addEventListener("input", (e) => {
  const asArray = e.target.value.split("\n");
  allStudents = asArray.map((stud) => stud.replace("\t", " "));
  setOutput();
});

document
  .querySelector("#upload")
  .addEventListener("change", handleFileSelect, false);
