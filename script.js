let time = 1500;
let totalTime = time;
let timer = null;
let isBreak = false;

/* INIT */
let sessions = localStorage.getItem("sessions") || 0;
document.getElementById("sessions").innerText = sessions;

updateDisplay();
loadTasks();

/* TIMER */
function updateDisplay() {
  let m = Math.floor(time / 60);
  let s = time % 60;

  document.getElementById("time").innerText =
    `${m}:${s < 10 ? "0" : ""}${s}`;

  let progress = ((totalTime - time) / totalTime) * 100 || 0;
  document.getElementById("progressBar").style.width = progress + "%";
}

function startTimer() {
  if (timer) return;

  timer = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
    } else {
      clearInterval(timer);
      timer = null;

      document.getElementById("alarm").play();

      if (!isBreak) {
        sessions++;
        localStorage.setItem("sessions", sessions);
        document.getElementById("sessions").innerText = sessions;

        time = 300;
        isBreak = true;
      } else {
        time = 1500;
        isBreak = false;
      }

      totalTime = time;
      updateDisplay();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  time = 1500;
  totalTime = time;
  isBreak = false;
  updateDisplay();
}

function setCustomTime() {
  let val = document.getElementById("customTime").value;

  if (!val || val <= 0) return;

  time = val * 60;
  totalTime = time;
  updateDisplay();
}

/* TASKS */
function addTask() {
  const text = document.getElementById("taskInput").value;
  const min = document.getElementById("taskTime").value || 25;

  if (!text.trim()) return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.push({
    text,
    time: min * 60
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskInput").value = "";
  document.getElementById("taskTime").value = "";

  loadTasks();
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const list = document.getElementById("taskList");

  list.innerHTML = "";

  tasks.forEach((task, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <span onclick="selectTask(${index})">
        ${task.text} (${task.time / 60} min)
      </span>

      <div class="task-actions">
        <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;

    list.appendChild(li);
  });
}

function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function selectTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  time = tasks[index].time;
  totalTime = time;

  updateDisplay();
}

/* THEME */
function toggleTheme() {
  document.body.classList.toggle("light");
}