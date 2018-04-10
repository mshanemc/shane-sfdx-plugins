import { expect, test } from '@salesforce/command/dist/test';

describe('hello:org', () => {
  test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest(function() {
      return Promise.resolve({ records: [ { Name: 'Super Awesome Org', TrialExpirationDate: '2018-03-20T23:24:11.000+0000'}]});
    })
    .stdout()
    .command(['hello:org', '--targetusername', 'test@org.com'])
    .it('runs hello:org --targetusername test@org.com', (ctx) => {
      expect(ctx.stdout).to.contain('Hello world! This is org: Super Awesome Org and I will be around until Tue Mar 20 2018!');
    });
});
