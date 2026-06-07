import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Header } from "../../shared/header/header";
import { RouterLink } from "@angular/router";
import { form, FormField, required, email, submit } from '@angular/forms/signals';
import { LoginData } from '../../models/forms.model';

@Component({
  selector: 'app-login',
  imports: [Header, RouterLink, FormField],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.css',
})
export class Login {

  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (u) => {
    required(u.email, {message: 'Este campo es obligatorio.'});
    required(u.password, {message: 'Este campo es obligatorio.'});
    email(u.email, {message: 'El email no es válido.'});
  });

  async onSubmit(event: Event) {
    event.preventDefault();

    await submit(this.loginForm, async (validValues) => {
      try {
        console.log('Datos válidos listos para enviar:', validValues().controlValue().email, validValues().controlValue().password);
        
        this.loginForm().reset();
      } catch (error) {
        console.error("Error enviando el formulario", error);
      }
    });
  }

}
