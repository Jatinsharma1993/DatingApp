import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Member } from "../model/member";
import { MembersService } from "../_services/members.service";

@Injectable({
    providedIn : 'root'
})
export class MemberDetailResolver implements Resolve<Member>{

    constructor(private memberServ : MembersService){}
    resolve(route: ActivatedRouteSnapshot): Observable<Member> {
        return this.memberServ.getMember(route.paramMap.get('username'));
    }
    
}