import { Component, inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { GameComponent } from '../game/game.component';
import { GameService } from '../services/game.service';


@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {


  constructor(private gameservice: GameService, private router: Router) {

  }

  async newGame() {
    const newGameInstance = this.gameservice.newGame();

    try {
      const id = await this.gameservice.addGame(newGameInstance);
      /* console.log('start-screen ', id); */
      this.router.navigateByUrl('/game/'+ id);

    } catch (error) {
      console.error('Fehler beim Hinzufügen des Spiels: ', error);
    }
  }

}
