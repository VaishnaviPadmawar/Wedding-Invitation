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
      <article>
        <h3>${event.name}</h3>
        <p>${event.date} · ${event.time}</p>
        <p class="event-venue">${venue.name}</p>
        <a class="event-map-link" href="${venue.mapUrl}" target="_blank" rel="noopener noreferrer">View venue on map <span aria-hidden="true">↗</span></a>
        ${event.name === "Reception" ? `
          <button class="fireworks-button" type="button" aria-label="Light the fireworks">
            <span aria-hidden="true">✦</span> Light the fireworks
          </button>
        ` : ""}
      </article>
    `;
  }).join("");

document.querySelectorAll(".fireworks-button").forEach(button => {
  button.addEventListener("click", () => {
    for (let burst = 0; burst < 13; burst += 1) {
      window.setTimeout(() => {
        const x = 7 + Math.random() * 86;
        const y = 10 + Math.random() * 72;
        createFirework(window.innerWidth * x / 100, window.innerHeight * y / 100);
      }, burst * 105);
    }
  });
});

let fireworksCanvas;
let fireworksContext;
let fireworkParticles = [];
let fireworksFrame = 0;

function createFirework(centerX, centerY) {
  if (!fireworksCanvas) {
    fireworksCanvas = document.createElement("canvas");
    fireworksCanvas.className = "fireworks-canvas";
    fireworksCanvas.setAttribute("aria-hidden", "true");
    fireworksContext = fireworksCanvas.getContext("2d");
    if (!fireworksContext) {
      throw new Error("Unable to create the fireworks animation canvas.");
    }
    document.body.appendChild(fireworksCanvas);
    resizeFireworksCanvas();
    window.addEventListener("resize", resizeFireworksCanvas);
  }

  const colors = [42, 350, 8, 52];
  const hue = colors[Math.floor(Math.random() * colors.length)];
  const particleCount = 95 + Math.floor(Math.random() * 41);

  for (let i = 0; i < particleCount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.8 + Math.random() * 7.2;
    fireworkParticles.push({
      x: centerX,
      y: centerY,
      originX: centerX,
      originY: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      hue: hue + (Math.random() - 0.5) * 24,
      alpha: 0.75 + Math.random() * 0.25,
      decay: 0.007 + Math.random() * 0.007,
      size: 1 + Math.random() * 1.7
    });
  }

  if (!fireworksFrame) {
    fireworksFrame = window.requestAnimationFrame(animateFireworks);
  }
}

function resizeFireworksCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  fireworksCanvas.width = Math.round(window.innerWidth * pixelRatio);
  fireworksCanvas.height = Math.round(window.innerHeight * pixelRatio);
  fireworksContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function animateFireworks() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  fireworksContext.globalCompositeOperation = "destination-out";
  fireworksContext.fillStyle = "rgba(0, 0, 0, 0.16)";
  fireworksContext.fillRect(0, 0, width, height);
  fireworksContext.globalCompositeOperation = "lighter";

  fireworkParticles = fireworkParticles.filter(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.986;
    particle.vy = particle.vy * 0.986 + 0.035;
    particle.alpha -= particle.decay;

    if (particle.alpha <= 0) {
      return false;
    }

    fireworksContext.beginPath();
    fireworksContext.moveTo(particle.originX, particle.originY);
    fireworksContext.lineTo(particle.x, particle.y);
    fireworksContext.strokeStyle = `hsla(${particle.hue}, 100%, 68%, ${particle.alpha})`;
    fireworksContext.lineWidth = particle.size;
    fireworksContext.shadowColor = `hsla(${particle.hue}, 100%, 70%, ${particle.alpha})`;
    fireworksContext.shadowBlur = particle.size * 5;
    fireworksContext.stroke();
    return particle.x > -20 && particle.x < width + 20 && particle.y > -20 && particle.y < height + 20;
  });

  fireworksContext.shadowBlur = 0;
  if (fireworkParticles.length) {
    fireworksFrame = window.requestAnimationFrame(animateFireworks);
  } else {
    fireworksContext.clearRect(0, 0, width, height);
    fireworksFrame = 0;
  }
}

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

