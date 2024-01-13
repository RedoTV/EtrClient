import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-patch-user-interface',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patch-user-interface.component.html',
  styleUrl: './patch-user-interface.component.css'
})
export class PatchUserInterfaceComponent implements AfterViewChecked {

  @ViewChild('selector') selectorEl : ElementRef = null!;
  @ViewChild('handleInput') handleInputEl : ElementRef = null!;
  @ViewChild('newValInput') newValInputEl : ElementRef = null!;
  @ViewChild('errorMsg') errorMsgEl : ElementRef = null!;

  constructor(private userService : UserService) {}

  ngAfterViewChecked() {}

  submitAndSend() {
    let userHandle = this.handleInputEl.nativeElement.value;
    if (userHandle === '')
    {
      this.errorMsgEl.nativeElement.innerText = "Укажите ник (handle) пользователя";
      return;
    }

    let newValue = this.newValInputEl.nativeElement.value;
    if (newValue === '')
    {
      this.errorMsgEl.nativeElement.innerText = "Пожалуйста, задайте новое значение.";
      return;
    }

    let user : User | null = null;
    this.userService.getUserByHandle(userHandle).subscribe(obs => {
      console.log(obs);
      if (obs.length != 0)
      {
        user = obs[0];
        if (user === null) {
          this.errorMsgEl.nativeElement.innerText = "Такой пользователь не найден!";
          return;
        }
        else {
          this.errorMsgEl.nativeElement.innerText = "";

          let accessedPropery : keyof User = this.selectorEl.nativeElement.value;
          if (typeof(user[accessedPropery]) === "string")
            (user[accessedPropery] as string) = `${this.newValInputEl.nativeElement.value}`;
          

          this.userService.patchUser(user);
        }
      }
    });

    


  }
}
