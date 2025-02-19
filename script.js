const conteneurPokemon = document.querySelector('.pokemon');
const champRecherche = document.getElementById('userinput');
const boutonRecherche = document.getElementById('search');
const conteneurHistorique = document.getElementById('liste-historique');
const conteneurAleatoire = document.getElementById('random');
let historiqueRecherches = [];

function creerUrl(nom) {
    return `https://pokeapi.co/api/v2/pokemon/${nom}`;
}

function recupererPokemon(url) {
    fetch(url)
        .then(reponse => reponse.json())
        .then(donnees => {
            afficherPokemon(donnees);
            mettreAJourHistorique(donnees.name);
        })
        .catch(err => conteneurPokemon.innerHTML = '<h1>Aucun Pokémon trouvé</h1>');
}

function afficherPokemon(donnees) {
    const statistiques = donnees.stats.map(stat => `<p>${stat.stat.name}: <span>${stat.base_stat}</span></p>`).join('');
    conteneurPokemon.innerHTML = `
        <div class="details">
            <h2>${donnees.name}</h2>
            <img src="${donnees.sprites.front_default}" alt="${donnees.name}">
            <h3>Poids: <span>${donnees.weight}</span></h3>
            <h3>Taille: <span>${donnees.height}</span></h3>
            <h3>Type: <span>${donnees.types[0].type.name}</span></h3>
        </div>
        <div class="stats">
            <h3>Statistiques de ${donnees.name} :</h3>
            ${statistiques}
        </div>
    `;
}

function rechercherPokemon() {
    if (champRecherche.value.trim()) {
        recupererPokemon(creerUrl(champRecherche.value.toLowerCase()));
    }
}

function mettreAJourHistorique(nomPokemon) {
    if (!historiqueRecherches.includes(nomPokemon)) {
        historiqueRecherches.unshift(nomPokemon);
        if (historiqueRecherches.length > 5) {
            historiqueRecherches.pop();
        }
    }
    afficherHistorique();
}

function afficherHistorique() {
    conteneurHistorique.innerHTML = historiqueRecherches.map(nom => `
        <div onclick="recupererPokemon(creerUrl('${nom}'))">${nom}</div>
    `).join('');
}

boutonRecherche.addEventListener('click', rechercherPokemon);
champRecherche.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        rechercherPokemon();
    }
});

fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
    .then(reponse => reponse.json())
    .then(donnees => {
        const pokemonsAleatoires = [];
        while (pokemonsAleatoires.length < 5) {
            const indexAleatoire = Math.floor(Math.random() * donnees.results.length);
            if (!pokemonsAleatoires.some(p => p.name === donnees.results[indexAleatoire].name)) {
                pokemonsAleatoires.push(donnees.results[indexAleatoire]);
            }
        }
        conteneurAleatoire.innerHTML = pokemonsAleatoires.map(p => `
            <div onclick="recupererPokemon(creerUrl('${p.name}'))">${p.name}</div>
        `).join('');
    });