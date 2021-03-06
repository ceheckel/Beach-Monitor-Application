package beaches

class IndexController {
    def index() {
        def beachSelection = [
                pageName: 'Beach Selection',
                questions: [
                        // User Info
                        new TextQuestion(columnId: 'user_name', prompt: 'Your Name'),
                        new TextQuestion(columnId: 'user_id', prompt: 'User ID *', extraClasses:'recommended'), // 'required' by some documentation, not by others

                        // Favorites Info
                        new SelectQuestion(columnId: '__favorites', options: [], title:"Favorites"),
                        new ButtonElement(columnId: '__addFavorite', value: 'Add to Favorites', onclick: 'addFavorite()', accent: true, disabled: true),
                        new ButtonElement(columnId: '__remFavorite', value: 'Remove Favorite', onclick: 'remFavorite()', accent: true, disabled: false),

                        // Beach Info
                        new SelectQuestion(columnId: '__county', options: [''], title:"County *", extraClasses: 'required'),
                        new SelectQuestion(columnId: '__lake', options: [''], title:"Lake *", extraClasses: 'required'),
                        new SelectQuestion(columnId: '__beach', options: [''], title:"Beach *", extraClasses: 'required'),
                        new HiddenQuestion(columnId: 'BEACH_SEQ', value: '-1'),
                        new SelectQuestion(columnId: '__site', options: [''], title:'Monitoring Site *', extraClasses: 'required'),
                        new HiddenQuestion(columnId: 'MONITOR_SITE_SEQ', value: '-1'),
                        //new ButtonElement(columnId: '__unused', value: 'Clear Beach Fields', onclick: 'clearBeachFields()', accent: true),
                        new CheckQuestion(columnId: 'ECOLI_SAMPLE_TYPE', prompts: [
                                new Tuple2('Composite sample', false)
                        ]),

                        // Date/Time Info
                        new ButtonElement(columnId: '__collectSampleNow', value: 'Collect Sample Now', onclick: 'collectSampleNow()', accent: true),
                        new TimeQuestion(columnId: 'SAMPLE_DATE_TIME_DISPLAYED', extraClasses: 'required'),
                        new HiddenQuestion(columnId: 'SAMPLE_DATE_TIME', value: '-1')
                ]
        ]

        def bathers = [
                pageName: "Bathers",
                questions: [
                        new TextQuestion(columnId: 'NO_IN_WATER', maxlength: 8, prompt: 'Number of people in water', errorm:"Must be nonnegative integer", type:"numeric", pattern:"([0-9]{1,8})", step:1),
                        new TextQuestion(columnId: 'NUM_OUT_OF_WATER', maxlength: 8, prompt: 'Number of people out of water', errorm:"Must be nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NO_PEOPLE_BOATING', maxlength: 8, prompt: 'Number of people boating', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NO_PEOPLE_FISHING', maxlength: 8, prompt: 'Number of people fishing', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NO_PEOPLE_SURFING', maxlength: 8, prompt: 'Number of people surfing', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NO_PEOPLE_WINDSURFING', maxlength: 8, prompt: 'Number of people wind surfing', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NUM_PEOPLE_DIVING', maxlength: 8, prompt: 'Number of people diving', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NO_PEOPLE_CLAMMING', maxlength: 8, prompt: 'Number of people clamming', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NO_PEOPLE_OTHER', maxlength: 8, prompt: 'Number of people doing other activities', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1, oninput:'OtherChange("#NO_PEOPLE_OTHER","#NO_PEOPLE_OTHER_DESC")'),
                        new TextQuestion(columnId: 'NO_PEOPLE_OTHER_DESC', maxlength: 50, prompt: 'If other, describe *'),
                        new TextQuestion(columnId: 'HUMAN_BATHERS_COMMENTS', maxlength: 195, prompt: 'Additional Bathers Comments')
                ]
        ]

        def wildlifeBathers = [
                pageName: 'Animals',
                questions: [
                        new TextQuestion(columnId: 'NO_GULLS', maxlength: 8, prompt: 'Number of living Gulls *', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1, extraClasses:'recommended'),
                        new TextQuestion(columnId: 'NO_GEESE', maxlength: 8, prompt: 'Number of living Geese', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NO_DOGS', maxlength: 8, prompt: 'Number of living Dogs', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NO_ANIMALS_OTHER', maxlength: 8, prompt: 'Number of other living wildlife', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1, oninput:'OtherChange("#NO_ANIMALS_OTHER","#ANIMALS_OTHER_DESC")'),
                        new TextQuestion(columnId: 'ANIMALS_OTHER_DESC', maxlength: 50, prompt: 'If other, describe *'),
                        new TextQuestion(columnId: 'WILDLIFE_COMMENTS', maxlength: 195, prompt: 'Additional Wildlife Comments')
                ]
        ]

        def deadWildlife = [
                pageName :'Deceased Animals',
                questions: [
                        new TextQuestion(columnId: 'NUM_LOONS', maxlength: 8, prompt: 'Number of dead Loons', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NUM_HERR_GULLS', maxlength: 8, prompt: 'Number of dead Herring Gulls', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NUM_RING_GULLS', maxlength: 8, prompt: 'Number of dead Ring Gulls', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NUM_CORMORANTS', maxlength: 8, prompt: 'Number of dead Cormorants', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NUM_LONGTAIL_DUCKS', maxlength: 8, prompt: 'Number of dead Long-tail Ducks', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NUM_SCOTER', maxlength: 8, prompt: 'Number of dead Scoter', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NUM_HORN_GREBE', maxlength: 8, prompt: 'Number of dead Horned Grebe', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1 ),
                        new TextQuestion(columnId: 'NUM_REDNECKED_GREBE', maxlength: 8, prompt: 'Number of dead Red-necked Grebe', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NUM_DEAD_FISH', maxlength: 8, prompt: 'Number of dead Fish', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1),
                        new TextQuestion(columnId: 'NUM_OTHER', maxlength: 8, prompt: 'Number of other dead birds', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:1, oninput:'OtherChange("#NUM_OTHER","#NUM_OTHER_DESC")'),
                        new TextQuestion(columnId: 'NUM_OTHER_DESC', maxlength: 50, prompt: 'If other, describe *'),
                        new TextQuestion(columnId: 'DEAD_ANIMAL_COMMENTS', maxlength: 195, prompt: 'Additional Wildlife Comments'),

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
                        ], onclick: 'OtherCheckbox("#FLOAT_OTHER","#FLOAT_OTHER_DESC")'),
                        new TextQuestion(columnId: 'FLOAT_OTHER_DESC', maxlength: 50, prompt: 'If other, describe *'),
                        new TextQuestion(columnId: 'DEBRIS_IN_WATER_COMMENTS', maxlength: 195, prompt: 'Additional Floating Debris Comments'),

                ]
        ]

        def debris = [
                pageName :'Debris on Beach',
                questions: [
                        new CheckQuestion(columnId: 'DEBRIS_STREET_LITTER', prompts: [
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
                        ], onclick: 'OtherCheckbox("#DEBRIS_OTHER","#DEBRIS_OTHER_DESC")'),
                        new TextQuestion(columnId: 'DEBRIS_OTHER_DESC', maxlength: 50, prompt: 'If other, describe *'),
                        new SelectQuestion(columnId: 'DEBRIS_AMOUNT', options: [
                                '',
                                '0%',
                                '1-20%',
                                '21-50%',
                                '>50%'
                        ],title: "Amount of beach debris/litter"),
                        new TextQuestion(columnId: 'DEBRIS_ON_BEACH_COMMENTS', maxlength: 195, prompt: 'Additional Debris on Beach Comments')
                ]
        ]

        def weather = [
                pageName: "Weather",
                questions: [
                        // Air
                        new UnitQuestion(columnId: 'AIR_TEMP', columnId2: 'AIR_UNITS', maxlength: 12, prompt: 'Air temperature', errorm:"Must be # with max of 4 digits left of decimal", type:"numeric", pattern: "(-?0*[0-9]{0,4}[.]{1}[0-9]*|-?0*[0-9]{0,4})"/*"(-?0*[1-9][0-9]*)|0*"*/, step:0.0001, title: "Units", options: ['F', 'C',]),

                        // Wind
                        new TextQuestion(columnId: 'WIND_SPEED', prompt: 'Wind speed (MPH)', errorm:"Must be positive # with max of 4 digits left of decimal", type:"numeric", pattern:"(0*[0-9]{0,4}[.]{1}[0-9]*|0*[0-9]{0,4})", step:0.0001),
                        new HiddenQuestion(columnId: 'WIND_SPEED_UNITS', value: 'MPH', keep: true),
                        new CorrelatedTextQuestion(columnId: 'WIND_DIR_DEGREES', columnId2: 'WIND_DIR_DESC', initValue: 'Calm', prompt: 'Wind direction in degrees', errorm:"Must be an integer between 0 and 360 (inclusive)", type:"numeric", pattern: "(0*360)|(0*3[0-5][0-9])|(0*[1-2][0-9][0-9])|(0*[1-9][0-9])|(0*[1-9])|0*", step:0.01, onchange: 'AlterWindDirDesc()', oninput: 'AlterWindDirDesc()'),

                        // Weather
                        new SelectQuestion(columnId: 'WEATHER_DESC', options: [
                                '',
                                'Clear',
                                'Mostly sunny',
                                'Partly sunny',
                                'Mostly cloudy',
                                'Cloudy'
                        ], title: "Weather Conditions *", extraClasses:'recommended'),

                        // Rain
                        new SelectQuestion(columnId: 'RAINFALL_LAST_EVENT', options: [
                                '',
                                '<24',
                                '<48',
                                '<72',
                                '>72'
                        ], title: "Hours since last rain event"),
                        new UnitQuestion(columnId: 'RAINFALL', columnId2: 'RAINFALL_UNITS', prompt: 'Rainfall amount', errorm:"Must be positive # with max of 4 digits left of decimal", type:"numeric", pattern:"(0*[0-9]{0,4}[.]{1}[0-9]*|0*[0-9]{0,4})", step:0.0001, oninput: "RainfallChange()", title: "Units", options: ['IN', 'CM',], maxlength: 12),
                        new SelectQuestion(columnId: 'RAIN_INTENSITY', options: [
                                '',
                                'Misting',
                                'Light',
                                'Steady',
                                'Heavy',
                                'Other'
                        ], title: "Rain intensity *"),

                        new TextQuestion(columnId: 'WEATHER_COMMENTS', maxlength: 195, prompt: 'Additional Weather Comments')
                ]
        ]

        def waves = [
                pageName: 'Waves',
                questions: [
                        // Waves
                        new TextQuestion(columnId: 'WAVE_HEIGHT', prompt: 'Wave height (FT) *', maxlength: 12, errorm:"Must be positive # with max of 4 digits left of decimal", type:"numeric", pattern:"(0*[0-9]{0,4}[.]{1}[0-9]*|0*[0-9]{0,4})", step:0.0001, extraClasses:'recommended'),
                        //@TODO value of wave height units
                        new HiddenQuestion(columnId: 'WAVE_HEIGHT_UNITS', value: 'FT', keep: true),
                        new CheckQuestion(columnId: 'EST_ACT_FLAG', prompts: [
                                new Tuple2('Estimated', false)
                        ]),
                        new SelectQuestion(columnId: 'WAVE_DIRECTION', options: [
                                '',
                                'N','NE','E','SE','S','SW','W','NW'
                        ],title: "Wave direction"),
                        new SelectQuestion(columnId: 'WAVE_INTENSITY', options: [
                                '',
                                'Calm',
                                'Normal',
                                'Rough'
                        ], title:"Wave conditions"),

                        // Current
                        new UnitQuestion(columnId: 'CURRENT_SPEED', maxlength: 8, columnId2: 'LONGSHORE_CURRENT_UNITS', prompt: 'Longshore current speed', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*", step:0.01, title: "Units", options: ['ft/sec', 'cm/sec',]),
                        new SelectQuestion(columnId: 'SHORELINE_CURRENT_DIR', options: [
                                '',
                                'N','NE','E','SE','S','SW','W','NW'
                        ], title: "Longshore current direction"),
                        new TextQuestion(columnId: 'WAVES_COMMENTS', maxlength: 195, prompt: 'Additional Wave Comments')
                ]
        ]

        def algae = [
                pageName: 'Algae',
                questions: [
                        // Algae Presence
                        new SelectQuestion(columnId: 'ALGAE_NEARSHORE', options: [
                                '',
                                '0%',
                                '1-20%',
                                '21-50%',
                                '>50%'
                        ], title: "Algae near the shore *", extraClasses:'recommended'),
                        new SelectQuestion(columnId: 'ALGAE_ON_BEACH', options: [
                                '',
                                '0%',
                                '1-20%',
                                '21-50%',
                                '>50%'
                        ],title: "Algae on the beach *", extraClasses:'recommended'),

                        // Algae Type
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
                        ], onclick: 'OtherCheckbox("#ALGAE_TYPE_OTHER","#ALGAE_TYPE_OTHER_DESC")'),
                        new TextQuestion(columnId: 'ALGAE_TYPE_OTHER_DESC', maxlength: 50, prompt: 'If other, describe *'),

                        // Algae Color
                        new LineQuestion(),

                        new CheckQuestion(columnId: 'ALGAE_COLOR_LT_GREEN', prompts: [
                                new Tuple2('Light Green ', false),
                        ], hasTitle:true,title:"Algae color:"),
                        new CheckQuestion(columnId: 'ALGAE_COLOR_BRGHT_GREEN', prompts: [ // Bright is intentionally spelled like this
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
                        ], onclick: 'OtherCheckbox("#ALGAE_COLOR_OTHER","#ALGAE_COLOR_OTHER_DESC")'),
                        new TextQuestion(columnId: 'ALGAE_COLOR_OTHER_DESC', maxlength: 50, prompt: 'If other, describe *'),

                        new TextQuestion(columnId: 'ALGAE_COMMENTS', maxlength: 195, prompt: 'Additional Algae Comments')
                ]
        ]

