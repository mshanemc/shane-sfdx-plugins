/* tslint:disable:no-unused-expression */

import { isDataSetANumber } from '../../src/shared/ai/datasetGet';

describe('can match numbers', () => {
    test('numbers', () => {
        expect(isDataSetANumber(1234)).toBe(true);
    });

    test('numbers as string', () => {
        expect(isDataSetANumber('1234')).toBe(true);
    });

    test('text as string', () => {
        expect(isDataSetANumber('xxxx')).toBe(false);
    });

    test('undefined', () => {
        expect(isDataSetANumber(undefined)).toBe(false);
    });

    test('empty', () => {
        expect(isDataSetANumber('')).toBe(false);
    });

    test('null', () => {
        expect(isDataSetANumber(null)).toBe(false);
    });
});
