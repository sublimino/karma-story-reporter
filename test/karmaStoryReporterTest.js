describe("Karma story reporter mock formatter", function() {

  it("concatenates arguments into a string", function() {
    expect(mockFormatter('a', 'b', 'c')).toBe('abc');
  });


  it("concatenates arguments into a string", function() {
    expect(mockFormatter('0', '1', '2')).toBe('012');
  });
});


describe("Karma story reporter", function() {

  var storyReporter = null;
  var browser = {name: 'Test Browser (Test)'};

  beforeEach(function() {
    storyReporter = new StoryReporter(baseReporterDecorator, null, null, null, false);
  });

  describe("tabs", function() {

    using("tab indents",
      [
        [-2, ''],
        [0, ''],
        [1, '\t'],
        [2, '\t\t'],
        [10, '\t\t\t\t\t\t\t\t\t\t']
      ],
      function(numberOfIndents, tabString) {

        it("gets tab intents", function() {
          expect(storyReporter.getTabIndents(numberOfIndents)).toBe(tabString);
        });
      });
  });


  using("spec sets",
    [
      [
        [
          {"id": 0, "description": "has a passing child test", "suite": ["Initial spec"], "success": true, "skipped": false, "time": 3, "log": []}
        ],
        [ '- Initial spec:', '\thas a passing child test' ]
      ],
      [
        [
          {"id": 0, "description": "has a passing child test", "suite": ["Initial spec"], "success": true, "skipped": false, "time": 3, "log": []},
          {"id": 1, "description": "has a first test that passes", "suite": ["Story reporter"], "success": true, "skipped": false, "time": 0, "log": []}
        ],
        [ '- Initial spec:',
          '\thas a passing child test',
          '',
          '- Story reporter:',
          '\thas a first test that passes'
        ]
      ],
      [
        [
          {"id": 0, "description": "has a passing child test", "suite": ["Initial spec"], "success": true, "skipped": false, "time": 2, "log": []},
          {"id": 1, "description": "has a first test that passes", "suite": ["Story reporter"], "success": true, "skipped": false, "time": 1, "log": []},
          {"id": 2, "description": "has a first test that fails", "suite": ["Story reporter"], "success": false, "skipped": false, "time": 0, "log": ["Expected true to be falsy."]},
          {"id": 3, "description": "has a passing child test", "suite": ["Story reporter", "nested spec"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 4, "description": "has an initial test that passes", "suite": ["Story reporter", "with deeply nested spec"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 5, "description": "has a test that fails", "suite": ["Story reporter", "with deeply nested spec"], "success": false, "skipped": false, "time": 0, "log": ["Expected null not to be null."]},
          {"id": 6, "description": "has a passing child test", "suite": ["Story reporter", "with deeply nested spec", "nested further"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 7, "description": "has a passing child test", "suite": ["Story reporter", "with deeply nested spec", "nested further", "and even further"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 8, "description": "passes this test", "suite": ["Story reporter", "with deeply nested spec", "with a failing child spec"], "success": true, "skipped": false, "time": 0, "log": []},
          {"id": 9, "description": "fails this test", "suite": ["Story reporter", "with deeply nested spec", "with a failing child spec", "with failing test"], "success": false, "skipped": false, "time": 0, "log": ["Expected false to be truthy."]},
          {"id": 10, "description": "passes this test", "suite": ["Story reporter", "with deeply nested spec", "with a failing child spec", "with failing test", "child of failing test"], "success": true, "skipped": false, "time": 0, "log": []}
        ],
        [ '- Initial spec:',
          '\thas a passing child test',
          '',
          '- Story reporter:',
          '\thas a first test that passes',
          '\thas a first test that fails',
          '',
          '\t- nested spec:',
          '\t\thas a passing child test',
          '',
          '\t- with deeply nested spec:',
          '\t\thas an initial test that passes',
          '\t\thas a test that fails',
          '',
          '\t\t- nested further:',
          '\t\t\thas a passing child test',
          '',
          '\t\t\t- and even further:',
          '\t\t\t\thas a passing child test',
          '',
          '\t\t- with a failing child spec:',
          '\t\t\tpasses this test',
          '',
          '\t\t\t- with failing test:',
          '\t\t\t\tfails this test',
          '',
          '\t\t\t\t- child of failing test:',
          '\t\t\t\t\tpasses this test'
        ]
      ]
    ],
    function(testResults, expectedFormatting) {

      it("detects spec success", function() {
        var suiteOutputCache = {content: []};
        storyReporter.writeToCache = function(output) {
          suiteOutputCache.content.push(output);
        };
        storyReporter.write = function() {
        };

        testResults.forEach(function(result) {
          storyReporter.specSuccess(browser, result);
        })

        storyReporter.flushCache();

        var formattedSpecs = [];
        suiteOutputCache.content.forEach(function(spec) {
          var specName = spec[2];
          formattedSpecs.push(specName);
        });

        expect(formattedSpecs).toEqual(expectedFormatting);
      });
    });
});
