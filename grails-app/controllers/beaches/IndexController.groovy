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
                        ])
                ]
        ]

        def beachSelection = [
                pageName: 'Beach Selection',
                questions: [
                        new SelectQuestion(columnId: '__favorites', options: []),
                        new TextQuestion(columnId: '__county', prompt: 'County'),
                        new TextQuestion(columnId: '__lake', prompt: 'Lake'),
                        new TextQuestion(columnId: 'BEACH_SEQ', prompt: 'Beach'),
                        new TextQuestion(columnId: 'MONITOR_SITE_SEQ', prompt: 'Monitoring Site'),
                        new CheckQuestion(columnId: 'ECOLI_SAMPLE_TYPE', prompts: [
                                new Tuple2('Composite sample', false)
                        ])
                ]
        ]

        def bathers = [
                pageName: "Bathers",
                questions: [
                        new TextQuestion(columnId: 'NO_IN_WATER', prompt: 'Number of people in water'),
                        new TextQuestion(columnId: 'NUM_OUT_OF_WATER', prompt: 'Number of people out of water'),
                        new TextQuestion(columnId: 'NO_PEOPLE_BOATING', prompt: 'Number of people boating'),
                        new TextQuestion(columnId: 'NO_PEOPLE_FISHING', prompt: 'Number of people fishing'),
                        new TextQuestion(columnId: 'NO_PEOPLE_SURFING', prompt: 'Number of people surfing')
                ]
        ]

        def bathers2 = [
                pageName: "Bathers part 2",
                questions: [
                        new TextQuestion(columnId: 'NO_PEOPLE_WINDSURFING', prompt: 'Number of people wind surfing'),
                        new TextQuestion(columnId: 'NUM_PEOPLE_DIVING', prompt: 'Number of people diving'),
                        new TextQuestion(columnId: 'NO_PEOPLE_CLAMMING', prompt: 'Number of people Clamming'),
                        new TextQuestion(columnId: 'NO_PEOPLE_OTHER', prompt: 'Number of people doing other activities'),
                        new TextQuestion(columnId: 'NO_PEOPLE_OTHER_DESC', prompt: 'Describe previous "other" activities')
                ]
        ]

        def part3 = [
                pageName: 'Part 3 comments',
                question: [
                        new TextQuestion(columnId: 'PART_3_COMMENTS', prompt: 'Part 3 comments (Human bathers)')
                ]
        ]

        def wildlifeBathers = [
                pageName: 'Animal Bathers',
                questions: [
                        new TextQuestion(columnId: 'NO_GULLS', prompt: 'Number of gulls'),
                        new TextQuestion(columnId: 'NO_GEESE', prompt: 'Number of geese'),
                        new TextQuestion(columnId: 'NO_DOGS', prompt: 'Number of dogs'),
                        new TextQuestion(columnId: 'NO_ANIMALS_OTHER', prompt: 'Number of other wildlife'),
                        new TextQuestion(columnId: 'NO_ANIMALS_OTHER_DESC', prompt: 'Description of "other" wildlife')
                ]
        ]

        def deadWildlife = [
                pageName :'Deceased animals',
                questions: [
                        new TextQuestion(columnId: 'NUM_LOONS', prompt: 'Number of dead loons'),
                        new TextQuestion(columnId: 'NUM_HERR_GULLS', prompt: 'Number of dead Herr Gulls'),
                        new TextQuestion(columnId: 'NUM_RING_GULLS', prompt: 'Number of dead Ring Gulls'),
                        new TextQuestion(columnId: 'NUM_CORMORANTS', prompt: 'Number of dead Cormorants'),
                        new TextQuestion(columnId: 'NUM_LONGTAIL_DUCKS', prompt: 'Number of dead Longtail Ducks')
                ]
        ]

        def deadWildlife2 = [
                pageName :'Deceased animals part 2',
                questions: [
                        new TextQuestion(columnId: 'NUM_SCOTER', prompt: 'Number of dead Scoter'),
                        new TextQuestion(columnId: 'NUM_HORN_GREBE', prompt: 'Number of dead Horn Grebe'),
                        new TextQuestion(columnId: 'NUM_REDNECKED_GREBE', prompt: 'Number of dead rednecked Grebe '),
                        new TextQuestion(columnId: 'NUM_OTHER', prompt: 'Number of dead other birds'),
                        new TextQuestion(columnId: 'NUM_OTHER_DESC', prompt: 'desciption of other dead birds')
                ]
        ]


        def floaters = [
                pageName :'Floatables',
                questions: [
                        new CheckQuestion(columnId: 'FLOAT_STREET_LITTER', prompts: [
                                new Tuple2('Street litter floatables present', false)
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_FOOD', prompts: [
                                new Tuple2('Food floatables present', false)
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_MEDICAL', prompts: [
                                new Tuple2('Medical floatables present', false)
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_SEWAGE', prompts: [
                                new Tuple2('Sewage floatables present', false)
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_BLDG_MATERIALS', prompts: [
                                new Tuple2('Building material floatables present', false)
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_BLDG_MATERIALS', prompts: [
                                new Tuple2('Building material floatables present', false)
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_FISHING', prompts: [
                                new Tuple2('Fishing floatables present', false)
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_OTHER', prompts: [
                                new Tuple2('Other material floatables present', false),
                        ]),
                        new TextQuestion(columnId: 'FLOAT_OTHER_DESC', prompt: 'desciption of other floatables present')
                ]
        ]

        def debris = [
                pageName :'Beach debris',
                questions: [
                        new CheckQuestion(columnId: 'DEBRIS_STREET_ LITTER', prompts: [
                                new Tuple2('Street litter debris present', false)
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_FOOD', prompts: [
                                new Tuple2('Food debris present', false)
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_MEDICAL', prompts: [
                                new Tuple2('Medical floatables present', false)
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_SEWAGE', prompts: [
                                new Tuple2('Sewage debris present', false)
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_BLDG_MATERIALS', prompts: [
                                new Tuple2('Building material debris present', false)
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_BLDG_MATERIALS', prompts: [
                                new Tuple2('Building material debris present', false)
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_FISHING', prompts: [
                                new Tuple2('Fishing debris present', false)
                        ])
                ]
        ]

        def debris2 = [
                pageName :'Beach debris part 2',
                questions: [
                        new CheckQuestion(columnId: 'DEBRIS_HOUSEHOLD', prompts: [
                                new Tuple2('Household debris present', false),
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_TAR', prompts: [
                                new Tuple2('Tar debris present', false),
                        ]),
                        new CheckQuestion(columnId: 'DEBRIS_OIL', prompts: [
                                new Tuple2('Oil debris present', false),
                        ]),
                        new CheckQuestion(columnId: 'FLOAT_OTHER', prompts: [
                                new Tuple2('Other debris present', false),
                        ]),
                        new TextQuestion(columnId: 'FLOAT_OTHER_DESC', prompt: 'desciption of other debris present'),
                        new TextQuestion(columnId: 'DEBRIS_AMOUNT', prompt: 'Amount of Beach Debris/Litter on Beach (None, Low 1-20%, Moderate 21-50%, Hight >50%)')
                ]
        ]

        def weather = [
                pageName: "Weather",
                questions: [
                        new TextQuestion(columnId: 'AIR_TEMP', prompt: 'Air temperature'),
                        //@TODO HIDDEN unit
                        new TextQuestion(columnId: 'WIND_SPEED', prompt: 'Number of people out of water'),
                        //@TODO HIDDEN UNIT
                        new TextQuestion(columnId: 'WIND_DIR_DEGREES', prompt: 'Wind direction in degrees'),
                        new TextQuestion(columnId: 'WIND_DIR_ DESC', prompt: 'Wind direction description'),
                        new TextQuestion(columnId: 'WEATHER_DESC', prompt: 'Weather description')
                ]
        ]

        def weather2 = [
                pageName : "Weather part 2",
                questions: [
                        new CheckQuestion(columnId: 'RAINFALL_LAST_EVENT', prompts: [
                                new Tuple2('<24 hours since last rain event', true),
                                new Tuple2('<48 hours since last rain event', false),
                                new Tuple2('<72 hours since last rain event', false),
                                new Tuple2('>72 hours since last rain event', false)
                        ], radio: true),
                        new TextQuestion(columnId: 'RAINFALL', prompt: 'Rainfall ammount'),
                        //@TODO HIDDEN UNIT
                        new CheckQuestion(columnId: 'RAINFALL_STD_DESC', prompts: [
                                new Tuple2('Misting rain intensity', true),
                                new Tuple2('Light rain intensity', false),
                                new Tuple2('Steady rain intensity', false),
                                new Tuple2('Heavy rain intensity', false),
                                new Tuple2('Other rain intensity', false),
                        ], radio: true),
                ]
        ]

        def waves = [
                pageName: 'Waves',
                questions: [
                        new TextQuestion(columnId: 'WAVE_HEIGHT', prompt: 'Wave height'),
                        //@TODO HIDDEN UNIT
                        new TextQuestion(columnId: 'WAVE_DIRECTION', prompt: 'Wave direction(E,N,NE,NW,S,SE,SW,W)'),
                        new TextQuestion(columnId: 'WAVE_CONDITIONS', prompt: 'Wave conditions  '),
                        new TextQuestion(columnId: 'EST_ACT_FLAG', prompt: '*Estimated/Actual (comes after Wave Height)'),
                        new TextQuestion(columnId: 'CURRENT_SPEED', prompt: 'Longshore current speed'),
                        //@TODO HIDDEN UNIT
                        new TextQuestion(columnId: 'SHORELINE_CURRENT_DIR', prompt: 'Longshore Direction (E,N,NE,NW,S,SE,SW,W)')
                ]
        ]

        def part1 = [
                pageName: 'Part 1 comments',
                question: [
                        new TextQuestion(columnId: 'PART_1_COMMENTS', prompt: 'Part 1 comments (Waves and weater)')
                ]
        ]

        def color = [
                pageName: 'Color and Odor',
                questions: [
                        new TextQuestion(columnId: 'PH', prompt: 'pH level'),
                        new TextQuestion(columnId: 'COLOR_CHANGE', prompt: 'Color change'),
                        new TextQuestion(columnId: 'COLOR_DESCRIPTION', prompt: 'Color description'),
                        new TextQuestion(columnId: 'PH', prompt: 'pH level'),
                        new TextQuestion(columnId: 'ODOR_DESCRIPTION', prompt: 'Odor ( None;Septic;Algae;Sulfur;Other)'),
                        new TextQuestion(columnId: 'ODOR_OTHER_DESCRIPTION', prompt: 'If other, describe')
                ]
        ]

        def part2 = [
                pageName: 'Part 2 comments',
                questions: [
                        new TextQuestion(columnId: 'PART_2_COMMENTS', prompt: 'Part 2 comments (Color and odor)')

                ]
        ]

        def algae = [
                pageName: 'Algae',
                questions: [
                        new CheckQuestion(columnId: 'ALGAE_NEARSHORE', prompts: [
                                new Tuple2('No nearshore algae', true),
                                new Tuple2('1-20% nearshore algae', false),
                                new Tuple2('21-50% nearshore algae', false),
                                new Tuple2('>50% nearshore algae', false)
                        ], radio: true),
                        new CheckQuestion(columnId: 'ALGAE_ON_BEACH', prompts: [
                                new Tuple2('No beach algae', true),
                                new Tuple2('1-20% beach algae', false),
                                new Tuple2('21-50% beach algae', false),
                                new Tuple2('>50% beach algae', false)
                        ], radio: true)
                ]
        ]

        def algaeType = [
                pageName: 'Algae type',
                questions: [
                        new CheckQuestion(columnId: 'ALGAE_TYPE_PERIPHYTON', prompts: [
                                new Tuple2('Algae Type - Periphyton ', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_TYPE_GLOBULAR', prompts: [
                                new Tuple2('Algae Type - Globular', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_TYPE_FREEFLOATING', prompts: [
                                new Tuple2('Algae Type - Free Floating', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_TYPE_OTHER', prompts: [
                                new Tuple2('Algae Type - Other', false),
                        ]),
                        new TextQuestion(columnId: 'ALGAE_TYPE_OTHER_DESC', prompt: 'Describe Other Algae')
                ]
        ]

        def algaeColor = [
                pageName: 'Algae Color',
                questions: [
                        new CheckQuestion(columnId: 'ALGAE_COLOR_LT_GREEN', prompts: [
                                new Tuple2('Algae Color - Light Green ', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_COLOR_BRIGHT_GREEN', prompts: [
                                new Tuple2('Algae Color - Bright Green', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_COLOR_DRK_GREEN', prompts: [
                                new Tuple2('Algae Color - Dark Green', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_COLOR_YELLOW', prompts: [
                                new Tuple2('Algae Color - Yellow', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_COLOR_BROWN', prompts: [
                                new Tuple2('Algae Color - Brown', false),
                        ]),
                        new CheckQuestion(columnId: 'ALGAE_COLOR_OTHER', prompts: [
                                new Tuple2('Algae Color - Other', false),
                        ]),
                        new TextQuestion(columnId: 'ALGAE_COLOR_OTHER_DESC', prompt: 'Describe Other Algae Color')
                ]
        ]

        def tempTurbidity = [
                pageName: 'Temperature & Turbidity',
                questions: [
                        new TextQuestion(columnId: 'AVG_WATER_TEMP  ', prompt: 'Water temperature'),
                        //@TODO HIDDEN UNIT
                        new CheckQuestion(columnId: 'CLARITY_DESC', prompts: [

                                new Tuple2('Clear', true),
                                new Tuple2('Slightly turbid', false),
                                new Tuple2('Turbid', false),
                                new Tuple2('Opaque', false)
                        ], radio: true),
                        new TextQuestion(columnId: 'NTU', prompt: 'OR NTU'),
                        new TextQuestion(columnId: 'SEECHI_TUBE_CM', prompt: 'Seechi tube (CM)'),

                ]
        ]

        def part4 = [
                pageName: 'Part 4 comments',
                questions: [
                        new TextQuestion(columnId: 'PART_4_COMMENTS', prompt: 'Part 4 comments (Floatables, Debris, Algae, wildlife)')
                ]
        ]
        //all defs: part1, part2, part3, part4, beachSelection, bathers, bathers2, wildlifeBathers, weather, weather2, waves,
        // deadWildlife, deadwildlife2, floaters, debris, debris2, algae, tempTurbidity, AlgaeColor, AlgaeType, Algae, color
        [survey: [beachSelection, wildlifeBathers, deadWildlife, deadWildlife2, floaters, debris, debris2, bathers, bathers2, part3, weather, weather2, waves, part1, color, part2,
                    tempTurbidity, algae, algaeColor, algaeType, part4]]
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
}

class HiddenQuestion extends Question {
    String value
}
