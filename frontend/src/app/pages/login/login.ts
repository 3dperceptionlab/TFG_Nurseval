import { Component } from '@angular/core';
import { Header } from "../../shared/header/header";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [Header, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

}
