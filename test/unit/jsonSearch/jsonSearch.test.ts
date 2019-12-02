/* tslint:disable:no-unused-expression */

import { componentFinder, getByAddress, searchRegion } from '../../../src/shared/jsonSearch';
import { multiLayer } from './multiLayer';

describe('gets by address', () => {
    test('gets with size 2', () => {
        expect(getByAddress(multiLayer, [0, 0], 'richTextValue')).toContain('<h1 style');
    });
    test('gets with size 2', () => {
        expect(getByAddress(multiLayer, [2, 0], 'label')).toBe('Quick Create');
    });
    test('gets with size 4', () => {
        expect(getByAddress(multiLayer, [1, 0, 0, 0], 'dashboardId')).toBe('0FK0t000000CcxZGAS');
    });
});

describe('tests jsonSearch', () => {
    beforeAll(async () => {});

    test('tests one-layer', () => {
        const result = componentFinder(multiLayer, '114fc28d-2ebb-477f-a5bb-961ac92e42ad');
        expect(result).toEqual([0, 0]);
    });

    test('tests multilayer', () => {
        const result = componentFinder(multiLayer, 'fa69a1ff-6738-4c1e-884a-e321fdbaba1c');
        expect(result).toEqual([1, 0, 0, 0]);
    });

    test('tests no-match', () => {
        const result = componentFinder(multiLayer, 'your mom');
        expect(result).toEqual([]);
    });

    test('tests single-region search', () => {
        const result = searchRegion(multiLayer.regions[0], '114fc28d-2ebb-477f-a5bb-961ac92e42ad', [0]);
        expect(result).toHaveProperty('accumulatedArray', [0, 0]);
        expect(result).toHaveProperty('matchedComponentIndex', 0);
    });

    test('tests single-region search not found', () => {
        const result = searchRegion(multiLayer.regions[0], '1ac92e42114f428d-2ebb-477f-a5bb-96ad', [0]);
        expect(result).toHaveProperty('matchedComponentIndex', -1);
    });

    test('tests single-region recursive search #1', () => {
        // wave dashboard, tab 1
        const result = searchRegion(multiLayer.regions[1], 'fa69a1ff-6738-4c1e-884a-e321fdbaba1c', [1]);
        // console.log(result);
        expect(result).toHaveProperty('matchedComponentIndex', 0);
        expect(result).toHaveProperty('accumulatedArray', [1, 0, 0, 0]);
    });

    test('tests single-region recursive search #2', () => {
        // news and updates, tab 2
        const result = searchRegion(multiLayer.regions[1], 'ce3e4eb2-2b16-4ccb-a483-e34415137c1a', [1]);
        // console.log(result);
        expect(result).toHaveProperty('matchedComponentIndex', 0);
        expect(result).toHaveProperty('accumulatedArray', [1, 0, 1, 0]);
    });

    test('tests single-region recursive search not found', () => {
        const result = searchRegion(multiLayer.regions[1], 'fffffff-6738-4c1e-884a-e321fdbaba1c', [1]);

        expect(result).toHaveProperty('matchedComponentIndex', -1);
    });

    afterAll(async () => {});
});