        def water = [
                pageName: 'Water conditions',
                questions: [
                        new TextQuestion(columnId: 'PH', prompt: 'pH level', maxlength: 12, errorm:"Must be a value between 0 and 14 (inclusive)", type:"numeric", pattern:"(0*1[0-3](\\.[0-9]*)?)|(0*[0-9](\\.[0-9]*)?)|(0*14(\\.[0]*)?)", step:0.01),
                        new CheckQuestion(columnId: 'COLOR_CHANGE', prompts: [
                                new Tuple2('Color has changed', false)
                        ], onclick: 'OtherCheckbox("#COLOR_CHANGE","#COLOR_DESCRIPTION")'),
                        new TextQuestion(columnId: 'COLOR_DESCRIPTION', maxlength: 50, prompt: 'If yes, describe'),
                        new SelectQuestion(columnId: 'ODOR_DESCRIPTION', options: [
                                '',
                                'None',
                                'Septic',
                                'Algae',
                                'Sulfur',
                                'Other'
                        ],title: "Odor description", onchange: "OdorChange()"),
                        new TextQuestion(columnId: 'ODOR_OTHER_DESCRIPTION', maxlength: 50, prompt: 'If other, describe *'),
                        new UnitQuestion(columnId: 'AVG_WATER_TEMP', maxlength: 12, columnId2: 'AVG_WATER_TEMP_UNITS', prompt: 'Water temperature *', errorm:"Must be # with max 5 digits left of decimal", type:"numeric", pattern:"(-?0*[0-9]{0,5}[.]{1}[0-9]*|-?0*[0-9]{0,5})", step:0.01, title: "Units *", options: ['F', 'C',], extraClasses: 'recommended'),
                        new SelectQuestion(columnId: 'CLARITY_DESC', options: [
                                '',
                                'Clear',
                                'Slightly turbid',
                                'Turbid',
                                'Opaque'
                        ], title: "Turbidity *", onchange: "TurbidityOrNTUChange()", extraClasses:'recommended'),
                        new TextQuestion(columnId: 'NTU', prompt: 'or NTU *', maxlength: 12, errorm:"Must be positive # with max 8 digits left of decimal", type:"numeric", pattern:"(0*[0-9]{0,8}[.]{1}[0-9]*|0*[0-9]{0,8})", step:0.01, onchange:"TurbidityOrNTUChange()", extraClasses:'recommended'),
                        new TextQuestion(columnId: 'SECCHI_TUBE_CM', maxlength: 8, prompt: 'Secchi tube', errorm:"Must be a nonnegative integer", type:"numeric", pattern:"(0*[1-9][0-9]*)|0*"),
                        new TextQuestion(columnId: 'WATER_COMMENTS', maxlength: 195, prompt: 'Additional Water Comments')
                ]
        ]

