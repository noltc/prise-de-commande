// === Données ===
const data = {
  "Burgers": [
    {nom: "Cheeseburger", prix: 6, image: "https://picsum.photos/200?burger1"},
    {nom: "Bacon Burger", prix: 7, image: "https://picsum.photos/200?burger2"},
  ],
  "Menus": [
    {nom: "Menu Burger + Frites + Boisson", prix: 10, image: "https://picsum.photos/200?menu"},
    {nom: "Menu Enfant", prix: 8, image: "https://picsum.photos/200?kids"},
  ],
  "Boissons": [
    {nom: "Coca-Cola", prix: 2, image: "https://picsum.photos/200?cola"},
    {nom: "Eau minérale", prix: 1.5, image: "https://picsum.photos/200?water"},
  ],
  "Desserts": [
    {nom: "Tiramisu", prix: 4, image: "https://picsum.photos/200?tiramisu"},
    {nom: "Brownie", prix: 3.5, image: "https://picsum.photos/200?brownie"},
  ]
};

// === DOM ===
const catSection = document.getElementById("categories");
const catList = document.getElementById("cat-list");
const menuSection = document.getElementById("menu");
const produitsDiv = document.getElementById("produits");
const titreCat = document.getElementById("titre-categorie");
const panierListe = document.getElementById("panier-liste");
const totalEl = document.getElementById("total");
let panier = [];

// === Catégories ===
Object.keys(data).forEach(cat => {
  const div = document.createElement("div");
  div.className = "categorie";
  div.innerHTML = `<h3>${cat}</h3>`;
  div.onclick = () => afficherCategorie(cat);
  catList.appendChild(div);
});

// === Affichage produits ===
function afficherCategorie(cat) {
  catSection.classList.add("hidden");
  menuSection.classList.remove("hidden");
  titreCat.textContent = cat;
  produitsDiv.innerHTML = "";

  data[cat].forEach(p => {
    const div = document.createElement("div");
    div.className = "produit";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.nom}">
      <h3>${p.nom}</h3>
      <p>${p.prix} €</p>
      <button onclick="ajouter('${p.nom}', ${p.prix})">Ajouter</button>
    `;
    produitsDiv.appendChild(div);
  });
}

// === Retour catégories ===
document.getElementById("retour").onclick = () => {
  menuSection.classList.add("hidden");
  catSection.classList.remove("hidden");
};

// === Panier ===
function ajouter(nom, prix) {
  const item = panier.find(p => p.nom === nom);
  if (item) item.qte++;
  else panier.push({nom, prix, qte: 1});
  afficherPanier();
}

function supprimer(i) {
  panier.splice(i, 1);
  afficherPanier();
}

function afficherPanier() {
  panierListe.innerHTML = "";
  let total = 0;
  panier.forEach((p, i) => {
    total += p.prix * p.qte;
    const li = document.createElement("li");
    li.innerHTML = `${p.nom} x${p.qte} - ${p.prix * p.qte} €
      <button onclick="supprimer(${i})">❌</button>`;
    panierListe.appendChild(li);
  });
  totalEl.textContent = total.toFixed(2);
}

// === Envoi vers Google Sheets ===
document.getElementById("valider").onclick = () => {
  if (panier.length === 0) return alert("Panier vide !");

  const dataCommande = panier.map(p => ({
    nom: p.nom,
    prix: p.prix,
    quantite: p.qte
  }));

  fetch("https://script.google.com/macros/s/AKfycbwuLtYaTwBc1MtB3CmG7EQcVbN6ARjqht16tQq40I2ExlC2wdQ7ltvRlHdkpbD4yiQlLA/exec", { // <-- Remplace ici
    method: "POST",
    body: JSON.stringify({commande: dataCommande}),
    headers: {"Content-Type": "application/json"}
  })
  .then(res => res.json())
  .then(() => {
    alert("✅ Commande envoyée !");
    panier = [];
    afficherPanier();
  })
  .catch(err => alert("Erreur : " + err));
};
