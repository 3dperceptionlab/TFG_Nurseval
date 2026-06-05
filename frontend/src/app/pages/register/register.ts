import { Component, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Header } from "../../shared/header/header";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [Header, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './register.css',
})
export class Register {
  selectedRole = signal('student');


}