        [survey: [beachSelection, wildlifeBathers, deadWildlife, floaters, debris, bathers, weather, waves, water, algae]]
    }

    def addSurvey() {

    }
}

abstract class Question {
    String columnId
    String extraClasses = ""
    Integer maxlength = 50 // value changes based on question type (e.g. TestQuestion with 'type'="text" <= 50)
}

class LineQuestion extends Question{}

class TextQuestion extends Question {
    String prompt
    String type = "text"
    String pattern = ".*"
    String step
    String list = ""
    String onchange = ""
    String oninput = ""
    String errorm = "Invalid input" // Message written under field when input is invalid
    boolean characterCount = false;
}

class CorrelatedTextQuestion extends Question {
    String columnId2
    //String targetColumnId
    String initValue = "~"

    String prompt
    String type = "text"
    String pattern = ".*"
    String step
    String list = ""
    String onchange = ""
    String oninput = ""
    String errorm = "Invalid input" // Message written under field when input is invalid

}

class CheckQuestion extends Question {
    List<Tuple2<String, Boolean>> prompts
    boolean radio = false
    boolean hasTitle = false
    String title
    boolean inline = false
    String onclick = ""
}

class SelectQuestion extends Question {
    List<String> options
    String title
    String onchange = ""
}

class HiddenQuestion extends Question {
    String value
    boolean keep = false
}

class ButtonElement extends Question {
    String value
    String onclick
    boolean accent = false
    boolean disabled = false
}

class TimeQuestion extends Question { }

class UnitQuestion extends Question {
    // From TextQuestion
    String prompt
    String type = "text"
    String pattern = ".*"
    String step
    String list = ""
    String oninput = ""
    String errorm = "Invalid input" // Message written under field when input is invalid

    // From SelectQuestion
    List<String> options
    String title
    String columnId2

    // Shared between both
    String onchange = ""
}
