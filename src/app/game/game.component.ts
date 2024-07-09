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
import { GameService } from '../services/game.service';

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
  /* gameID: string = ""; */
  /* unsubGame: any; */


  constructor(private gameservice: GameService, private route: ActivatedRoute) {
    this.newGame();
    this.route.params.subscribe((params) => {
      gameservice.gameID = params['gameID'];
      gameservice.unsubGame = gameservice.readGame(this.game);

      console.log("Game.Component:", this.game);
      console.log("URL-ID", gameservice.gameID);

    });
    /* this.addGame(); */
    /* this.unsubGame = this.readGame(this.gameID); */
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.gameservice.saveGame(this.game);

      setTimeout(() => {
        this.pickCardAnimation = false;
        this.game.playedCards.push(this.currentCard);
        this.gameservice.saveGame(this.game);
      }, 1250);
    }
  }

  newGame() {
    this.game = this.gameservice.newGame();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.gameservice.saveGame(this.game);
      }
    });
  }

}
