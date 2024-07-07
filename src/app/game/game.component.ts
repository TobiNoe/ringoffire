import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Game } from '../models/game';
import { PlayerComponent } from "../player/player.component";
import { MatButtonModule } from '@angular/material/button';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { GameInfoComponent } from './game-info/game-info.component';
import { addDoc, collection, doc, Firestore, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, DialogAddPlayerComponent, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  readonly dialog = inject(MatDialog);
  firestore: Firestore = inject(Firestore);
  pickCardAnimation = false;
  currentCard: string = '';
  game: any;
  gameID: string = "";
  unsubGame: any;


  constructor(private route: ActivatedRoute) {
    this.newGame();
    this.route.params.subscribe((params) => {
      if (params['gameID'] == 'new') {
        this.addGame();
      } else {
        this.unsubGame = this.readGame(params['gameID']);
        console.log("Game:", this.game);
      }
      console.log("URL-ID", params['gameID']);

    });
    /* this.addGame(); */
    /* this.unsubGame = this.readGame(this.gameID); */
  }

  ngOnDestroy() {
    this.unsubGame();
  }

  async addGame() {
    const docRef = await addDoc(this.getGamesRef(), this.game.toJSON());
    this.gameID = docRef.id;
    console.log("Game-Firebase-ID", this.gameID);
    this.unsubGame = this.readGame(this.gameID);
  }

  //doc() function kann durch getSingleGameRef ersetz werden
  readGame(gameID: string) {
    return onSnapshot(doc(this.getGamesRef(), gameID), (doc) => {
      const data = { ...doc.data() }
      this.game.players = data['players'];
      this.game.stack = data['stack'];
      this.game.playedCards = data['playedCards'];
      this.game.currentPlayer = data['currentPlayer'];
      console.log("Current data: ", doc.data());
      /* console.log("Current ID: ", doc.id);
      console.log(data['stack']); */
    });
  }

  /* subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNote = [];
      list.forEach(element => {
        this.trashNote.push(this.setNoteObject(element.data(), element.id));
      });
    });
  } 
 */
  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  getSingleGameRef(docID: string) {
    return doc(this.getGamesRef(), docID);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;

      /* console.log('New Card: ' + this.currentCard);
      console.log('Game is', this.game); */
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;


      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard);
      }, 1250);
    }
  }

  newGame() {
    this.game = new Game();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }

}
