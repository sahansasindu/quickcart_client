import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {SecurityHeaderComponent} from "../security-header/security-header.component";
import {FooterComponent} from "../../../process/component/footer/footer.component";

@Component({
  selector: 'app-security-context',
  standalone: true,
  imports: [
    RouterOutlet,
    SecurityHeaderComponent,
    FooterComponent
  ],
  templateUrl: './security-context.component.html',
  styleUrl: './security-context.component.scss'
})
export class SecurityContextComponent {

}
