
import { Component, OnInit } from '@angular/core';
import { Message } from '../model/Message';
import { Pagination } from '../model/Pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages : Message[] = [];
  pagination : Pagination;
  container = "Unread";
  pageNumer = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageSrv : MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.loading = true;
    this.messageSrv.getMessages(this.pageNumer , this.pageSize , this.container).subscribe(response =>{
      
      this.messages = response.result;
      console.log(this.messages);
      this.pagination = response.pagination;
      this.loading = false;
    })
  }

  deleteMessage(id : number)
  {
    this.messageSrv.deleteMessage(id).subscribe(() =>{
      this.messages.splice(this.messages.findIndex(x => x.id), 1);
    })
  }

  pageChanged(event : any){
    this.pageNumer = event.page;
    this.loadMessages();
  }

}
