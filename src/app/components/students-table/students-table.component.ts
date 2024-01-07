import { TableData, TableRow } from './../table-template/table-template.component';
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { TableTemplateComponent } from '../table-template/table-template.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-students-table',
  standalone: true,
  imports: [CommonModule, TableTemplateComponent],
  templateUrl: './students-table.component.html',
  styleUrl: './students-table.component.css'
})
export class StudentsTableComponent implements OnInit {
  width:number = 0;
  users:User[] = [];
  tableData : TableData = new TableData;
  refreshTable: Subject<boolean> = new Subject<boolean>();
  userService : UserService;

  constructor(userService: UserService) {
    this.tableData.tableColNames = ["ID", "Фамилия, Имя", "Организация", "Город", "Класс"];

    this.userService = userService;

    userService.getAllUsers()
      .subscribe(res => {
        res.forEach(x => this.users.push(x));

        this.users.forEach((user, index) => {
          let tableRow = new TableRow;
          tableRow.contents = [
            user.id, 
            `${user.last_name} ${user.first_name}`,
            user.organization,
            user.city,
            user.grade
          ];
          tableRow.routerLink = `/students/${user.handle}`;

          this.tableData.tableRows.push(tableRow);
          
        });
        
        this.refreshTable.next(true);
      });
  }

  ngOnInit() : void {
    this.width = document.body.clientWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.width = document.body.clientWidth;
  }

  syncDl(){
    this.userService.syncWithDl();
  }

  syncCF(){
    this.userService.syncWithCF(this.users);
  }

}
