angular.module('staff', ['ionic', 'ngResource', 'staff.controllers', 'staff.services'])

.run(function($ionicPlatform, $rootScope, $localStorage, $location, $state, $http, $ionicLoading, APIService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  })

  $rootScope.server = $localStorage.get('server') || 'http://stealth-new.suse.de:3001'
  $rootScope.connected = $rootScope.connected || false;
  $rootScope.error_message = "No Internet connection or not in the internal SUSE network?"

  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
    if($rootScope.connected) {
      return;
    } else {
      console.log("Offline")
      // FIXME: use APIService.status() see SettingsCtrl
      $http.get($rootScope.server).success(function(data, status, headers, config) {
        if(!$rootScope.connected) {
          console.log("Not connected")
          $rootScope.connected = true;
        }
      }).error(function(data, status, headers, config) {
        $ionicLoading.hide()
        $state.go('tab.status');
      });
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  .state('tab.status', {
    url: '/status',
    views: {
      'tab-status': {
        templateUrl: 'templates/tab-status.html',
        controller: 'StatusCtrl'
      }
    }
  })

  .state('tab.employees', {
      url: '/employees',
      views: {
        'tab-employees': {
          templateUrl: 'templates/tab-employees.html',
          controller: 'EmployeesCtrl'
        }
      }
  })

  .state('tab.employee-detail', {
    url: '/employees/:employeeId',
    views: {
      'tab-employees': {
        templateUrl: 'templates/employee-detail.html',
        controller: 'EmployeeDetailCtrl'
      }
    }
  })

  .state('tab.team', {
    url: '/employees/:employeeId/team',
    views: {
      'tab-employees': {
        templateUrl: 'templates/team.html',
        controller: 'TeamMembersCtrl'
      }
    }
  })

  .state('tab.newcomers', {
    url: '/newcomers',
    views: {
      'tab-newcomers': {
        templateUrl: 'templates/tab-newcomers.html',
        controller: 'NewcomersCtrl'
      }
    }
  })

  .state('tab.newcomer-detail', {
    url: '/newcomers/:employeeId',
    views: {
      'tab-newcomers': {
        templateUrl: 'templates/employee-detail.html',
        controller: 'EmployeeDetailCtrl'
      }
    }
  })

  .state('tab.apprentices', {
    url: '/apprentices',
    views: {
      'tab-apprentices': {
        templateUrl: 'templates/tab-apprentices.html',
        controller: 'ApprenticesCtrl'
      }
    }
  })

  .state('tab.apprentices-detail', {
    url: '/apprentices/:employeeId',
    views: {
      'tab-apprentices': {
        templateUrl: 'templates/employee-detail.html',
        controller: 'EmployeeDetailCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })

  $urlRouterProvider.otherwise('/tab/employees');
});

