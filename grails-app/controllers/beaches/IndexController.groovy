package beaches

class IndexController {

    def index() {
        def beachSelection = [
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
        [survey: [beachSelection]]
    }
}

abstract class Question {
    String columnId
}

class TextQuestion extends Question {
    String prompt
}

class CheckQuestion extends Question {
    List<Tuple2<String, Boolean>> prompts
    boolean radio = false
}

class SelectQuestion extends Question {
    List<String> options
}
