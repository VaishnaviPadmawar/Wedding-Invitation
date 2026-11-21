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
      </article>
    `;
  }).join("");

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

