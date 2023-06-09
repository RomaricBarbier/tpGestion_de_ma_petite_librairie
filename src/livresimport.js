//importer la liste de livre
export default class Livreimport {
  constructor(id, titre, qtestock, prix) {
    this._id = id;
    this._titre = titre;
    this._qtestock = qtestock;
    this._prix = prix;
  }
  get titre() {
    return this._titre;
  }
  get id() {
    return this._id;
  }
  get qtestock() {
    return this._qtestock;
  }
  get prix() {
    return this._prix;
  }
  // pour modifier la quantité de livre
  set qtestock(qtestock) {
    this._qtestock = qtestock;
  }
}
