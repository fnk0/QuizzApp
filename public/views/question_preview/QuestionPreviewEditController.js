'use strict';

(function () {
    var app = angular.module('CS4570');
    app.controller('QuestionPreviewEditController', ['$http', '$scope', '$window', '$filter',
        '$location', '$rootScope', '$cookies', '$routeParams', 'questionService',
        function ($http, $scope, $window, $filter, $location, $rootScope, $cookies, $routeParams, questionService) {

            var self = this;
            $scope.difficulties = ["Easy", "Medium", "Hard"];

            var path = $location.$$path;
            if(path.search("questionPreview") > 0) {
                self.questionType = "preview";
                $rootScope.currentPage = "upload";
            } else if (path.search("editQuestion") > 0) {
                self.questionType = "edit";
                $rootScope.currentPage = "my_questions";
            } else {
                self.questionType = "new";
                $rootScope.currentPage = "upload";
            }

            self.newTestCase = {};
            self.newInputFile = {};
            self.questionId = $routeParams.id;
            self.question = {};
            self.question.testCases = [];
            self.question.inputFiles = [];
            self.cmOption = {
                lineNumbers: true,
                mode: 'text/x-java',
                theme: 'monokai'
            };

            $('.chips-placeholder').material_chip({
                placeholder: '+Category',
                secondaryPlaceholder: 'Enter a category'
            });

            if (self.questionId) {
                questionService.getEditQuestion(self.questionId)
                    .then(function (data) {
                        self.question = data.question;
                        self.question.filename = data.filename;
                        $('#body').trigger('autoresize');
                    });
            }

            self.addTestCase = function () {
                self.question.testCases.push(self.newTestCase);
                self.newTestCase = {};
            };

            self.addInputFile = function () {
                var inputFile = {};
                if (self.newInputFile.isReference) {
                    inputFile.reference = self.newInputFile.nameRef;
                } else {
                    inputFile.name = self.newInputFile.nameRef;
                    inputFile.contents = self.newInputFile.contents;
                }
                self.question.inputFiles.push(inputFile);
                self.newInputFile = {};
            };

            self.submit = function () {
                if (self.questionId) {
                    self.update();
                    return
                }
                self.upload();
            };

            self.update = function () {
                questionService.updateQuestion(self.question)
                    .then(function (result) {
                        self.question = result.question;
                        self.question.filename = result.filename;
                        if (self.questionType == 'preview') {
                            // TODO send to the user preview. Need the page to be done first
                        } else {
                            Materialize.toast('Question updated.', 4000);
                        }
                    });
            };

            self.upload = function () {
                questionService.uploadQuestion(self.question)
                    .then(function (result) {
                        // TODO send to the user preview. Need the page to be done first
                    });
            };
        }]);
})();