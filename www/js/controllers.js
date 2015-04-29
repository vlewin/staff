angular.module('staff.controllers', [])

.run(function($ionicPlatform, $rootScope, $ionicScrollDelegate) {
  $rootScope.scrollTop = function() {
    // FIXME: scrollTo is not working with tab on-select
    // console.log("scroll top")
    $ionicScrollDelegate.scrollTop(true)
  };

  $rootScope.showBack = function() {
    console.log("Show back")
    angular.element(document.querySelector('.back-button.hide')).removeClass('hide')
  };

  $rootScope.hideBack = function() {
    console.log("Hide back")
    angular.element(document.querySelector('.back-button.hide')).addClass('hide')
  };
})


.controller('EmployeesCtrl', function($rootScope, $scope, $resource, $interval, $http, $timeout, Employee) {
  $scope.searchKey = "";
  $scope.limit = 50;
  $scope.page = 0;
  $scope.total = 0;

  $scope.employees = []

  $scope.count = function() {
    $http.get($rootScope.server + '/employees/count').success(function(data, status, headers, config) {
      $scope.total = data.count;
    })
  }

  $scope.search = function () {
    if($scope.timeout) {
      clearTimeout($scope.timeout);
    }

    if($scope.searchKey) {
      $scope.timeout = setTimeout(function() {
        $scope.employees = Employee.query({search: $scope.searchKey});
      }, 300);
    } else {
      $scope.clearSearch()
    }
  }

  $scope.clearSearch = function () {
    $scope.searchKey = "";
    $scope.page = 0;
    $scope.employees = []
    $scope.loadMore()
  }

  $scope.loadMore = function() {
      Employee.query({ page: $scope.page, limit: $scope.limit}, function(employees) {
        $scope.employees =  $scope.employees.concat(employees)
        $scope.page++;

        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
  };

  $scope.isMore = function() {
    return (!$scope.searchKey && $scope.employees.length < $scope.total)
  };

  $scope.count()
})


.controller('EmployeeDetailCtrl', function($scope, $resource, $stateParams, Employee) {
  Employee.get({ id: $stateParams.employeeId }, function(employee) {
    $scope.employee = employee;
    $scope.manager = Employee.get({ id: $scope.employee.managerid }, function() {
    })
  });
})


.controller('TeamMembersCtrl', function($rootScope, $scope, $http, $stateParams) {
  $http.get($rootScope.server + '/employees/' + $stateParams.employeeId + '/team').success(function(data, status, headers, config) {
    $scope.id = $stateParams.employeeId
    $scope.employees = data
  })
})

.controller('NewcomersCtrl', function($rootScope, $scope, $http) {
  $http.get($rootScope.server + '/employees/newcomers').success(function(data, status, headers, config) {
    $scope.employees = data
  })
})

.controller('ApprenticesCtrl', function($rootScope, $scope, $http) {
  $http.get($rootScope.server + '/employees/apprentices').success(function(data, status, headers, config) {
    $scope.employees = data
  })
})

.controller('StatusCtrl', function($rootScope, $scope, $http) {
  $scope.checkStatus = function () {
    $http.get($rootScope.server).success(function(data, status, headers, config) {
      $rootScope.connected = true;
      $scope.api_url = config.url
    }).error(function(data, status, headers, config) {
      $scope.api_url = config.url
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.checkStatus()
})


.controller('SettingsCtrl', function($rootScope) {
})

