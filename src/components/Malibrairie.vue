<style>
body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-image: url("https://i.pinimg.com/736x/05/00/72/050072230ace0389365cf8bf269ade38.jpg");
}

h1 {
  background-image: linear-gradient(to right, #4b6cb7, #182848);
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  padding: 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  opacity: 0.95;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.formadd {
  background-image: linear-gradient(to left, #4b6cb7, #182848);
  color: #fff;
  opacity: 0.8;
}

.divformadd {
  display: grid;
  align-items: center;
}

.entré {
  margin: 5px;
  padding: 5px;
  border: none;
  border-bottom: 2px solid #1e90ff;
}

.bouton {
  margin: 5px;
  padding: 5px 10px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 5px;
}

.bouton:hover {
  cursor: pointer;
}

.btnsupp {
  margin: 5px;
  padding: 5px 10px;
  background-color: #ff1e1e;
  color: white;
  border: none;
  border-radius: 5px;
}

.btnsupp:hover {
  cursor: pointer;
}

ul {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-auto-rows: minmax(100px, auto);
  grid-gap: 10px;
}

li {
  display: grid;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  padding: 20px;
  opacity: 0.9;
}
</style>

<template>
  <h1>Ma petite librairie</h1>

  <form @submit="addBook(livre)" class="formadd">
    <p>Intégrer un ouvrage au stock</p>
    <div class="divformadd">
      <label for="titre">Titre :</label>
      <input
        id="titre"
        type="text"
        class="entré"
        v-model="livre.titre"
        placeholder="Nom du livre"
        required
      />
    </div>
    <div class="divformadd">
      <label for="qtestock">Quantité :</label>
      <input
        id="qtestock"
        type="number"
        class="entré"
        v-model="livre.qtestock"
        placeholder="Nombre en stock"
        min="1"
        required
      />
    </div>
    <div class="divformadd">
      <label for="prix">Prix :</label>
      <input
        id="prix"
        type="number"
        class="entré"
        step="any"
        v-model="livre.prix"
        placeholder="Prix boutique"
        min="1"
        required
      />
    </div>

    <input type="submit" value="Ajouter" class="bouton" />
  </form>

  <ul>
    <li v-for="livre in listeLivres" :key="[livre.id]">
      <h4>{{ livre.titre }}</h4>
      <div>{{ livre.qtestock }} livres en stock</div>
      <div>Prix : {{ livre.prix }} €</div>
      <div>
        <button
          @click="
            livre.qtestock == 1 ? deleteLivre(livre.id) : retirerLivre(livre)
          "
          class="bouton"
        >
          -
        </button>
        <button @click="ajouterLivre(livre)" class="bouton">+</button>
      </div>

      <button @click="deleteLivre(livre.id)" class="btnsupp">Supprimer</button>
    </li>
  </ul>
</template>



<script setup>
import { reactive, watch, defineProps } from "vue";
import Livreimport from "../livresimport.js"; //importe les détails pour l'importation des livres de la librairie
import livresearch from "./livresearch.vue";
let url = "https://webmmi.iut-tlse3.fr/~pecatte/librairies/public/2/livres";
//liste des livres
const listeLivres = reactive([]);
const props = defineProps(["critere"]);
const livre = reactive(Livreimport);

watch(props, (newprops) => {
  livresearch(newprops.critere);
});

// fonction permettant de récupérer les livres
function shearchBook(motcle) {
  if (motcle) {
    url =
      "https://webmmi.iut-tlse3.fr/~pecatte/librairies/public/2/livres?search=" +
      motcle;
  }
  const fetchOptions = { method: "GET" };
  fetch(url, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((dataJSON) => {
      console.log(dataJSON);
      listeLivres.splice(0, listeLivres.length);
      dataJSON.forEach((v) =>
        listeLivres.push(new Livreimport(v.id, v.titre, v.qtestock, v.prix))
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

function addBook(l) {
  //fonction qui permet de rajouter un livre
  console.log(l);

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const fetchOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      titre: l.titre,
      qtestock: l.qtestock,
      prix: l.prix,
    }),
  };
  fetch(url, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((dataJSON) => {
      console.log(dataJSON);
      shearchBook();
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteLivre(index) {
  //fonction qui permet de suprimmer un livre
  const fetchOptions = { method: "DELETE" };
  fetch(url + "/" + index, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((dataJSON) => {
      console.log(dataJSON);
      shearchBook();
    })
    .catch((error) => {
      console.log(error);
    });
}

function retirerLivre(livre) {
  //fonction qui permet de retirer 1 en quantité à un livre
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const fetchOptions = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify({
      id: livre.id,
      titre: livre.titre,
      qtestock: livre.qtestock - 1,
      prix: livre.prix,
    }),
  };
  fetch(url, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((dataJSON) => {
      console.log(dataJSON);
      shearchBook();
    })
    .catch((error) => {
      console.log(error);
    });
}

function ajouterLivre(livre) {
  //fonction qui permet de ajouter 1 en quantité à un livre
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const fetchOptions = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify({
      id: livre.id,
      titre: livre.titre,
      qtestock: livre.qtestock + 1,
      prix: livre.prix,
    }),
  };
  fetch(url, fetchOptions)
    .then((response) => {
      return response.json();
    })
    .then((dataJSON) => {
      console.log(dataJSON);
      shearchBook();
    })
    .catch((error) => {
      console.log(error);
    });
}

shearchBook();
</script>