import { credentialParser } from '../../src/shared/herokuConnectApi';

const exampleCreds = 'User:a4f83e5a3eb243559bc1c83afdba0311Password: b203f027b3694eb98f7ae393619f0593';
// const exampleCredsWithQuotes = 'User:a4f83e5a3eb243559bc1c83afdba0311Password: b203f027b3694eb98f7ae393619f0593';

describe('test credential parsing', () => {
    test('no quotes', () => {
        const result = credentialParser(exampleCreds);

        expect(result.password).toBe('b203f027b3694eb98f7ae393619f0593');
        expect(result.username).toBe('a4f83e5a3eb243559bc1c83afdba0311');
    });
    // test('quotes', () => {
    //     const result = credentialParser(exampleCreds);

    //     expect(result.password).toBe('b203f027b3694eb98f7ae393619f0593');
    //     expect(result.username).toBe('a4f83e5a3eb243559bc1c83afdba0311');
    // });
});
