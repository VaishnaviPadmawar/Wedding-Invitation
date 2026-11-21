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
    for (let burst = 0; burst < 16; burst += 1) {
      window.setTimeout(() => {
        const x = 5 + Math.random() * 90;
        const y = 5 + Math.random() * 75;
        createFirework(window.innerWidth * x / 100, window.innerHeight * y / 100);
      }, burst * 110);
    }
  });
});

function createFirework(centerX, centerY) {
  const burst = document.createElement("div");
  burst.className = "firework-burst";
  burst.style.left = `${centerX}px`;
  burst.style.top = `${centerY}px`;
  document.body.appendChild(burst);

  for (let i = 0; i < 32; i += 1) {
    const spark = document.createElement("span");
    const angle = (360 / 32) * i;
    const distance = 140 + Math.random() * 180;
    spark.style.setProperty("--angle", `${angle}deg`);
    spark.style.setProperty("--distance", `${distance}px`);
    burst.appendChild(spark);
  }

  window.setTimeout(() => burst.remove(), 1800);
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

