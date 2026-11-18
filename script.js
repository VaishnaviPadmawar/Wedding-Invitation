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
document.querySelector("#couple-names").textContent = wedding.names;
document.querySelector("#bride-name").textContent = wedding.brideName;
document.querySelector("#groom-name").textContent = wedding.groomName;
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
    <article>
      <h3>${family.title}</h3>
      <p>${family.details}</p>
    </article>
  `).join("");

document.querySelector("#events-list").innerHTML =
  wedding.events.map(event => `
    <article>
      <h3>${event.name}</h3>
      <p>${event.date} · ${event.time}</p>
    </article>
  `).join("");

const openButton = document.querySelector("#open-button");
const cover = document.querySelector("#cover");
const invitation = document.querySelector("#invitation");

openButton.addEventListener("click", () => {
  cover.hidden = true;
  invitation.hidden = false;
  invitation.scrollIntoView({ behavior: "smooth" });
});

