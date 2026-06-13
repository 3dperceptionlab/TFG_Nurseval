import { Component, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Header } from "../../shared/header/header";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { form, FormField, required, email, submit, disabled, hidden } from '@angular/forms/signals';
import { RegisterData } from '../../models/forms.model';

@Component({
  selector: 'app-register',
  imports: [Header, RouterLink, CommonModule, FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerModel = signal<RegisterData>({
    email: '',
    password: '',
    repassword: '',
    name:'',
    surname: '',
    role: 'student',
    position:'',
    student_group: 1,
    student_course: '',
  });

  registerForm = form(this.registerModel, (path) => {
    required(path.email, {message: 'Este campo es obligatorio.'});
    required(path.password, {message: 'Este campo es obligatorio.'});
    required(path.repassword, {message: 'Este campo es obligatorio.'});
    required(path.name, {message: 'Este campo es obligatorio.'});
    required(path.surname, {message: 'Este campo es obligatorio.'});
    email(path.email, {message: 'El email no es válido.'});
    hidden(path.position, {when: ({valueOf}) => valueOf(path.role) === 'student' });
    hidden(path.student_group, {when: ({valueOf}) => valueOf(path.role) === 'professor' });
    hidden(path.student_course, {when: ({valueOf}) => valueOf(path.role) === 'professor' });
  });

  setRole(role: string) {
    this.registerForm.role().value.set(role);
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    await submit(this.registerForm, async (validValues) => {
      try {
        console.log('Datos válidos listos para enviar:', this.registerModel());
        
        this.registerForm().reset();
      } catch (error) {
        console.error("Error enviando el formulario", error);
      }
    });
  }

}
