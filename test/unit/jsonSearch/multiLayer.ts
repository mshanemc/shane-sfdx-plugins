const multiLayer = {
    appPageId: 'e7088ad2-0b91-4f6b-a9e2-c3e0f0783a9a',
    componentName: 'siteforce:sldsTwoCol84Layout',
    id: '95252aa8-e646-4072-814c-bd91b9290f08',
    label: 'Home',
    regions: [
        {
            components: [
                {
                    componentAttributes: {
                        richTextValue:
                            '<h1 style="text-align: center;"><b style="color: rgb(30, 36, 67); font-size: 28px;">NEW: Our online test drive request is now live!</b></h1><p style="text-align: center;"><span style="font-size: 20px;">You\'ll see test drives appearing in your community as customers request them</span></p>'
                    },
                    componentName: 'forceCommunity:richTextInline',
                    id: '114fc28d-2ebb-477f-a5bb-961ac92e42ad',
                    renderPriority: 'NEUTRAL',
                    renditionMap: {},
                    type: 'component'
                }
            ],
            id: 'a4131c7a-07f4-45ba-b0f2-16f40614cd08',
            regionName: 'header',
            type: 'region'
        },
        {
            components: [
                {
                    componentAttributes: {
                        tabsetConfig:
                            '{"UUID":"6bf8bf95-e4cf-460d-b202-761a4854b494","activeTab":"tab1","useOverflowMenu":false,"tabs":[{"UUID":"09c2ed39-f470-4ca5-918f-a08a9276e3ee","tabName":"Business Summary","tabKey":"tab1","locked":false,"allowGuestUser":true,"seedComponents":[{"fqn":"forceCommunity:dashboard","attributes":{}}]},{"UUID":"f00aafad-ddfe-4c40-bad6-ddce2cb801e7","tabName":"News & Updates","tabKey":"tab2","locked":false,"allowGuestUser":true,"seedComponents":[{"fqn":"forceCommunity:forceCommunityFeed","attributes":{"type":"Home"}}]}]}'
                    },
                    componentName: 'forceCommunity:tabset',
                    id: '6bf8bf95-e4cf-460d-b202-761a4854b494',
                    regions: [
                        {
                            components: [
                                {
                                    componentAttributes: {
                                        dashboardId: '0FK0t000000CcxZGAS',
                                        filter: '',
                                        height: '1000',
                                        hideOnError: 'false',
                                        openLinksInNewWindow: 'true',
                                        showHeader: 'true',
                                        showSharing: 'false',
                                        showTitle: 'true'
                                    },
                                    componentName: 'forceCommunity:waveDashboard',
                                    id: 'fa69a1ff-6738-4c1e-884a-e321fdbaba1c',
                                    renderPriority: 'NEUTRAL',
                                    renditionMap: {},
                                    type: 'component'
                                }
                            ],
                            id: '09c2ed39-f470-4ca5-918f-a08a9276e3ee',
                            regionLabel: 'Business Summary',
                            regionName: 'tab1',
                            renditionMap: {},
                            type: 'region'
                        },
                        {
                            components: [
                                {
                                    componentAttributes: {
                                        canChangeSorting: 'true',
                                        defaultFilter: '',
                                        defaultSortOrderHomeFeed: 'Relevance',
                                        defaultSortOrderTopicsFeed: 'Relevance',
                                        feedDesign: 'DEFAULT',
                                        hasFeedSearch: 'true',
                                        subjectId: '{!recordId}',
                                        type: 'Home'
                                    },
                                    componentName: 'forceCommunity:forceCommunityFeed',
                                    id: 'ce3e4eb2-2b16-4ccb-a483-e34415137c1a',
                                    renderPriority: 'NEUTRAL',
                                    renditionMap: {},
                                    type: 'component'
                                }
                            ],
                            id: 'f00aafad-ddfe-4c40-bad6-ddce2cb801e7',
                            regionLabel: 'News & Updates',
                            regionName: 'tab2',
                            renditionMap: {},
                            type: 'region'
                        }
                    ],
                    renderPriority: 'NEUTRAL',
                    renditionMap: {},
                    type: 'component'
                }
            ],
            id: 'd36d3811-f98f-417e-85fc-51cf9c675857',
            regionName: 'content',
            type: 'region'
        },
        {
            components: [
                {
                    componentAttributes: {
                        actions:
                            '[{"name": "NewLead", "isPublic": true},          {"name": "NewOpportunity", "isPublic": true}, {"name": "NewTask", "isPublic": true},          {"name": "NewCase", "isPublic": true}]',
                        label: 'Quick Create'
                    },
                    componentName: 'forceCommunity:createRecordButton',
                    id: 'a75a72da-7b19-4b20-ae79-25e41a4be103',
                    renderPriority: 'NEUTRAL',
                    renditionMap: {},
                    type: 'component'
                },
                {
                    componentAttributes: {
                        listViewIdForNavigation: '00B0v000002NJbvEAG',
                        navigateToListView: 'true',
                        pageSize: '5',
                        sortBy: 'CreatedDate',
                        title: 'Lead Inbox'
                    },
                    componentName: 'forceCommunity:leadInbox',
                    id: 'f7e0da78-fec6-456b-9953-332c3c81d499',
                    renderPriority: 'NEUTRAL',
                    renditionMap: {},
                    type: 'component'
                },
                {
                    componentAttributes: {
                        enableInlineEdit: 'true',
                        filterName: 'OPEN',
                        layout: 'COMPACT',
                        pageSize: '5',
                        scope: 'Task',
                        showActionBar: 'true',
                        showDisplay: 'showall',
                        showSearchBar: 'true'
                    },
                    componentName: 'forceCommunity:objectHome',
                    id: '13dfbecc-b0f8-4710-a6f8-3ad5c0b17924',
                    renderPriority: 'NEUTRAL',
                    renditionMap: {},
                    type: 'component'
                },
                {
                    componentAttributes: {
                        enableInlineEdit: 'true',
                        filterName: '00B3D000001CbyXUAS',
                        layout: 'COMPACT',
                        pageSize: '5',
                        scope: 'Opportunity',
                        showActionBar: 'true',
                        showDisplay: 'showall',
                        showSearchBar: 'true'
                    },
                    componentName: 'forceCommunity:objectHome',
                    id: '207466f6-0d40-421b-b18d-00d8e4393821',
                    renderPriority: 'NEUTRAL',
                    renditionMap: {},
                    type: 'component'
                }
            ],
            id: 'b98ff957-f938-4a38-b222-ec2461e6f850',
            regionName: 'sidebar',
            type: 'region'
        },
        {
            id: '2e809a2f-30a4-4a0e-82b5-df9ff3a68fdb',
            regionName: 'footer',
            type: 'region'
        },
        {
            components: [
                {
                    componentAttributes: {
                        description: '',
                        metaTags: '',
                        title: 'Home'
                    },
                    componentName: 'forceCommunity:seoAssistant',
                    id: '8877e407-0f34-4a84-8942-c545f5a415b8',
                    renderPriority: 'NEUTRAL',
                    renditionMap: {},
                    type: 'component'
                }
            ],
            id: '0d7d34b9-a2da-4ac9-bb17-55c6cefadbf4',
            regionName: 'sfdcHiddenRegion',
            type: 'region'
        }
    ],
    themeLayoutType: 'Inner',
    type: 'view',
    viewType: 'home'
};

export { multiLayer };
