(function () {
  document.documentElement.classList.add("ready");

  const typingText = document.getElementById("typingText");
  const modeButtons = Array.from(document.querySelectorAll("#modeRow .mode"));
  const actionButtons = Array.from(document.querySelectorAll("#actionRow .act"));

  const phrases = [
    "השליטה אצלי. הפרטיות אצלי.",
    "Inspect → Pick → Build → Verify.",
    "רעיון לשיר. מילים. סגנון. בלי לשלוח לבד.",
    "Tap once. Use everywhere."
  ];

  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let deleting = false;
  let lastTick = 0;

  function typeLoop(now) {
    const delay = deleting ? 22 : 48;
    if (now - lastTick > delay) {
      const phrase = phrases[phraseIndex];

      if (!deleting) {
        charIndex += 1;
        if (charIndex >= phrase.length) {
          deleting = true;
          lastTick = now + 1150;
        }
      } else {
        charIndex -= 1;
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          lastTick = now + 260;
        }
      }

      typingText.textContent = phrase.slice(0, charIndex);
      lastTick = now;
    }

    window.requestAnimationFrame(typeLoop);
  }

  window.requestAnimationFrame(typeLoop);

  let state = 0;
  setInterval(function () {
    modeButtons.forEach((button, index) => {
      button.classList.toggle("isActive", index === state % modeButtons.length);
    });

    actionButtons.forEach((button, index) => {
      button.classList.toggle("isActive", index === state % actionButtons.length);
    });

    state += 1;
  }, 2600);
})();
