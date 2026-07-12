import { Component, input } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { warningMessage } from '../../models/warning.model';

@Component({
  selector: 'app-warning-message',
  imports: [FaIconComponent],
  templateUrl: './warning-message.html',
  styleUrl: './warning-message.css',
})
export class WarningMessage {
  icons = {faCheck, faXmark};
  warningMessage = input<warningMessage>();
}
