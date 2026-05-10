(function () {
  const modes = {
    dkey: {
      label: "DKey",
      target: "GPT / any text field",
      intent: "DKey mode · choose action · approve manually",
      actions: ["ASK", "SHAPE", "SHORTEN", "SEND?"],
      output: (text) => `DKey מכינה ניסוח מותאם: "${text}" — עם אישור ידני לפני שליחה.`
    },
    dev: {
      label: "DEV",
      target: "GitHub / terminal / code",
      intent: "DEV mode · inspect → pick → build → verify",
      actions: ["INSPECT", "PICK", "BUILD", "VERIFY"],
      output: (text) => `מסלול DEV: ניתוח → בחירת scope → שינוי קטן → בדיקה. קלט: "${text}"`
    },
    suno: {
      label: "SUNO",
      target: "music / lyrics / style",
      intent: "SUNO mode · idea → lyrics → style → export",
      actions: ["IDEA", "LYRICS", "STYLE", "EXPORT"],
      output: (text) => `מסלול SUNO: רעיון לשיר → מילים → צבע מוזיקלי → פרומפט מוכן. נושא: "${text}"`
    },
    create: {
      label: "Create",
      target: "concept / image / story",
      intent: "Create mode · brief → concept → image → review",
      actions: ["BRIEF", "CONCEPT", "IMAGE", "REVIEW"],
      output: (text) => `מסלול יצירה: בריף חד → קונספט → דימוי חזותי → בדיקה. בסיס: "${text}"`
    },
    safe: {
      label: "Safe",
      target: "privacy / approval / guard",
      intent: "Safe mode · privacy check → approve → send manually",
      actions: ["CHECK", "BLOCK", "APPROVE", "SEND?"],
      output: (text) => `בדיקת פרטיות: אין שליחה אוטומטית. האדם מאשר ידנית. טקסט לבדיקה: "${text}"`
    }
  };

  let currentMode = "dkey";
  let currentAction = "";
  let approved = false;

  const liveInput = document.getElementById("liveInput");
  const output = document.getElementById("preparedOutput");
  const actionRow = document.getElementById("actionRow");
  const intentLine = document.getElementById("intentLine");
  const targetLabel = document.getElementById("targetLabel");
  const statusPill = document.getElementById("statusPill");
  const beadMode = document.getElementById("beadMode");
  const beadAction = document.getElementById("beadAction");
  const beadApproval = document.getElementById("beadApproval");
  const approveBtn = document.getElementById("approveBtn");
  const approveHint = document.getElementById("approveHint");
  const routeItems = Array.from(document.querySelectorAll("#route li"));

  const modeButtons = Array.from(document.querySelectorAll("[data-mode]"));
  const legends = Array.from(document.querySelectorAll(".legend"));

  function cleanInput() {
    return liveInput.value.trim() || "רעיון ריק — המשתמש עדיין לא כתב";
  }

  function renderActions() {
    const data = modes[currentMode];
    actionRow.innerHTML = "";

    const clip = document.createElement("button");
    clip.textContent = "📋";
    clip.className = "iconAction";
    actionRow.appendChild(clip);

    const play = document.createElement("button");
    play.textContent = "▶";
    play.className = "play";
    actionRow.appendChild(play);

    data.actions.forEach((name, index) => {
      const btn = document.createElement("button");
      btn.textContent = name;
      btn.className = "act" + (index === 0 ? " isActive" : "");
      btn.addEventListener("click", () => chooseAction(name, btn));
      actionRow.appendChild(btn);

      if (index === 0) currentAction = name;
    });
  }

  function setMode(mode) {
    currentMode = mode;
    approved = false;

    const data = modes[mode];

    modeButtons.forEach((btn) => {
      btn.classList.toggle("isActive", btn.dataset.mode === mode);
    });

    legends.forEach((btn) => {
      btn.classList.toggle("isActive", btn.dataset.mode === mode);
    });

    intentLine.textContent = data.intent;
    targetLabel.textContent = data.target;
    beadMode.textContent = data.label;
    beadAction.textContent = "בחר";
    beadApproval.textContent = "ממתין";
    approveBtn.textContent = "אשר ידנית";
    approveBtn.classList.remove("approved");
    approveHint.textContent = "אין auto-run. אין auto-send.";
    statusPill.textContent = "Human in control";

    routeItems.forEach((item, index) => {
      item.classList.toggle("done", index < 2);
    });

    renderActions();
    updateOutput();
  }

  function chooseAction(action, button) {
    currentAction = action;
    approved = false;

    Array.from(actionRow.querySelectorAll(".act")).forEach((btn) => {
      btn.classList.toggle("isActive", btn === button);
    });

    beadAction.textContent = action;
    beadApproval.textContent = "ממתין";
    approveBtn.textContent = "אשר ידנית";
    approveBtn.classList.remove("approved");
    approveHint.textContent = "פעולה נבחרה. ממתין לאישור האדם.";
    statusPill.textContent = "Waiting approval";

    routeItems.forEach((item, index) => {
      item.classList.toggle("done", index < 3);
    });

    updateOutput();
  }

  function updateOutput() {
    const data = modes[currentMode];
    const text = cleanInput();
    const base = data.output(text);
    output.textContent = currentAction
      ? `${base} פעולה נבחרת: ${currentAction}.`
      : base;
  }

  function approve() {
    approved = true;
    beadApproval.textContent = "מאושר";
    approveBtn.textContent = "מאושר ✓";
    approveBtn.classList.add("approved");
    approveHint.textContent = "עכשיו המשתמש יכול להעתיק/לשלוח ידנית.";
    statusPill.textContent = "Approved by user";

    routeItems.forEach((item) => item.classList.add("done"));
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });

  legends.forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });

  liveInput.addEventListener("input", () => {
    approved = false;
    beadInput.textContent = liveInput.value.trim() ? "טעון" : "ריק";
    beadApproval.textContent = "ממתין";
    approveBtn.textContent = "אשר ידנית";
    approveBtn.classList.remove("approved");
    updateOutput();
  });

  approveBtn.addEventListener("click", approve);

  setMode("dkey");
})();
