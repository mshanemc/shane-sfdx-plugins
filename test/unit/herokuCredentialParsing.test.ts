import { credentialParser } from '../../src/shared/herokuConnectApi';

const exampleCredentials = 'User:a4f83e5a3eb243559bc1c83afdba0311Password: b203f027b3694eb98f7ae393619f0593';
// const exampleCredentialsWithQuotes = 'User:a4f83e5a3eb243559bc1c83afdba0311Password: b203f027b3694eb98f7ae393619f0593';

describe('test credential parsing', () => {
    test('no quotes', () => {
        const result = credentialParser(exampleCredentials);

        expect(result.password).toBe('b203f027b3694eb98f7ae393619f0593');
        expect(result.username).toBe('a4f83e5a3eb243559bc1c83afdba0311');
    });
    // test('quotes', () => {
    //     const result = credentialParser(exampleCredentials);

    //     expect(result.password).toBe('b203f027b3694eb98f7ae393619f0593');
    //     expect(result.username).toBe('a4f83e5a3eb243559bc1c83afdba0311');
    // });
});
