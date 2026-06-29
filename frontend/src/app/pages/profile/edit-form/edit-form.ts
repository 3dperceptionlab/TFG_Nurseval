import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faXmark, faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';
import { EditProfileData } from '../../../models/forms.model';
import { applyWhen, form, required, submit, FormField, minLength, pattern, validate } from '@angular/forms/signals';
import { Auth } from '../../../services/auth.service';
import { StudentService } from '../../../services/students.service';
import { ProfessorService } from '../../../services/professor.service';
import { WarningMessage } from '../../../shared/warning-message/warning-message';

@Component({
  selector: 'app-edit-form',
  imports: [FontAwesomeModule, FormField, WarningMessage],
  templateUrl: './edit-form.html',
  styleUrl: './edit-form.css',
})
export class EditForm {
   icons = { faXmark, faUser, faLock };

  authService = inject(Auth);
  studentService = inject(StudentService);
  professorService = inject(ProfessorService);

  userData = input<any>({});
  close = output<void>();  // el padre escucha esto para cerrar

  warningMessage = signal<{ show: boolean; type: 'success' | 'error'; title: string; message: string }>({
    show: false, type: 'success', title: '', message: ''
  });

  profileModel = signal<EditProfileData>({
    name: '', surname: '', currentpassword: '', newpassword: '', repassword: ''
  });

  profileForm = form(this.profileModel, (path) => {
    required(path.name, { message: 'El nombre es obligatorio.' });
    required(path.surname, { message: 'Los apellidos son obligatorios.' });
    applyWhen(
      path.newpassword,
      ({ valueOf }) => !!valueOf(path.currentpassword),
      (p) => {
        required(p, { message: 'Introduce la nueva contraseña.' });
        minLength(p, 8, { message: 'La contraseña debe tener al menos 8 caracteres.' });
        pattern(p, /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/, { 
          message: 'Debe contener mayúsculas, minúsculas, un número y un carácter especial.' 
        });
      }
    );

    applyWhen(
      path.repassword,
      ({ valueOf }) => !!valueOf(path.currentpassword),
      (p) => {
        required(p, { message: 'Repite la nueva contraseña.' });
        validate(p, ({ value, valueOf }) => {
          const repassword = value();
          const newpassword = valueOf(path.newpassword);
          if (repassword && newpassword && repassword !== newpassword)
            return { kind: 'passwordMismatch', message: 'Las contraseñas no coinciden.' };
          return null;
        });
      }
    );
  });

  constructor() {
    effect(() => {
      const u = this.userData();
      this.profileModel.set({
        name: u.name ?? '',
        surname: u.surname ?? '',
        currentpassword: '',
        newpassword: '',
        repassword: ''
      });
    });
  }

  clearMessage() {
    this.warningMessage.update(t => ({ ...t, show: false }));
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    await submit(this.profileForm, async (validValues) => {
      try {
        const formValues = validValues().controlValue() as EditProfileData;
        const role = this.authService.userRole();

        if (formValues.newpassword && formValues.newpassword !== formValues.repassword) {
          this.warningMessage.set({ show: true, type: 'error', title: 'Error', message: 'Las contraseñas nuevas no coinciden.' });
          setTimeout(() => this.clearMessage(), 4000);
          return;
        }

        if (role === 'student') {
          const payload: any = { name: formValues.name, surname: formValues.surname };
          if (formValues.newpassword) {
            payload.currentpassword = formValues.currentpassword;
            payload.newpassword = formValues.newpassword;
            payload.repassword = formValues.repassword;
          }
          await firstValueFrom(this.studentService.updateProfile(payload));
          this.studentService.profileResource.reload();

        } else if (role === 'professor') {
          const payload: any = {
            name: formValues.name,
            surname: formValues.surname,
          };
          if (formValues.newpassword) {
            payload.currentpassword = formValues.currentpassword;
            payload.newpassword = formValues.newpassword;
            payload.repassword = formValues.repassword;
          }
          await firstValueFrom(this.professorService.updateProfile(payload));
          this.professorService.profileResource.reload();
        }

        this.warningMessage.set({ show: true, type: 'success', title: '¡Guardado!', message: 'Tu perfil se ha actualizado correctamente.' });
        setTimeout(() => {
          this.clearMessage();
          this.profileForm().reset();
          this.close.emit();  // avisa al padre para cerrar
        }, 2000);

      } catch (error: any) {
        this.warningMessage.set({ show: true, type: 'error', title: 'Error', message: error?.error ?? 'No se pudieron guardar los cambios.' });
        setTimeout(() => this.clearMessage(), 4000);
      }
    });
  }

}
