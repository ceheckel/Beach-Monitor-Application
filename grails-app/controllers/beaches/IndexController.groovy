package beaches

class IndexController {
    //TODO wildlife (scared first) then dry before wet. General before quanatitive
    //Look on the old form images
    def index() {
        def demoPage = [
                pageName: 'Beach Selection',
                questions: [
                        new TextQuestion(columnId: 'Q1', prompt: 'Prompt 1'),
                        new TextQuestion(columnId: 'Q2', prompt: 'Prompt 2'),
                        new CheckQuestion(columnId: 'Q3', prompts: [
                                new Tuple2('Thing 1', false),
                                new Tuple2('Thing 2', false),
                                new Tuple2('Thing 3', true)
                        ]),
                        new CheckQuestion(columnId: 'Q4', prompts: [
                                new Tuple2('Radio 1', true),
                                new Tuple2('Radio 2', false),
                                new Tuple2('Radio 3', true)
                        ], radio: true),
                        new SelectQuestion(columnId: 'Q5', options: [
                                'Option 1',
                                'Option 2',
                                'Option 3'
                        ], title:"Q5")
                ]
        ]

        def beachSelection = [
                pageName: 'Beach Selection',
                questions: [
                        new SelectQuestion(columnId: '__favorites', options: [], title:"Favorites"),
                        new TextQuestion(columnId: '__county', prompt: 'County', list: 'countyList'),
                        new TextQuestion(columnId: '__lake', prompt: 'Lake', list: 'lakeList'),
                        new TextQuestion(columnId: 'BEACH_SEQ', prompt: 'Beach', list: 'beachList'),
                        new TextQuestion(columnId: 'MONITOR_SITE_SEQ', prompt: 'Monitoring Site', list: 'monitorList'),
                        new CheckQuestion(columnId: 'ECOLI_SAMPLE_TYPE', prompts: [
                                new Tuple2('Composite sample', false)
                        ]),
                        new ButtonElement(columnId: '__addFavorite', value: 'Add to Favorites', onclick: 'addFavorite()', accent: true),
                        //@TODO decide on how to handle date, time and user
                        new HiddenQuestion(columnId: 'SAMPLE_DATE_TIME', value: 'FETCH DATE AND TIME'),
                        new HiddenQuestion(columnId: 'SAMPLE_SEQ', value: 'FETCH USER')
                ]
        ]

        def bathers = [
                pageName: "Bathers",
                questions: [
                        //@TODO all numeric
                        new TextQuestion(columnId: 'NO_IN_WATER', prompt: 'Number of people in water', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NUM_OUT_OF_WATER', prompt: 'Number of people out of water', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NO_PEOPLE_BOATING', prompt: 'Number of people boating', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NO_PEOPLE_FISHING', prompt: 'Number of people fishing', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NO_PEOPLE_SURFING', prompt: 'Number of people surfing', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NO_PEOPLE_WINDSURFING', prompt: 'Number of people wind surfing', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NUM_PEOPLE_DIVING', prompt: 'Number of people diving', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NO_PEOPLE_CLAMMING', prompt: 'Number of people Clamming', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NO_PEOPLE_OTHER', prompt: 'Number of people doing other activities', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NO_PEOPLE_OTHER_DESC', prompt: 'If other, describe')
                ]
        ]

        def wildlifeBathers = [
                pageName: 'Animals',
                questions: [
                        //@TODO all numeric
                        new TextQuestion(columnId: 'NO_GULLS', prompt: 'Number of gulls', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NO_GEESE', prompt: 'Number of geese', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NO_DOGS', prompt: 'Number of dogs', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NO_ANIMALS_OTHER', prompt: 'Number of other wildlife', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NO_ANIMALS_OTHER_DESC', prompt: 'If other, describe')
                ]
        ]

        def deadWildlife = [
                pageName :'Deceased Animals',
                questions: [
                        //@TODO all numeric
                        new TextQuestion(columnId: 'NUM_LOONS', prompt: 'Number of dead loons', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NUM_HERR_GULLS', prompt: 'Number of dead Herr Gulls', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NUM_RING_GULLS', prompt: 'Number of dead Ring Gulls', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NUM_CORMORANTS', prompt: 'Number of dead Cormorants', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NUM_LONGTAIL_DUCKS', prompt: 'Number of dead Longtail Ducks', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NUM_SCOTER', prompt: 'Number of dead Scoter', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NUM_HORN_GREBE', prompt: 'Number of dead Horn Grebe', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NUM_REDNECKED_GREBE', prompt: 'Number of dead rednecked Grebe ', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NUM_FISH', prompt: 'Number of dead fish ', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NUM_OTHER', prompt: 'Number of dead other birds', type:"number", step:1 ),
                        new TextQuestion(columnId: 'NUM_OTHER_DESC', prompt: 'If other, describe')
                ]
        ]

        def floaters = [
                pageName :'Floatables',
                questions: [
                        //@TODO can clean up with each tuple2 having a columnId
                        new CheckQuestion(columnId: 'FLOAT_STREET_LITTER', prompts: [
                                new Tuple2('Street litter', false)
                        ],hasTitle:true, title: "Floatables present:"),
                        new CheckQuestion(columnId: 'FLOAT_FOOD', prompts: [
                                new Tuple2('Food', false)
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_MEDICAL', prompts: [
                                new Tuple2('Medical', false)
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_SEWAGE', prompts: [
                                new Tuple2('Sewage', false)
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_BLDG_MATERIALS', prompts: [
                                new Tuple2('Building material', false)
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_FISHING', prompts: [
                                new Tuple2('Fishing', false)
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_OTHER', prompts: [
                                new Tuple2('Other material', false),
                        ]),
                        new TextQuestion(columnId: 'FLOAT_OTHER_DESC', prompt: 'If other, describe')
                ]
        ]

        def debris = [
                pageName :'Beach Debris',
                questions: [
                        //@TODO can clean up with each tuple2 having a columnId
                        new CheckQuestion(columnId: 'DEBRIS_STREET_ LITTER', prompts: [
                                new Tuple2('Street litter', false)
                        ], hasTitle:true, title: "Debris present:"),
                        new CheckQuestion(columnId: 'DEBRIS_FOOD', prompts: [
                                new Tuple2('Food', false)
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_MEDICAL', prompts: [
                                new Tuple2('Medical', false)
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_SEWAGE', prompts: [
                                new Tuple2('Sewage', false)
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_BLDG_MATERIALS', prompts: [
                                new Tuple2('Building material', false)
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_FISHING', prompts: [
                                new Tuple2('Fishing', false)
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_HOUSEHOLD', prompts: [
                                new Tuple2('Household', false),
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_TAR', prompts: [
                                new Tuple2('Tar', false),
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_OIL', prompts: [
                                new Tuple2('Oil', false),
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_OTHER', prompts: [
                                new Tuple2('Other', false),
                        ]),
                        new TextQuestion(columnId: 'DEBRIS_OTHER_DESC', prompt: 'If other, describe'),
                        new SelectQuestion(columnId: 'DEBRIS_AMOUNT', options: [
                                '0%',
                                '1-20%',
                                '21-50%',
                                '>50%'
                        ],title: "Amount of beach debris/litter")
                        /*new CheckQuestion(columnId: 'DEBRIS_AMOUNT', prompts: [
                                new Tuple2('0%', true),
                                new Tuple2('1-20%', false),
                                new Tuple2('21-50%', false),
                                new Tuple2('>50%', false)
                        ], radio: true, hasTitle: true, title: "Amount of beach debris/litter", inline: true),*/
                ]
        ]

        def weather = [
                pageName: "Weather",
                questions: [
                        new TextQuestion(columnId: 'AIR_TEMP', prompt: 'Air temperature', type:"number", step:0.0001 ),
                        new HiddenQuestion(columnId: 'AIR_UNITS', value: 'F'), //@TODO find value of air units
                        new TextQuestion(columnId: 'WIND_SPEED', prompt: 'Wind speed', type:"number", step:0.0001 ),
                        new HiddenQuestion(columnId: 'WIND_SPEED_UNITS', value: 'MPH'), //@TODO find value of wind speed units
                        new TextQuestion(columnId: 'WIND_DIR_DEGREES', prompt: 'Wind direction in degrees', type:"number", step:0.01 ),
                        new TextQuestion(columnId: 'WIND_DIR_DESC', prompt: 'Wind direction description'),
                        new SelectQuestion(columnId: 'WEATER_DES', options: [
                                'Clear',
                                'Mostly sunny',
                                'Partly sunny',
                                'Mostly cloudy',
                                'Cloudy'
                        ], title: "Weather Conditions"),
                        new SelectQuestion(columnId: 'RAINFALL_LAST_EVENT', options: [
                                '<24',
                                '<48',
                                '<72',
                                '>72'
                        ], title: "Hours since last rain event"),
                        /*new CheckQuestion(columnId: 'WEATHER_DESC', prompts: [
                                new Tuple2('Clear', true),
                                new Tuple2('Mostly sunny', false),
                                new Tuple2('Partly sunny', false),
                                new Tuple2('Mostly cloudy', false),
                                new Tuple2('Cloudy', false),
                        ], radio: true, hasTitle: true, title: "Weather Conditions", inline: true),
                        new CheckQuestion(columnId: 'RAINFALL_LAST_EVENT', prompts: [
                                new Tuple2('<24', true),
                                new Tuple2('<48', false),
                                new Tuple2('<72', false),
                                new Tuple2('>72', false)
                        ], radio: true, hasTitle: true, title: "Hours since last rain event", inline: true),*/
                        new TextQuestion(columnId: 'RAINFALL', prompt: 'Rainfall amount', type:"number", step:0.0001 ),
                        new HiddenQuestion(columnId: 'RAINFALL_UNITS', value: 'IN'), //@TODO value of rainfall units
                        new SelectQuestion(columnId: 'RAINFALL_STD_DESC', options: [
                                'Misting',
                                'Light',
                                'Steady',
                                'Heavy',
                                'Other'
                        ], title: "Rain intensity" )
                        /*new CheckQuestion(columnId: 'RAINFALL_STD_DESC', prompts: [
                                new Tuple2('Misting', true),
                                new Tuple2('Light', false),
                                new Tuple2('Steady', false),
                                new Tuple2('Heavy', false),
                                new Tuple2('Other', false),
                        ], radio: true, hasTitle: true, title: "Rain intensity", inline: true)*/
                ]
        ]

        def waves = [
                pageName: 'Waves',
                questions: [
                        new TextQuestion(columnId: 'WAVE_HEIGHT', prompt: 'Wave height', type:"number", step:0.0001 ),
                        new HiddenQuestion(columnId: 'WAVE_HEIGHT_UNITS', value: 'FT'),  //@TODO value of wave height units
                        new CheckQuestion(columnId: 'EST_ACT_FLAG', prompts: [
                                new Tuple2('Estimated?', false)
                        ]),
                        new SelectQuestion(columnId: 'WAVE_DIRECTION', options: [
                                'N','NE','E','SE','S','SW','W','NW'
                        ],title: "Wave direction"),
                        new SelectQuestion(columnId: 'WAVE_CONDITIONS', options: [
                                'Calm',
                                'Normal',
                                'Rough'
                        ], title:"Wave conditions"),
                        /*new CheckQuestion(columnId: 'WAVE_DIRECTION', prompts: [
                                new Tuple2('N', true), new Tuple2('NE', false),
                                new Tuple2('E', false),new Tuple2('SE', false),
                                new Tuple2('S', false),new Tuple2('SW', false),
                                new Tuple2('W', false),new Tuple2('NW', false),
                        ], radio: true, hasTitle: true, title: "Wave direction", inline: true),
                        new CheckQuestion(columnId: 'WAVE_CONDITIONS', prompts: [
                                new Tuple2('Calm', true),
                                new Tuple2('Normal', false),
                                new Tuple2('Rough', false)
                        ], radio: true, hasTitle: true, title: "Wave conditions", inline: true),*/
                        new TextQuestion(columnId: 'CURRENT_SPEED', prompt: 'Longshore current speed', type:"number", step:0.01 ),
                        new HiddenQuestion(columnId: 'LONGSHORE_CURRENT_UNITS', value: 'MPH'), //@TODO value of longshore current units
                        new SelectQuestion(columnId: 'SHORELINE_CURRENT_DIR', options: [
                                'N','NE','E','SE','S','SW','W','NW'
                        ], title: "Longshore direction")
                        /*new CheckQuestion(columnId: 'SHORELINE_CURRENT_DIR', prompts: [
                                new Tuple2('N', true), new Tuple2('NE', false),
                                new Tuple2('E', false),new Tuple2('SE', false),
                                new Tuple2('S', false),new Tuple2('SW', false),
                                new Tuple2('W', false),new Tuple2('NW', false),
                        ], radio: true, hasTitle: true, title: "Longshore direction", inline: true)*/
                ]
        ]

        def algae = [
                pageName: 'Algae',
                questions: [
                        new SelectQuestion(columnId: 'ALGAE_NEARSHORE', options: [
                                '0%',
                                '1-20%',
                                '21-50%',
                                '>50%'
                        ], title: "Algae near the shore"),
                        new SelectQuestion(columnId: 'ALGAE_ON_BEACH', options: [
                                '0%',
                                '1-20%',
                                '21-50%',
                                '>50%'
                        ],title: "Algae on the beach"),
                        /*new CheckQuestion(columnId: 'ALGAE_NEARSHORE', prompts: [
                                new Tuple2('0%', true),
                                new Tuple2('1-20%', false),
                                new Tuple2('21-50%', false),
                                new Tuple2('>50%', false)
                        ], radio: true, hasTitle: true, title: "Algae near the shore", inline: true),
                        new CheckQuestion(columnId: 'ALGAE_ON_BEACH', prompts: [
                                new Tuple2('0%', true),
                                new Tuple2('1-20%', false),
                                new Tuple2('21-50%', false),
                                new Tuple2('>50%', false)
                        ], radio: true, hasTitle: true, title: "Algae on the beach", inline: true),*/
                        new CheckQuestion(columnId: 'ALGAE_TYPE_PERIPHYTON', prompts: [
                                new Tuple2('Periphyton ', false),
                        ],hasTitle:true, title: "Algae type:"),
                        new CheckQuestion(columnId: 'ALGAE_TYPE_GLOBULAR', prompts: [
                                new Tuple2('Globular', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_TYPE_FREEFLOATING', prompts: [
                                new Tuple2('Free Floating', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_TYPE_OTHER', prompts: [
                                new Tuple2('Other', false),
                        ]),
                        new TextQuestion(columnId: 'ALGAE_TYPE_OTHER_DESC', prompt: 'If other, describe'),
                        new CheckQuestion(columnId: 'ALGAE_COLOR_LT_GREEN', prompts: [
                                new Tuple2('Light Green ', false),
                        ], hasTitle:true,title:"Algae color:"),
                        new CheckQuestion(columnId: 'ALGAE_COLOR_BRIGHT_GREEN', prompts: [
                                new Tuple2('Bright Green', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_COLOR_DRK_GREEN', prompts: [
                                new Tuple2('Dark Green', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_COLOR_YELLOW', prompts: [
                                new Tuple2('Yellow', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_COLOR_BROWN', prompts: [
                                new Tuple2('Brown', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_COLOR_OTHER', prompts: [
                                new Tuple2('Other', false),
                        ]),
                        new TextQuestion(columnId: 'ALGAE_COLOR_OTHER_DESC', prompt: 'If other, describe')
                ]
        ]



        def water = [
                pageName: 'Water conditions',
                questions: [
                        new TextQuestion(columnId: 'PH', prompt: 'pH level', type:"number", step:0.01 ),
                        new CheckQuestion(columnId: 'COLOR_CHANGE', prompts: [
                                new Tuple2('Has the color changed?', false)
                        ]),
                        /*new CheckQuestion(columnId: 'COLOR_CHANGE', prompts: [
                                new Tuple2('Yes', true),
                                new Tuple2('No', false)
                        ], radio: true, hasTitle: true, title: "Has the color changed?", inline: true),*/
                        new TextQuestion(columnId: 'COLOR_DESCRIPTION', prompt: 'If yes, describe'),
                        new SelectQuestion(columnId: 'ODOR_DESCRIPTION', options: [
                                'None',
                                'Septic',
                                'Algae',
                                'Sulfur',
                                'Other'
                        ],title: "Odor description"),
                        /*new CheckQuestion(columnId: 'ODOR_DESCRIPTION', prompts: [
                                new Tuple2('None', true),
                                new Tuple2('Septic', false),
                                new Tuple2('Algae', false),
                                new Tuple2('Sulfur', false),
                                new Tuple2('Other', false)
                        ], radio: true, hasTitle: true, title: "Odor description", inline: true),*/
                        new TextQuestion(columnId: 'ODOR_OTHER_DESCRIPTION', prompt: 'If other, describe'),
                        new TextQuestion(columnId: 'AVG_WATER_TEMP  ', prompt: 'Water temperature', type:"number", step:0.01 ),
                        new HiddenQuestion(columnId: 'AVG_WATER_TEMP_UNITS', value: 'F'), //@TODO value of avg water temp units
                        new SelectQuestion(columnId: 'CLARITY_DESC', options: [
                                'Clear',
                                'Slightly turbid',
                                'Turbid',
                                'Opaque'
                        ], title: "Turbidity"),
                        /*new CheckQuestion(columnId: 'CLARITY_DESC', prompts: [
                                new Tuple2('Clear', true),
                                new Tuple2('Slightly turbid', false),
                                new Tuple2('Turbid', false),
                                new Tuple2('Opaque', false)
                        ], radio: true, hasTitle: true, title: "Turbidity", inline: true),*/
                        new TextQuestion(columnId: 'NTU', prompt: 'OR NTU', type:"number", step:0.01),
                        new TextQuestion(columnId: 'SECCHI_TUBE_CM', prompt: 'Secchi tube (CM)', type:"number", step:0.01 )
                ]
        ]

        def comments = [
                pageName: 'Comments',
                questions: [
                        new TextQuestion(columnId: 'PART_1_COMMENTS', prompt: 'Waves and weater'),
                        new TextQuestion(columnId: 'PART_2_COMMENTS', prompt: 'Color and odor of water'),
                        new TextQuestion(columnId: 'PART_3_COMMENTS', prompt: 'Human bathers'),
                        new TextQuestion(columnId: 'PART_4_COMMENTS', prompt: 'Floatables, debris, algae, and wildlife'),
                        //@TODO must assign theses later
                        new HiddenQuestion(columnId: 'DATA_ENTERED', value: 'FETCH DATE'),
                        new HiddenQuestion(columnId: 'DATA_SAMPLE_SEQ', value: 'FETCH USER'),
                        new HiddenQuestion(columnId: 'DATE_UPDATED', value: 'FETCH DATE AND TIME'),
                        new HiddenQuestion(columnId: 'UPDATE_ENTRY_SEQ', value: 'FETCH USER'),
                        new HiddenQuestion(columnId: 'MISSING_REQUIRED_FLAG', value: 'FETCH VALUE')
                ]
        ]

        [survey: [beachSelection, wildlifeBathers, deadWildlife, floaters, debris, bathers, weather, waves, water, algae, comments]]
    }

    def addSurvey() {

    }
}

abstract class Question {
    String columnId
}

class TextQuestion extends Question {
    String prompt
    String type = "text"
    String pattern = ".*"
    String step
    String extraClasses = ""
    String list = ""
}

class CheckQuestion extends Question {
    List<Tuple2<String, Boolean>> prompts
    boolean radio = false
    boolean hasTitle = false
    String title
    boolean inline = false
}

class SelectQuestion extends Question {
    List<String> options
    String title
}

class HiddenQuestion extends Question {
    String value
}

class ButtonElement extends Question {
    String value
    String onclick
    boolean accent = false
}
