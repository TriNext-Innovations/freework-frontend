import { Component, AfterViewInit } from '@angular/core';
import { particlesConfig } from '../../particles-config';
import {RouterLink} from "@angular/router";

declare const particlesJS: (elementId: string, config: unknown, callback?: () => void) => void;

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof particlesJS === 'function') {
      particlesJS('particles-js', particlesConfig, () => {
        console.log('callback - particles.js config loaded');
      });
    } else {
      console.warn('particlesJS is not available. Check that particles.js is loaded.');
    }
  }
}
