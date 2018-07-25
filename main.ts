import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef,Component, ComponentRef, NgModule, NgZone, ComponentFactoryResolver, Injector, NgModuleRef, ReflectiveInjector } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  element : any = document.getElementsByClassName("floating-chat");
  myStorage : any = localStorage;
  openElement() : void {
      let messages : any = this.element[0].querySelector(".messages");
      let textInput : any = this.element[0].querySelector(".text-box");
      this.element[0].querySelector("i").style.display = 'none';
      this.element[0].classList.add("expand");
      this.element[0].querySelector(".chat").classList.add("enter");
      
      textInput.addEventListener('keydown', function() {
        textInput.disabled = true;
        textInput.focus();
      })
      this.element[0].removeEventListener('click', this.openElement);
      this.element[0].querySelector(".header button").addEventListener('click', this.closeElement);
      messages.scrollTop = messages.scrollHeight;
    
  }

  createUUID() : void {
    let  uuid : string = "";
      let s : string[] = [];
      let hexDigits : string = "0123456789abcdef";
      for (let i : number = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
       uuid = s.join("");
  }
  
  closeElement() : void {
      this.element = document.getElementsByClassName("floating-chat");
      this.element[0].querySelector('.chat').classList.remove("enter");
      this.element[0].querySelector('.chat').style.display = 'none';
      this.element[0].querySelector('i').style.display = 'block';
      this.element[0].querySelector('.header button').removeEventListener('click', this.closeElement);
      this.element[0].querySelector('.text-box').removeEventListener('keydown', function() {
        // this.onMetaAndEnter();
        this.element[0].querySelector('.text-box').disabled =  true;
        this.element[0].querySelector('.text-box').blur();
      })
      let self : any = this;
      setTimeout(function() {
          self.element[0].querySelector('.chat').classList.remove('enter');
          self.element[0].classList.remove('expand');
          self.element[0].querySelector('.chat').style.display = 'block';
          self.element[0].addEventListener('click', self.openElement);
          self.element[0].querySelector('i').style.display = 'block';

      }, 500);
  }


  sendNewMessage() : void {
      let userInput : any = document.getElementsByClassName("text-box")[0];
      let newMessage : string = userInput.innerHTML.replace(/\<div\>|\<br.*?\>/ig, '\n').replace(/\<\/div\>/g, '').trim().replace(/\n/g, '<br>');

      if (!newMessage) return;

      let messagesContainer : any = document.getElementsByClassName("messages")[0];
      messagesContainer.innerHTML += "<li _ngcontent-c0 class='self'>"+newMessage+"</li>";
       this.http.post("http://192.168.1.239:8081/check", JSON.stringify({query: userInput.innerHTML})).map((response) => response.json()
      ).subscribe(data => {
        // clean out old message
        userInput.innerHTML = '';
        // focus on input
        userInput.focus();

         messagesContainer.innerHTML += "<li _ngcontent-c0 class='other'>"+data.answer+"</li>";
        messagesContainer.animate({
            scrollTop: messagesContainer.scrollHeight
        }, 250);
      })

  }

  constructor(private http: Http) {
    if (!this.myStorage.getItem('chatID')) {
        this.myStorage.setItem('chatID', this.createUUID());
    }
    let self : any = this;
    setTimeout(function() {
      let name : string = "enter";
        let arr : string[] = self.element[0].className.split(" ");
        if (arr.indexOf(name) == -1) {
            self.element[0].className += " " + name;
        }
    }, 1000);


    document.addEventListener('click', function() {
           self.openElement();
      
      });
  }       
}
 
@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [AppComponent],
  imports: [
    BrowserModule,
    HttpModule
  ]
})


export class AppModule {
  ngDoBootstrap() { }
}

platformBrowserDynamic().bootstrapModule(AppModule).then((ngModuleRef: NgModuleRef<AppModule>) => {

  let appRef: ApplicationRef = ngModuleRef.injector.get(ApplicationRef);
  let componentFactoryResolver = ngModuleRef.componentFactoryResolver;

  setTimeout(() => {
      let componentFactory = ngModuleRef.componentFactoryResolver.resolveComponentFactory(AppComponent);
      let componentRef = componentFactory.create(ngModuleRef.injector, [], document.querySelector('hello'));
      appRef.attachView(componentRef.hostView);
  }, 0);

});
