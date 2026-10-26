const photos = [
  { src: "images/sohaib-01.svg", caption: "Sohaib, probablement en train de réfléchir" },
  { src: "images/sohaib-02.svg", caption: "Une journée parfaitement normale" },
  { src: "images/sohaib-03.svg", caption: "Document classé : très important" },
  { src: "images/sohaib-04.svg", caption: "Le serveur témoigne de son courage" },
  { src: "images/sohaib-05.svg", caption: "847 Go de souvenirs compressés" },
  { src: "images/sohaib-06.svg", caption: "Fin de transmission (enfin)" }
];

const bootMessages = [
  "Connexion au serveur de Sohaib…", "Téléchargement des 847 Go de photos…",
  "Optimisation du serveur (impossible)…", "Bande passante saturée…",
  "Chargement des pixels un par un…", "Erreur 503… Ah non, c'est bon.",
  "99 %… Encore un petit effort…", "Le serveur a besoin d'une pause…"
];
const $ = (selector) => document.querySelector(selector);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fakeBoot() {
  const progress = $("#boot-progress");
  const percent = $("#boot-percent");
  const message = $("#boot-message");
  const progressTrack = document.querySelector(".progress-track");
  let value = 0;
  let messageIndex = 0;
  const start = performance.now();
  const duration = 12000 + Math.random() * 6000;

  // La progression volontairement lente s'arrête à 98 %, puis passe à 99 %
  // après une pause dédiée. La cible était plafonnée à 98 %, ce qui rendait
  // auparavant la condition `value < 99` impossible à satisfaire.
  while (value < 98) {
    const elapsed = performance.now() - start;
    const target = Math.min(98, Math.floor((elapsed / duration) * 100));
    if (target > value) {
      value += Math.min(target - value, Math.random() > .72 ? 3 : 1);
      progress.style.width = `${value}%`;
      percent.textContent = `${value} %`;
      progressTrack.setAttribute("aria-valuenow", value);
    }
    if (value >= messageIndex * 12 + 8 && messageIndex < bootMessages.length - 1) {
      messageIndex += 1;
      message.textContent = bootMessages[messageIndex];
    }
    await wait(140 + Math.random() * 160);
  }
  value = 98;
  progress.style.width = "98%";
  percent.textContent = "98 %";
  progressTrack.setAttribute("aria-valuenow", "98");
  message.textContent = "99 %… Encore un petit effort…";
  await wait(3200);
  value = 99;
  progress.style.width = "99%";
  percent.textContent = "99 %";
  progressTrack.setAttribute("aria-valuenow", "99");
  await wait(450);
  progress.style.width = "100%";
  percent.textContent = "100 %";
  progressTrack.setAttribute("aria-valuenow", "100");
  await wait(650);
  $("#boot-screen").classList.add("is-done");
  $("#site-shell").removeAttribute("aria-hidden");
  renderGallery();
}

function renderGallery() {
  const gallery = $("#gallery");
  photos.forEach((photo, index) => {
    const card = document.createElement("figure");
    card.className = "photo-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Afficher : ${photo.caption}`);
    card.innerHTML = `<div class="photo-frame is-loading"><div class="skeleton"><span class="spinner"></span><span>Chargement de l'image…</span></div></div><figcaption><span>Photo ${String(index + 1).padStart(2, "0")}</span>${photo.caption}</figcaption>`;
    card.addEventListener("click", () => openLightbox(index));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openLightbox(index); }
    });
    gallery.append(card);
    loadPhoto(card, photo, 2000 + Math.random() * 6000);
  });
}

async function loadPhoto(card, photo, delay) {
  await wait(delay);
  const frame = card.querySelector(".photo-frame");
  const image = new Image();
  image.src = photo.src;
  image.alt = photo.caption;
  image.onload = () => {
    frame.innerHTML = "";
    frame.append(image);
    frame.classList.remove("is-loading");
    frame.classList.add("is-ready");
    updateCount();
  };
  image.onerror = () => {
    frame.querySelector(".skeleton").lastChild.textContent = "Image introuvable — le serveur boude.";
  };
}

function updateCount() {
  $(".photo-count").textContent = `${document.querySelectorAll(".photo-frame.is-ready").length} photos affichées`;
}

async function openLightbox(index) {
  const lightbox = $("#lightbox");
  const image = $("#lightbox-image");
  const loader = $("#lightbox-loader");
  const caption = $("#lightbox-caption");
  lightbox.dataset.index = index;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  image.classList.remove("is-visible");
  loader.classList.remove("is-hidden");
  caption.textContent = "";
  await wait(1000 + Math.random() * 2000);
  image.src = photos[index].src;
  image.alt = photos[index].caption;
  caption.textContent = photos[index].caption;
  loader.classList.add("is-hidden");
  image.classList.add("is-visible");
}

function closeLightbox() {
  $("#lightbox").classList.remove("is-open");
  $("#lightbox").setAttribute("aria-hidden", "true");
}
function moveLightbox(direction) {
  const current = Number($("#lightbox").dataset.index);
  openLightbox((current + direction + photos.length) % photos.length);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
  if ($("#lightbox").classList.contains("is-open") && event.key === "ArrowRight") moveLightbox(1);
  if ($("#lightbox").classList.contains("is-open") && event.key === "ArrowLeft") moveLightbox(-1);
});
$(".lightbox-close").addEventListener("click", closeLightbox);
$(".lightbox-next").addEventListener("click", () => moveLightbox(1));
$(".lightbox-prev").addEventListener("click", () => moveLightbox(-1));
$("#lightbox").addEventListener("click", (event) => { if (event.target.id === "lightbox") closeLightbox(); });

fakeBoot();
