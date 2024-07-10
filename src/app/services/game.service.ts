import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  firestore: Firestore = inject(Firestore);
  /* game: any; */
  gameID: string = "";
  unsubGame: any;

  constructor() { }

  ngOnDestroy() {
    this.unsubGame();
  }

  newGame() {
    return new Game();
  }

  async addGame(game: any) {
    const docRef = await addDoc(this.getGamesRef(), game.toJSON());
    this.gameID = docRef.id;
    console.log("Game-Firebase-ID", this.gameID);
    /* this.unsubGame = this.readGame(this.gameID, game); */
    return this.gameID;
  }

  //doc() function kann durch getSingleGameRef ersetz werden
  readGame(game: any) {
    return onSnapshot(doc(this.getGamesRef(), this.gameID), (doc) => {
      const data = { ...doc.data() };
      game.players = data['players'];
      game.stack = data['stack'];
      game.playedCards = data['playedCards'];
      game.currentPlayer = data['currentPlayer'];
      game.pickCardAnimation = data['pickCardAnimation'];
      game.currentCard = data['currentCard'];
      /* console.log("readGame() ID: ", doc.id);
      console.log("currentPlayer: ", game.currentPlayer); */
    });
  }

  async saveGame(game: any) {
    await updateDoc(this.getSingleGameRef(this.gameID), game.toJSON());
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  getSingleGameRef(docID: string) {
    return doc(this.getGamesRef(), docID);
  }
}
