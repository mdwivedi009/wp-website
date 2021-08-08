import { Component, OnInit } from '@angular/core';
import { Hero } from '../../modules/heroes/shared/hero.model';
import { AppConfig } from '../../configs/app.config';
import { Observable } from 'rxjs';
import { defaultIfEmpty, map } from 'rxjs/operators';
import { CommonService } from 'src/app/modules/core/services/common.service';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import { CreatePromptsComponent } from 'src/app/components/create-prompts/create-prompts.component';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})

export class HomePageComponent implements OnInit {
  genre:any;
  sortAttribute:any;

  constructor(private authService: AuthService, 
    private _service: CommonService,
    private dialog: MatDialog,
    ) {
  }

  ngOnInit() {  }

  openDialog() {
    const dialogRef = this.dialog.open(CreatePromptsComponent);
  }

  selectGenre(event) {
    this.genre = event.value
  }

  sortBy(event) {
    this.sortAttribute = event.value
  }
}
