
package beaches

class IndexController {
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
                        new ButtonElement(columnId: '__addFavorite', value: 'Add to Favorites', onclick: 'addFavorite()', accent: true, disabled: true),
                        //@TODO decide on how to handle date, time and user
//                        new HiddenQuestion(columnId: 'SAMPLE_DATE_TIME', value: 'FETCH DATE AND TIME'),
                        new HiddenQuestion(columnId: 'SAMPLE_SEQ', value: 'FETCH USER'),
                        new TextQuestion(columnId: 'user_name', prompt: 'Your Name'),
                        new TextQuestion(columnId: 'user_id', prompt: 'User ID')
                ]
        ]

        def bathers = [
                pageName: "Bathers",
                questions: [
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
                pageName :'Debris in Water',
                questions: [
                        new CheckQuestion(columnId: 'FLOAT_STREET_LITTER', prompts: [
                                new Tuple2('Street litter', false)
                        ],hasTitle:true, title: "Debris in water present:"),
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
                pageName :'Debris on Beach',
                questions: [
                        new CheckQuestion(columnId: 'DEBRIS_STREET_ LITTER', prompts: [
                                new Tuple2('Street litter', false)
                        ], hasTitle:true, title: "Beach debris present:"),
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
                ]
        ]

        def weather = [
                pageName: "Weather",
                questions: [
                        new TextQuestion(columnId: 'AIR_TEMP', prompt: 'Air temperature (F)', type:"number", step:0.0001 ),
                        //@TODO find value of air units
                        new HiddenQuestion(columnId: 'AIR_UNITS', value: 'F'),
                        new TextQuestion(columnId: 'WIND_SPEED', prompt: 'Wind speed (MPH)', type:"number", step:0.0001 ),
                        //@TODO find value of wind speed units
                        new HiddenQuestion(columnId: 'WIND_SPEED_UNITS', value: 'MPH'),
                        new TextQuestion(columnId: 'WIND_DIR_DEGREES', prompt: 'Wind direction in degrees', type:"number", step:0.01 ),
                        new TextQuestion(columnId: 'WIND_DIR_DESC', prompt: 'Wind direction description'),
                        new SelectQuestion(columnId: 'WEATHER_DES', options: [
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
                        new TextQuestion(columnId: 'RAINFALL', prompt: 'Rainfall amount (IN)', type:"number", step:0.0001 ),
                        //@TODO value of rainfall units
                        new HiddenQuestion(columnId: 'RAINFALL_UNITS', value: 'IN'),
                        new SelectQuestion(columnId: 'RAINFALL_STD_DESC', options: [
                                'Misting',
                                'Light',
                                'Steady',
                                'Heavy',
                                'Other'
                        ], title: "Rain intensity" )
                ]
        ]

        def waves = [
                pageName: 'Waves',
                questions: [
                        new TextQuestion(columnId: 'WAVE_HEIGHT', prompt: 'Wave height (FT)', type:"number", step:0.0001 ),
                        //@TODO value of wave height units
                        new HiddenQuestion(columnId: 'WAVE_HEIGHT_UNITS', value: 'FT'),
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
                        new TextQuestion(columnId: 'CURRENT_SPEED', prompt: 'Longshore current speed (MPH)', type:"number", step:0.01 ),
                        //@TODO value of longshore current units
                        new HiddenQuestion(columnId: 'LONGSHORE_CURRENT_UNITS', value: 'MPH'),
                        new SelectQuestion(columnId: 'SHORELINE_CURRENT_DIR', options: [
                                'N','NE','E','SE','S','SW','W','NW'
                        ], title: "Longshore current direction")
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

        def sampleTime = [
                pageName: 'Sample Collection',
                questions: [
                        new ButtonElement(columnId: '__collectSampleNow', value: 'Collect Sample Now', onclick: 'collectSampleNow()', accent: true),
                        new TimeQuestion(columnId: 'SAMPLE_DATE_TIME')
                ]
        ]

        def water = [
                pageName: 'Water conditions',
                questions: [
                        new TextQuestion(columnId: 'PH', prompt: 'pH level', type:"number", step:0.01 ),
                        new CheckQuestion(columnId: 'COLOR_CHANGE', prompts: [
                                new Tuple2('Has the color changed?', false)
                        ]),
                        new TextQuestion(columnId: 'COLOR_DESCRIPTION', prompt: 'If yes, describe'),
                        new SelectQuestion(columnId: 'ODOR_DESCRIPTION', options: [
                                'None',
                                'Septic',
                                'Algae',
                                'Sulfur',
                                'Other'
                        ],title: "Odor description"),
                        new TextQuestion(columnId: 'ODOR_OTHER_DESCRIPTION', prompt: 'If other, describe'),
                        new TextQuestion(columnId: 'AVG_WATER_TEMP  ', prompt: 'Water temperature (F)', type:"number", step:0.01 ),
                        //@TODO value of avg water temp units
                        new HiddenQuestion(columnId: 'AVG_WATER_TEMP_UNITS', value: 'F'),
                        new SelectQuestion(columnId: 'CLARITY_DESC', options: [
                                '',
                                'Clear',
                                'Slightly turbid',
                                'Turbid',
                                'Opaque'
                        ], title: "Turbidity"),
                        new TextQuestion(columnId: 'NTU', prompt: 'OR NTU', type:"number", step:0.01),
                        new TextQuestion(columnId: 'SECCHI_TUBE_CM', prompt: 'Secchi tube (CM)', type:"number", step:0.01 )
                ]
        ]

        def comments = [
                pageName: 'Comments',
                questions: [
                        new TextQuestion(columnId: 'PART_1_COMMENTS', prompt: 'Waves and weather'),
                        new TextQuestion(columnId: 'PART_2_COMMENTS', prompt: 'Color and odor of water'),
                        new TextQuestion(columnId: 'PART_3_COMMENTS', prompt: 'Human bathers'),
                        new TextQuestion(columnId: 'PART_4_COMMENTS', prompt: 'Debris, algae, and wildlife'),
                        //@TODO must assign theses later
                        new HiddenQuestion(columnId: 'DATA_ENTERED', value: 'FETCH DATE'),
                        new HiddenQuestion(columnId: 'DATA_SAMPLE_SEQ', value: 'FETCH USER'),
                        new HiddenQuestion(columnId: 'DATE_UPDATED', value: 'FETCH DATE AND TIME'),
                        new HiddenQuestion(columnId: 'UPDATE_ENTRY_SEQ', value: 'FETCH USER'),
                        new HiddenQuestion(columnId: 'MISSING_REQUIRED_FLAG', value: 'FETCH VALUE')
                ]
        ]

        [survey: [beachSelection, wildlifeBathers, deadWildlife, floaters, debris, bathers, weather, waves, sampleTime, water, algae, comments]]
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
    boolean disabled = false
}

class TimeQuestion extends Question {

}
