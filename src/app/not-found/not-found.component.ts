import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.component.html',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {}
