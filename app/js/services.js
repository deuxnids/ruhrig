(function() {
   'use strict';

   /* Services */

   angular.module('myApp.services', [])

      // put your services here!
      // .service('serviceName', ['dependency', function(dependency) {}]);

     .factory('messageList', ['fbutil', function(fbutil) {
       return fbutil.syncArray('messages', {limit: 10, endAt: null});
     }])
     .factory('activityList', ['fbutil', function(fbutil) {
       return fbutil.syncArray('activities', {limit: 10, endAt: null});
     }])
     .factory('sectionList', ['fbutil', function(fbutil) {
       return fbutil.syncArray('sections', {limit: 10, endAt: null});
     }])
     .factory('difficultyList', ['fbutil', function(fbutil) {
      return {
        listFor: function(activity) {
          var difficulties = [];
          if(activity.difficulties){
            activity.difficulties.forEach(function(difficulty){
              console.log(difficulty);
              difficulties.push(fbutil.syncObject('difficulties/'+difficulty )); 
            })
          }
          return difficulties;
        },
        array: fbutil.syncArray('difficulties', {limit: 10, endAt: null} ),
        path:  fbutil.ref('difficulties'),

      };
      }]);
})();

