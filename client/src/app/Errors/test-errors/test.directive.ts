import { Directive, ElementRef, HostBinding, HostListener, OnInit, Renderer2 } from "@angular/core";


@Directive({
    selector : '[testDirective]'
})

export class TestDirective implements OnInit{

    constructor(private elRef : ElementRef , private render : Renderer2){}

    ngOnInit(){}

    

      @HostBinding('class.open') isopen = false;

     

      @HostListener('document : click', ['$event']) overcolor(event : Event) {
        this.isopen = this.elRef.nativeElement.contains(event.target) ? this.isopen : false;
        console.log(this.isopen);
      }

    
}