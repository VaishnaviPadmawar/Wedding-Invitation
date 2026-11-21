const coupleId =
  new URLSearchParams(window.location.search).get("couple") ||
  Object.keys(window.WEDDINGS)[0];

const wedding = window.WEDDINGS[coupleId];

if (!wedding) {
  throw new Error(`No wedding details found for "${coupleId}".`);
}

document.title = `${wedding.names} | Wedding Invitation`;
document.querySelector("#cover-names").textContent = wedding.names;
document.querySelector("#cover-date").textContent = wedding.date;
document.querySelector("#groom-name").textContent = wedding.groomShortName || wedding.groomName.split(" ")[0];
document.querySelector("#couple-names").textContent = wedding.names;
document.querySelector("#bride-name").textContent = wedding.brideName;
document.querySelector("#wedding-date").textContent = wedding.date;
document.querySelector("#venue-name").textContent = wedding.venue.name;
document.querySelector("#venue-address").textContent = wedding.venue.address;
document.querySelector("#map-link").href = wedding.venue.mapUrl;
document.querySelector("#reception-venue-name").textContent = wedding.receptionVenue.name;
document.querySelector("#reception-venue-address").textContent = wedding.receptionVenue.address;
document.querySelector("#reception-map-link").href = wedding.receptionVenue.mapUrl;
document.querySelector("#footer-names").textContent = wedding.names;

document.querySelector("#families-list").innerHTML =
  wedding.families.map(family => `
    <article class="family-card">
      ${family.title === "The Groom's Family"
        ? '<div class="family-portrait groom-portrait"><img src="assets/groom.png" alt="Groom illustration"></div>'
        : '<div class="family-portrait bride-portrait"><img src="assets/bride.png" alt="Bride illustration"></div>'}
      <h3>${family.title}</h3>
      <p>${family.details}</p>
    </article>
  `).join("");

document.querySelector("#events-list").innerHTML =
  wedding.events.map(event => {
    const venue = wedding[event.venue];
    return `
      <article ${event.fireworks ? 'class="reception-event"' : ""}>
        <h3>${event.name}</h3>
        <p>${event.date} · ${event.time}</p>
        <p class="event-venue">${venue.name}</p>
        <a class="event-map-link" href="${venue.mapUrl}" target="_blank" rel="noopener noreferrer">View venue on map <span aria-hidden="true">↗</span></a>
        ${event.fireworks ? '<button type="button" class="fireworks-button" aria-label="Light the fireworks"><span class="fireworks-icon" aria-hidden="true">✦</span><span>Light the fireworks</span></button>' : ""}
      </article>
    `;
  }).join("");

const fireworksCanvas = document.createElement("canvas");
fireworksCanvas.className = "fireworks-canvas";
fireworksCanvas.setAttribute("aria-hidden", "true");
document.body.appendChild(fireworksCanvas);

const fireworksContext = fireworksCanvas.getContext("2d");
let fireworksParticles = [];
let fireworksAnimationId = null;

function resizeFireworksCanvas() {
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}

function createFirework() {
  const colors = ["#d9a928", "#fff1a8", "#8a2630", "#f7f0e3", "#b76e79"];
  const originX = 40 + Math.random() * (window.innerWidth - 80);
  const originY = 70 + Math.random() * (window.innerHeight * 0.45);

  for (let index = 0; index < 44; index += 1) {
    const angle = (Math.PI * 2 * index) / 44 + (Math.random() - 0.5) * 0.12;
    const speed = 3.5 + Math.random() * 6;
    fireworksParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      gravity: 0.055,
      decay: 0.018 + Math.random() * 0.01,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 1.5 + Math.random() * 2.2
    });
  }
}

function animateFireworks() {
  fireworksContext.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  fireworksParticles = fireworksParticles.filter(particle => particle.alpha > 0);

  fireworksParticles.forEach(particle => {
    particle.vx *= 0.992;
    particle.vy = particle.vy * 0.992 + particle.gravity;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.alpha -= particle.decay;

    fireworksContext.globalAlpha = Math.max(particle.alpha, 0);
    fireworksContext.fillStyle = particle.color;
    fireworksContext.beginPath();
    fireworksContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    fireworksContext.fill();
  });

  fireworksContext.globalAlpha = 1;
  if (fireworksParticles.length > 0) {
    fireworksAnimationId = window.requestAnimationFrame(animateFireworks);
  } else {
    fireworksAnimationId = null;
  }
}

function lightTheFireworks() {
  createFirework();
  for (let burst = 1; burst < 7; burst += 1) {
    window.setTimeout(createFirework, burst * 110);
  }
  if (fireworksAnimationId === null) {
    fireworksAnimationId = window.requestAnimationFrame(animateFireworks);
  }
}

resizeFireworksCanvas();
window.addEventListener("resize", resizeFireworksCanvas);

document.querySelectorAll(".fireworks-button").forEach(button => {
  button.addEventListener("click", lightTheFireworks);
});

const openButton = document.querySelector("#open-button");
const cover = document.querySelector("#cover");
const invitation = document.querySelector("#invitation");

document.querySelectorAll(".language-option").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".language-option").forEach(option => option.classList.remove("active"));
    button.classList.add("active");
  });
});

openButton.addEventListener("click", () => {
  cover.hidden = true;
  invitation.hidden = false;
  invitation.scrollIntoView({ behavior: "smooth" });
});

