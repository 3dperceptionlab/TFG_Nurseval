import { Component, signal, inject } from '@angular/core';
import { Header } from "../../shared/header/header";
import { Router, RouterLink } from "@angular/router";
import { form, FormField, required, email, submit } from '@angular/forms/signals';
import { LoginData } from '../../models/forms.model';
import { Auth } from '../../services/auth.service';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faEye, faEyeSlash, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { WarningMessage } from '../../shared/warning-message/warning-message';

@Component({
  selector: 'app-login',
  imports: [Header, RouterLink, FormField, FaIconComponent, WarningMessage],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  icons = { faEye, faEyeSlash, faCheck, faXmark};

  authService = inject(Auth);
  router = inject(Router);

  isLoading = signal(false);
  hidePassword = signal<boolean>(true);
  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  warningMessage = signal<{ show: boolean; type: 'success' | 'error'; title: string; message: string }>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  loginForm = form(this.loginModel, (u) => {
    required(u.email, {message: 'Este campo es obligatorio.'});
    required(u.password, {message: 'Este campo es obligatorio.'});
    email(u.email, {message: 'El email no es válido.'});
  });

  togglePassword(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    await submit(this.loginForm, async (validValues) => {
      try { 
        this.authService.login(validValues().value()).subscribe({
          next: (response) => {

            this.warningMessage.set({
              show: true,
              type: 'success',
              title: '¡Bienvenido!',
              message: 'Has iniciado sesión correctamente.'
            });
            
            this.loginForm().reset();
            this.isLoading.set(true);

            setTimeout(() => {
              this.router.navigate(['/app/theory']);
              this.clearMessage();
              this.isLoading.set(false);
            }, 2000);
          },
          error: (err) => {
            this.warningMessage.set({
              show: true,
              type: 'error',
              title: 'Error de autenticación',
              message: 'El correo o la contraseña son incorrectos.'
            });

            // Limpiar dejando unos segundos, para que el usuario lo pueda leer
            setTimeout(() => {
              this.clearMessage()
              this.isLoading.set(false);
            }, 4000);
              
          }
        });

        this.loginForm().reset();
      } catch (error) {
        console.error("Error enviando el formulario", error);
      }
    });
  }

  clearMessage() {
    this.warningMessage.update(t => ({ ...t, show: false }));
  }

}
