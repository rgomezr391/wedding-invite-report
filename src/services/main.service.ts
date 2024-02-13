import { Injectable } from '@angular/core';
import { CosmosClient } from '@azure/cosmos';
// import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  COSMOS_DB_MASTER_KEY="YJsTL2nJwCwqYhKsSpaJ03l8bvLaHX2eJxHWPX0bJUNcXMj5OO3xDBvoBliTm2lxTfzubvpwc3shACDbh1527A=="

  client = new CosmosClient({
    endpoint: "https://wedding-invite-app.documents.azure.com",
    key: this.COSMOS_DB_MASTER_KEY
  });

  constructor() { 
  }

  public async getUserById(userId: string) {
    const { resource: user } = await this.client.database("wedding-invite-db").container("guests").item(userId).read();
    return user;
  }

  public async getFamilyMembers(familyId: string) {
    const querySpec = {
      query: "SELECT * FROM guests g WHERE  g.family_id = @familyId",
      parameters: [
        {
          name: "@familyId",
          value: familyId
        }
      ]
    };
  
    const { resources: results } = await this.client.database("wedding-invite-db").container("guests").items.query(querySpec).fetchAll();
  
    if (results.length === 0) {
      return [];
    } else {  
      return results;
    }
  }

  public async upsertGuest(guest: any) {
    const { resource: updatedGuest } = await this.client.database("wedding-invite-db").container("guests").items.upsert(guest);
    return updatedGuest;
  }

  public async generateInviteLinksForGuests() {
    const { resources: guests } = await this.client.database("wedding-invite-db").container("guests").items.query('SELECT * from c').fetchAll();

    guests.forEach(async guest => {
      if (!guest.inviteUrl) {
        debugger
        guest.invite_url = "https://www.bodagomezmurillo.site/?userId=" + guest.id;
        await this.client.database("wedding-invite-db").container("guests").items.upsert(guest);
      }

    });
  }

  public async getGuests() {
    const { resources: guests } = await this.client.database("wedding-invite-db").container("guests").items.query('SELECT * from c').fetchAll();
    return guests;
  }

}
