/* tslint:disable:no-unused-expression */
import { flags, SfdxCommand } from '@salesforce/command';
import { CommunitiesRestResult } from './../../../shared/typeDefs';

export default class CommunityPublish extends SfdxCommand {

  public static description = 'Publish a community using a headless browser';

  protected static requiresUsername = true;

  protected static flagsConfig = {
    name: flags.string({char: 'n', description: 'name of the community to publish'})
  };

  public async run(): Promise<any> { // tslint:disable-line:no-any

    const conn = this.org.getConnection();
    const communitiesList = <CommunitiesRestResult> <unknown> await conn.request(`${conn.baseUrl()}/connect/communities/`);
    const filteredCommunities = communitiesList.communities.filter(c => {
      if ( c.siteAsContainerEnabled === false ) {
        // This is a Site without a Community
        return false;
      }
      if ( this.flags.name && this.flags.name.length > 0 && c.name !== this.flags.name ) {
        // We have selected a specific community and this is not it
        return false;
      }
      return true;
    });

    if ( filteredCommunities.length === 0 ) {
      // TODO: return error
      let commError = 'No communities found';
      if ( this.flags.name ) {
        commError = `No communities matching "${this.flags.name}" in found communities [${communitiesList.communities.map(c => c.name)}]`;
      }
      throw Error(commError);
      // console.log('No matching communities found',this.flags.name);
      // return;
    }
    const promises = [];
    this.ux.startSpinner(`Publishing communities via rest api [${filteredCommunities.map(c => c.name)}]...`);
    for ( const c of filteredCommunities ) {
      const publishUrl = `${conn.baseUrl()}/connect/communities/${c.id}/publish`;
      await conn.request({
        method: 'POST',
        url: publishUrl,
        body: '{}'
      });
    }
    await Promise.all(promises);
    this.ux.stopSpinner('done');
  }
}
