/* eslint-disable no-template-curly-in-string */
/* tslint:disable:no-unused-expression */
import { exec, exec2JSON } from '../../../../src/shared/execProm';

import fs = require('fs-extra');
import testutils = require('../../../helpers/testutils');

const testProjectName = 'mshanemc-heroku-xo-1234567890';

describe.skip('shane:heroku:connect', () => {
    jest.setTimeout(testutils.remoteTimeout);

    if (!process.env.LOCALONLY) {
        // create an org
        beforeAll(async () => {
            await fs.remove(testProjectName);
            await exec(`sfdx force:project:create -n ${testProjectName}`);

            await testutils.orgCreate(testProjectName);
            await exec('sfdx shane:profile:whitelist -n Admin', { cwd: testProjectName });

            // await exec('sfdx force:source:push', { cwd: testProjectName });
            // create our test file

            try {
                await exec('heroku destroy -a `basename "${PWD/mshanemc-/}"` -c `basename "${PWD/mshanemc-/}"`', {
                    cwd: testProjectName,
                    shell: '/bin/bash'
                });
            } catch (error) {
                // it's ok....just wanted to make sure it's not there before trying to create it
            }
        });

        it('sets up a heroku app with deploy', async () => {
            // sfdx shane:heroku:repo:deploy -g mshanemc -r electron-web-app -n `basename "${PWD/mshanemc-/}"` -t ci-tests
            const results = await exec2JSON(
                'sfdx shane:heroku:repo:deploy -g mshanemc -r heroku-external-objects -n `basename "${PWD/mshanemc-/}"` --json',
                { cwd: testProjectName, shell: '/bin/bash' }
            );

            expect(results).toEqual(expect.objectContaining({ status: 0 }));
        });

        it('configures external objects with json response', async () => {
            // sfdx shane:heroku:connect -a `basename "${PWD/mshanemc-/}"` -f assets/herokuConnect/electron-web.json
            const results = await exec2JSON('sfdx shane:heroku:connect -a `basename "${PWD/mshanemc-/}"` -f mapping.json -e custom --json', {
                cwd: testProjectName,
                shell: '/bin/bash'
            });

            expect(results).toEqual(expect.objectContaining({ status: 0 }));
        });

        afterAll(async () => {
            await testutils.orgDelete(testProjectName);
            await exec('heroku destroy -a `basename "${PWD/mshanemc-/}"` -c `basename "${PWD/mshanemc-/}"`', {
                cwd: testProjectName,
                shell: '/bin/bash'
            });
            await fs.remove(testProjectName);
        });

        const testMapping = {
            mappings: [
                {
                    object_name: 'Contact',
                    config: {
                        access: 'read_only',
                        sf_notify_enabled: true,
                        sf_polling_seconds: 600,
                        sf_max_daily_api_calls: 30000,
                        fields: {
                            LastName: {},
                            AccountId: {},
                            Name: {},
                            MobilePhone: {},
                            Phone: {},
                            IsDeleted: {},
                            SystemModstamp: {},
                            CreatedDate: {},
                            Id: {},
                            FirstName: {}
                        },
                        indexes: {
                            SystemModstamp: {
                                unique: false
                            },
                            Id: {
                                unique: true
                            }
                        }
                    }
                }
            ],
            connection: {
                app_name: 'custexp-1554380996614',
                organization_id: '00D0R000000DHZVUA4',
                exported_at: '2019-04-04T13:25:57.541610+00:00',
                features: {
                    poll_db_no_merge: true,
                    poll_external_ids: false,
                    rest_count_only: false
                },
                api_version: '45.0',
                name: 'custexp-1554380996614',
                logplex_log_enabled: false
            },
            version: 1
        };
    }
});
