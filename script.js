let xp = 0;
const flashcards = [
  { front: "What is a User Story?", back: "A simple, informal description of a feature told from the perspective of the end user. Format: 'As a [user], I want [goal] so that [reason].'" },
  { front: "What’s the difference between a Sprint and an Iteration?", back: "Sprint is specific to Scrum. Iteration is more general in Agile. Both are time-boxed work periods." },
  { front: "One GenAI use case in project management is:", back: "Summarizing project updates into bullet-point reports using LLMs like ChatGPT." }
];

const quizQuestions = [
  {
    question: "A client requests a new feature mid-sprint. What do you do?",
    options: ["Add it to sprint backlog", "Politely decline", "Add to product backlog for next planning", "Pause the sprint"],
    correct: 2
  },
  {
    question: "Which is NOT part of a user story?",
    options: ["Persona", "Goal", "Reason", "Cost estimate"],
    correct: 3
  },
  {
    question: "Best GenAI task?",
    options: ["Mediation", "Drafting summary emails", "Resource allocation", "Daily standup"],
    correct: 1
  }
];

function updateXP(points) {
  xp += points;
  document.getElementById("xp").innerText = xp;
}

function startFlashcards() {
  const content = document.getElementById("content");
  content.innerHTML = "";
  flashcards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<strong>${card.front}</strong><br><em style='display:none;'>${card.back}</em>`;
    div.onclick = () => {
      const em = div.querySelector("em");
      em.style.display = em.style.display === "none" ? "block" : "none";
      updateXP(2);
    };
    content.appendChild(div);
  });
}

function startQuiz() {
  const content = document.getElementById("content");
  content.innerHTML = "";
  let current = 0;

  function showQuestion(index) {
    if (index >= quizQuestions.length) {
      content.innerHTML = "<p>🎉 Challenge Complete! You earned " + xp + " XP!</p>";
      return;
    }
    const q = quizQuestions[index];
    const div = document.createElement("div");
    div.className = "quiz-question";
    div.innerHTML = `<strong>${q.question}</strong><br>`;
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => {
        if (i === q.correct) {
          updateXP(10);
        }
        showQuestion(index + 1);
      };
      div.appendChild(btn);
    });
    content.innerHTML = "";
    content.appendChild(div);
  }

  showQuestion(current);

  if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}

const fsBtn = document.getElementById('fs-btn');

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

async function enterFullscreen(el = document.documentElement) {
  const anyEl = el;
  if (anyEl.requestFullscreen) return anyEl.requestFullscreen();
  if (anyEl.webkitRequestFullscreen) return anyEl.webkitRequestFullscreen(); // Safari desktop
  if (anyEl.msRequestFullscreen) return anyEl.msRequestFullscreen();         // Old Edge
}

async function exitFullscreen() {
  if (document.exitFullscreen) return document.exitFullscreen();
  if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
  if (document.msExitFullscreen) return document.msExitFullscreen();
}

function isFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

function updateFsButton() {
  const on = isFullscreen() || isStandalone();
  fsBtn.setAttribute('aria-pressed', String(on));
  fsBtn.textContent = on ? '↙' : '⛶'; // simple icon swap
  fsBtn.title = on ? 'Exit Fullscreen' : 'Go Fullscreen';
  // Hide button if already a standalone PWA (no need to show)
  fsBtn.style.display = isStandalone() ? 'none' : '';
}

fsBtn?.addEventListener('click', async () => {
  try {
    if (isFullscreen()) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  } catch (e) {
    console.warn('Fullscreen error:', e);
  } finally {
    updateFsButton();
  }
});

// Keep state in sync on ESC / changes
['fullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach(ev =>
  document.addEventListener(ev, updateFsButton)
);

// Detect PWA mode changes (Chrome fires this on install/open)
window.matchMedia('(display-mode: standalone)').addEventListener('change', updateFsButton);

// Initialize on load
document.addEventListener('DOMContentLoaded', updateFsButton);


}
