import { flags, SfdxCommand } from '@salesforce/command';
import chalk from 'chalk';
import { writeJSONasXML } from '../../../shared/JSONXMLtools';
import { removeTrailingSlash } from '../../../shared/flagParsing';

import fs = require('fs-extra');

export default class ObjectTab extends SfdxCommand {
    public static description = 'create a tab from a custom object, and you have to pick an icon';

    public static examples = [
        `sfdx shane:object:tab -o SomeObject__c -i 86
// create a tab for the object using icon #86 from https://lightningdesignsystem.com/icons/#custom
`
    ];

    protected static flagsConfig = {
        object: flags.string({ char: 'o', required: true, description: 'object api name' }),
        icon: flags.integer({
            char: 'i',
            required: true,
            min: 1,
            max: 100,
            description: 'icon number from https://lightningdesignsystem.com/icons/#custom but only up to 100'
        }),
        target: flags.directory({
            char: 't',
            default: 'force-app/main/default',
            description: "where to create the folder (if it doesn't exist already) and file...defaults to force-app/main/default",
            parse: input => removeTrailingSlash(input)
        })
    };

    protected static requiresProject = true;

    public async run(): Promise<any> {
        // make sure the tabs directory exists
        await fs.ensureDir(`${this.flags.target}/tabs`);

        await writeJSONasXML({
            path: `${this.flags.target}/tabs/${this.flags.object}.tab-meta.xml`,
            type: 'CustomTab',
            json: {
                '@': {
                    xmlns: 'http://soap.sforce.com/2006/04/metadata'
                },
                customObject: true,
                motif: tabDefs.find(tab => tab.includes(`Custom${this.flags.icon}:`))
            }
        });
        this.ux.log(chalk.green('Tab created locally.'));
    }
}

const tabDefs = [
    'Custom20: Airplane',
    'Custom25: Alarm clock',
    'Custom51: Apple',
    'Custom52: Balls',
    'Custom16: Bank',
    'Custom53: Bell',
    'Custom50: Big top',
    'Custom54: Boat',
    'Custom55: Books',
    'Custom56: Bottle',
    'Custom13: Box',
    'Custom37: Bridge',
    'Custom24: Building',
    'Custom57: Building Block',
    'Custom58: Caduceus',
    'Custom38: Camera',
    'Custom59: Can',
    'Custom31: Car',
    'Custom61: Castle',
    'Custom49: CD/DVD',
    'Custom28: Cell phone',
    'Custom62: Chalkboard',
    'Custom47: Knight',
    'Custom63: Chip',
    'Custom12: Circle',
    'Custom64: Compass',
    'Custom21: Computer',
    'Custom40: Credit card',
    'Custom99: TV CRT',
    'Custom65: Cup',
    'Custom33: Desk',
    'Custom8: Diamond',
    'Custom66: Dice',
    'Custom32: Factory',
    'Custom2: Fan',
    'Custom26: Flag',
    'Custom18: Form',
    'Custom67: Gears',
    'Custom68: Globe',
    'Custom69: Guitar',
    'Custom44: Hammer',
    'Custom14: Hands',
    'Custom70: Handsaw',
    'Custom71: Headset',
    'Custom1: Heart',
    'Custom72: Helicopter',
    'Custom4: Hexagon ',
    'Custom73: Highway Sign',
    'Custom74: Hot Air Balloon',
    'Custom34: Insect',
    'Custom75: IP Phone',
    'Custom43: Jewel',
    'Custom76: Keys',
    'Custom27: Laptop',
    'Custom5: Leaf',
    'Custom9: Lightning',
    'Custom77: Locked',
    'Custom23: Envelope',
    'Custom78: Map',
    'Custom79: Measuring Tape',
    'Custom35: Microphone',
    'Custom10: Moon',
    'Custom80: Motorcycle',
    'Custom81: Musical Note',
    'Custom29: PDA',
    'Custom83: Pencil',
    'Custom15: People',
    'Custom22: Telephone',
    'Custom46: Stamp',
    'Custom84: Presenter',
    'Custom30: Radar dish',
    'Custom85: Real Estate Sign',
    'Custom86: Red Cross',
    'Custom17: Sack',
    'Custom87: Safe',
    'Custom88: Sailboat',
    'Custom89: Saxophone',
    'Custom90: Scales',
    'Custom91: Shield',
    'Custom92: Ship',
    'Custom93: Shopping Cart',
    'Custom7: Square',
    'Custom41: Cash',
    'Custom11: Star',
    'Custom94: Stethoscope',
    'Custom95: Stopwatch',
    'Custom96: Street Sign',
    'Custom3: Sun',
    'Custom39: Telescope',
    'Custom97: Thermometer',
    'Custom45: Ticket',
    'Custom36: Train',
    'Custom42: Treasure chest',
    'Custom6: Triangle',
    'Custom48: Trophy',
    'Custom98: Truck',
    'Custom100: TV Widescreen',
    'Custom60: Umbrella',
    'Custom82: Whistle',
    'Custom19: Wrench'
];
