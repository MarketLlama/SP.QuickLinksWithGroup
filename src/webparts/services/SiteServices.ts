
import { sp, ItemAddResult, WebEnsureUserResult } from '@pnp/sp';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { MSGraphClient } from '@microsoft/sp-http';

class SiteServices {
  private _client: MSGraphClient = {} as MSGraphClient;

  constructor(context: WebPartContext) {
    sp.setup({
      spfxContext: context
    });
  }

  public checkUserInGroup = async(groupName : string) => {
    return new Promise<boolean>( async (resolve, reject) => {
      try {
        let isInGroup = false;
        if(groupName == ''){
          resolve(isInGroup);
        }
        const groupUsers : any[] = await this._getGroup(groupName);
        const currentUser = await this._getCurrentUser();
        groupUsers.forEach(user =>{
          if(user.LoginName == currentUser.LoginName){
            isInGroup = true;
          }
        });
        resolve(isInGroup);
      } catch (error) {
        console.log(error);
        reject();
      }
    });
  }

  public getSiteGroupNames = () =>{
    return new Promise<string[]>((resolve, reject) => {
      try {
        sp.web.siteGroups.get().then((groups : any[]) =>{
          let groupNames = [];
          console.log(groups);
          groups.forEach(group =>{
            groupNames.push(group.Title);
          });
          resolve(groupNames);
        });
      } catch (error) {
        console.log(error);
        reject();
      }
    });
  }

  private _getGroup = (groupName : string) =>{
    return new Promise<any[]>((resolve, reject) => {
      try {
        sp.web.siteGroups.getByName(groupName).users.get().then((group) =>{
          console.log();
          resolve(group);
        });
      } catch (error) {
        console.log(error);
        reject();
      }
    });
  }

  private _getCurrentUser = () =>{
    return new Promise<any>((resolve, reject) => {
      try {
        sp.web.currentUser.get().then((user : any)=> {
          resolve(user);
        }, error => {
          console.log(error);
          reject();
        });
      } catch (error) {
        console.log(error);
        reject();
      }
    });
  }
}

export default SiteServices;
