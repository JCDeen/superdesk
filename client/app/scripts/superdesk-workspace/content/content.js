(function() {
    'use strict';

    ContentCtrlFactory.$inject = ['api', 'superdesk', 'templates', 'desks', 'archiveService'];
    function ContentCtrlFactory(api, superdesk, templates, desks, archiveService) {
        return function ContentCtrl($scope) {
            var templateFields = [
                'abstract',
                'anpa_take_key',
                'body_html',
                'byline',
                'dateline',
                'headline',
                'language',
                'more_coming',
                'pubstatus',
                'slugline',
                'type'
            ];

        var scope = $scope;

        /**
         * Create an item and start editing it
         */
        this.create = function(type) {
            if (scope.dirty){
                scope.closeOpenNew(createItem, type);
            } else {
                createItem(type);
            }
        };

        var createItem = function (type) {
            var item = {type: type || 'text', version: 0};
            api('archive').save(item).then(function() {
                superdesk.intent('author', 'article', item);
            });
        };

        this.createPackage = function createPackage(current_item) {
            if (scope.dirty){
                scope.closeOpenNew(createPackageItem, current_item);
            } else {
                createPackageItem(current_item);
            }
        };

        var createPackageItem = function (current_item) {
            if (current_item) {
                superdesk.intent('create', 'package', {items: [current_item]});
            } else {
                superdesk.intent('create', 'package');
            }
        };

        this.createFromTemplate = function(template) {
            if (scope.dirty){
                scope.closeOpenNew(createFromTemplateItem, template);
            } else {
                createFromTemplateItem(template);
            }
        };

        var createFromTemplateItem = function (template) {
            var item = _.pick(template, templateFields);
            api('archive').save(item).then(function() {
                return templates.addRecentTemplate(desks.activeDeskId, template._id);
            })
            .then(function() {
                superdesk.intent('author', 'article', item);
            });
        };
    }

    angular.module('superdesk.workspace.content', ['superdesk.templates'])
        .factory('ContentCtrl', ContentCtrlFactory);
})();
