const componentFinder = (full, id: string): number[] => {
    let output = [];

    full.regions.forEach((region, regionIndex) => {
        if (!output.length && region.components) {
            const result = searchRegion(region, id, [regionIndex]);
            if (result.matchedComponentIndex > -1) {
                output = result.accumulatedArray;
            }
            // output.matchedComponentIndexes = region.components.findIndex(component => component.id === this.flags.id);
            // if (output.matchedComponentIndexes > -1) {
            //     output.matchedRegionIndexes = regionIndex;
            //     return output;
            // } else {
            //     if (this.flags.verbose) {
            //         this.ux.log('no matching component found');
            //     }
            // }
        }
        // if (output.matchedComponentIndexes === -1) {
        //     throw new Error('no component was found matching that id');
        // }
    });
    return output;
};

interface IndexObject {
    matchedRegionIndexes: number[];
    matchedComponentIndexes: number[];
}

const searchRegion = (region, id, accumulatedArray = []): RegionSearchOutput => {
    // console.log(`searching region ${region.regionName} with accumulated ${accumulatedArray}`);
    let currentComponentIndex = 0;
    for (const component of region.components) {
        // console.log(`testing ${component.componentName} to match ${id}`);
        if (component.id === id) {
            return {
                matchedComponentIndex: currentComponentIndex,
                accumulatedArray: [...accumulatedArray, currentComponentIndex]
            };
        }
        if (component.regions) {
            // special case where components are nested in other components
            let currentRegionIndex = 0;
            for (const subregion of component.regions) {
                // console.log(`searching subregion ${subregion.regionName}`);
                const subRegionResult = searchRegion(subregion, id, [...accumulatedArray, currentComponentIndex, currentRegionIndex]);
                if (subRegionResult.matchedComponentIndex > -1) {
                    // console.log(
                    //     `found matching subregion! returning ${subRegionResult.matchedComponentIndex} with accumulated array ${subRegionResult.accumulatedArray}`
                    // );
                    return {
                        matchedComponentIndex: subRegionResult.matchedComponentIndex,
                        accumulatedArray: subRegionResult.accumulatedArray
                    };
                }
                currentRegionIndex++;
            }
        } else {
            currentComponentIndex++;
        }
    }
    return {
        matchedComponentIndex: -1,
        accumulatedArray
    };
};

const replaceProperty = (full, address: number[], prop: string, update) => {
    if (address.length === 2) {
        full.regions[address[0]].components[address[1]].componentAttributes[prop] = update;
    } else if (address.length === 4) {
        full.regions[address[0]].components[address[1]].regions[address[2]].components[address[3]].componentAttributes[prop] = update;
    } else if (address.length === 6) {
        full.regions[address[0]].components[address[1]].regions[address[2]].components[address[4]].componentAttributes[prop].regions[
            address[5]
        ].components[address[6]] = update;
    } else {
        throw new Error('wow, that is a really complex json structure you got there.  I give up.');
    }
    return full;
};

const getByAddress = (full, address: number[], prop: string) => {
    let input = full;
    for (let i = 0; i < address.length; i += 2) {
        input = input.regions[address[i + 0]].components[address[i + 1]];
    }
    return input.componentAttributes[prop];
};

interface RegionSearchOutput {
    matchedComponentIndex: number;
    accumulatedArray: number[];
}

export { componentFinder, IndexObject, searchRegion, getByAddress, replaceProperty };
