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

        def wildlifeBathers = [
                pageName: 'Wildlife & Bathers',
                questions: [
                        new TextQuestion(columnId: 'NO_GULLS', prompt: 'Number of gulls', type: 'number', step:'1'),
                        new TextQuestion(columnId: 'NO_GEESE', prompt: 'Number of geese', type: 'number', step:'1'),
                        new TextQuestion(columnId: 'NO_ANIMALS_OTHER', prompt: 'Number of other wildlife', type: 'number', step:'1'),
                        new TextQuestion(columnId: 'NO_IN_WATER', prompt: 'Number of people in water', type: 'number', step:'1'),
                        new TextQuestion(columnId: 'NUM_OUT_OF_WATER', prompt: 'Number of people out of water', type: 'number', step:'1')
                ]
        ]

        def algae = [
                pageName: 'Algae',
                questions: [
                        new CheckQuestion(columnId: '__a', prompts: [
                                new Tuple2('No nearshore algae', true),
                                new Tuple2('1-20% nearshore algae', false),
                                new Tuple2('21-50% nearshore algae', false),
                                new Tuple2('>50% nearshore algae', false)
                        ], radio: true),
                        new CheckQuestion(columnId: '__b', prompts: [
                                new Tuple2('No beach algae', true),
                                new Tuple2('1-20% beach algae', false),
                                new Tuple2('21-50% beach algae', false),
                                new Tuple2('>50% beach algae', false)
                        ], radio: true)
                ]
        ]

        def tempTurbidity = [
                pageName: 'Temperature & Turbidity',
                questions: [
                        new TextQuestion(columnId: '__c', prompt: 'Water temperature',type: 'number', step: '0.001'),
                        new CheckQuestion(columnId: '__d', prompts: [
                                new Tuple2('Clear', true),
                                new Tuple2('Slightly turbid', false),
                                new Tuple2('Turbid', false),
                                new Tuple2('Opaque', false)
                        ], radio: true),
                        //Sample Hidden Question
                        new HiddenQuestion(columnId: '__Units', value: 'm')
                ]
        ]

        [survey: [beachSelection, wildlifeBathers, algae, tempTurbidity]]
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
}

class SelectQuestion extends Question {
    List<String> options
}

class HiddenQuestion extends Question {
    String value
}
