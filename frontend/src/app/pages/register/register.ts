import { Component, effect, inject, signal, ChangeDetectionStrategy, resource } from '@angular/core';
import { Header } from "../../shared/header/header";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { form, FormField, required, email, submit, disabled, hidden, pattern, validate, ValidationError, validateAsync, min, minLength } from '@angular/forms/signals';
import { RegisterData } from '../../models/forms.model';
import { Auth } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGraduationCap, faBook, faEye, faEyeSlash, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  imports: [Header, RouterLink, CommonModule, FormField, FaIconComponent, FontAwesomeModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  icons = {faGraduationCap, faBook, faEye, faEyeSlash, faCheck, faXmark};

  authService = inject(Auth);
  router = inject(Router);

  isLoading = signal(false);
  hidePassword =signal(true);
  warningMessage = signal<{ show: boolean; type: 'success' | 'error'; title: string; message: string }>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  registerModel = signal<RegisterData>({
    email: '',
    password: '',
    repassword: '',
    name:'',
    surname: '',
    role: 'student',
    position:'',
    student_group: 1,
    student_course: 1,
  });

  registerForm = form(this.registerModel, (path) => {
    required(path.email, {message: 'Este campo es obligatorio.'});
    email(path.email, {message: 'El email no es válido.'});
    validateAsync(path.email, {
      params: ({ value }) => {
        const val = value();
        return val && val.includes('@') ? val : undefined;
      },
      factory: (params) => resource({
        params,
        loader: async ({ params: emailValue }) => {
          return await firstValueFrom(this.authService.checkEmail(emailValue));
        }
      }),
      onSuccess: (exists: boolean) => {
        return exists ? { kind: 'emailTaken', message: 'Este email no es válido.' } : null;
      },
      onError: () => null
    });
    required(path.password, {message: 'Este campo es obligatorio.'});
    minLength(path.password, 8, { message: 'La contraseña debe tener al menos 8 caracteres.' });
    pattern(path.password, /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/, { message: 'Debe contener mayúsculas, minúsculas, un número y un carácter especial.'});
    required(path.repassword, {message: 'Este campo es obligatorio.'});
    validate(path.repassword, ({ value, valueOf }) => {
      const repassword = value();
      const password = valueOf(path.password);
      if (repassword && password && repassword !== password) 
        return { kind: 'passwordMismatch', message: 'Las contraseñas no coinciden.' };
      
      return null;
    });
    required(path.name, {message: 'Este campo es obligatorio.'});
    required(path.surname, {message: 'Este campo es obligatorio.'});
    hidden(path.position, {when: ({valueOf}) => valueOf(path.role) === 'student' });
    hidden(path.student_group, {when: ({valueOf}) => valueOf(path.role) === 'professor' });
    hidden(path.student_course, {when: ({valueOf}) => valueOf(path.role) === 'professor' });
  });

  setRole(role: string) {
    this.registerForm.role().value.set(role);
  }

  togglePassword(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    await submit(this.registerForm, async (validValues) => {
      try {

        await firstValueFrom(this.authService.register(validValues().value()));
        this.isLoading.set(true);
        this.warningMessage.set({
          show: true,
          type: 'success',
          title: '¡Registro completado!',
          message: 'Tu cuenta ha sido creada con éxito. Redirigiendo...'
        });

        this.registerForm().reset();

        setTimeout(() => {
          this.isLoading.set(false);
          this.router.navigate(['/login']);
          this.clearWarning();
        }, 2000);
        
      } catch (error) {
        this.isLoading.set(false);

        this.warningMessage.set({
          show: true,
          type: 'error',
          title: 'Error al registrarse',
          message: 'No se pudo crear la cuenta. Inténtalo de nuevo o usa otro correo.'
        });

        setTimeout(() => this.clearWarning(), 4000);
      }
    });
  }

  clearWarning() {
    this.warningMessage.update(w => ({ ...w, show: false }));
  }

}
