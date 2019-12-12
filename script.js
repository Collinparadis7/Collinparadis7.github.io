var app = angular.module('App', []); 
  
/**
 * @name ctrl
 * @desc ctrl Controller
 **/

app.controller('ctrl', function($scope, $filter) {

  $scope.appHeadline = "Angular 1.4x CURD Application";

  $scope.addIf = false;
  //localStorage.clear();
  $scope.saved = localStorage.getItem('items');
  $scope.items = ($scope.saved !== null) ? JSON.parse($scope.saved) : [{
    username: 'Jondi Rose',
    fullname: 'Alfred Jond Rose',
    point: 1234,
    notes: 'super user'
  }, {
    username: 'Dulal',
    fullname: 'Jonathan Smith',
    point: 23,
    notes: 'new user'
  }];
  localStorage.setItem('items', JSON.stringify($scope.items));

  $scope.listLength = $scope.items.length;
  $scope.data = {
    availableOptions: [{
      id: '1',
      name: '5',
      value: 5
    }, {
      id: '2',
      name: '10',
      value: 10
    }, {
      id: '3',
      name: '15',
      value: 15
    }, {
      id: '4',
      name: 'All',
      value: $scope.listLength
    }],
    limit: {
      id: '1',
      name: '5',
      value: 5
    } //This sets the default value of the select in the ui
  };

  //$scope.sortingOrder = sortingOrder;
  $scope.reverse = false;
  $scope.filteredItems = [];
  $scope.groupedItems = [];
  $scope.itemsPerPage = $scope.data.limit;
  $scope.pagedItems = [];
  $scope.currentPage = 0;

  /* $scope.$watch("[search , data.limit]", function(query) {
    // $scope.filteredData = $filter("filter")($scope.items, query[0]);
     //$scope.limitedData = $filter('limitTo')($scope.filteredData, query[1].value, 0);
   });*/

  /* $scope.groupToPages = function () {
        $scope.pagedItems = [];
        
        for (var i = 0; i < $scope.filteredData.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredData[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredData[i]);
            }
        }
    };*/

  $scope.range = function(start, end) {
    var ret = [];
    if (!end) {
      end = start;
      start = 0;
    }
    if (end < $scope.data.limit.value) {
      end = 1;
    } else {
      end = Math.ceil(end / $scope.data.limit.value)
    }
    for (var i = start; i < end; i++) {
      ret.push(i);
    }
    return ret;
  };

  $scope.prevPage = function() {
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
    }
  };

  $scope.nextPage = function() {
    if ($scope.currentPage < $scope.pagedItems.length - 1) {
      $scope.currentPage++;
    }
  };

  $scope.setPage = function() {
    $scope.currentPage = this.n;
  };

  $scope.addToggle = function() {
    $scope.addIf = !($scope.addIf);
  };

  $scope.$on('addItem', function(event, data) {
    $scope.items.push(data);
    localStorage.setItem('items', JSON.stringify($scope.items));

    $scope.addIf = !($scope.addIf);
  });

  $scope.$on('update', function(event, data, index) {
    angular.copy(data, $scope.items[index]);
    localStorage.setItem('items', JSON.stringify($scope.items));
  });

  $scope.$on('deleteItem', function(event, index) {
    $scope.items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify($scope.items));
  });

  $scope.$on('cancel', function(event) {
    $scope.addIf = !($scope.addIf);
  });

});

/**
 * @name addList
 * @desc <add-list> Directive
 */
function addList() {
  return {
    scope: {
      item: '=addList',
      addIf: '=',
      addItem: '&',
      cancel: '&'
    },
    restrict: 'EA',
    template: '<td class="sorting_1"><input type="text" class="form-control small" ng-model="newval.username" value=""></td><td class=""><input type="text" class="form-control small" value="" ng-model="newval.fullname"></td><td class=""><input type="text" class="form-control small" value="" ng-model="newval.point"></td><td class=""><input type="text" class="form-control small" value="" ng-model="newval.notes"></td><td class=""><button class="btn btn-success btn-xs edit" ng-click="addItem(newval)"><i class="fa fa-user-plus"></i></button><button class="btn btn-danger btn-xs cancel" ng-click="cancel()"><i class="fa fa-times"></i></button></td>',
    transclude: true,
    controller: function($scope, $element, $transclude) {
      $scope.addItem = function(data) {
        $scope.$emit('addItem', data);
        $scope.newval = {}; //clear the input after adding
      };

      $scope.cancel = function() {
        $scope.$emit('cancel');
        $scope.newval = {}; //clear the input on cancel
      }
    }
  };
}

app.directive('addList', addList);

/**
 * @name tdRow
 * @desc <td-row> Directive
 */
function tdRow() {

  var link = function($scope, $element, $attrs) {};

  var controller = function($scope, $element, $transclude) {
    $scope.edit = false;

    $scope.editItem = function(oldData) {
      $scope.edit = angular.copy(oldData);
      $scope.mode = "edit";
    }

    $scope.deleteItem = function(index) {
      $scope.$emit('deleteItem', index);
    }

    $scope.cancelUpdateItem = function(index) {
      $scope.mode = "default";
    }

    $scope.updateItem = function(data, index) {
      $scope.$emit('update', data, index);
      $scope.mode = "default";
    }
  }

  return {
    scope: {
      item: '=tdRow',
      index: '@',
      editItem: '&',
      updateItem: '&',
      deleteItem: '&',
      filterBy: '='
    },
    restrict: 'EA',
    template: '<td class="sorting_1" ng-switch="mode"><input type="text" class="form-control small" ng-switch-when="edit" id="edit" ng-model="edit.username"><span ng-switch-default id="item.username">{{item.username}}</span></td><td ng-switch="mode"><input type="text" class="form-control small" ng-switch-when="edit" id="edit" ng-model="edit.fullname"><span ng-switch-default id="item.fullname">{{item.fullname}}</span></td><td ng-switch="mode"><input type="text" class="form-control small" ng-switch-when="edit" id="edit" ng-model="edit.point"><span ng-switch-default id="item.point">{{item.point}}</span></td><td ng-switch="mode"><input type="text" class="form-control small" ng-switch-when="edit" id="edit" ng-model="edit.notes"><span ng-switch-default id="item.notes">{{item.notes}}</span></td><td ng-switch="mode"><button class="btn btn-success btn-xs edit" ng-switch-when="edit" ng-click="updateItem(edit, index)"><i class="fa fa-floppy-o"></i></button><button class="btn btn-success btn-xs" ng-switch-default ng-click="editItem(item)"><i class="fa fa-pencil-square-o "></i></button><button class="btn btn-danger btn-xs edit" ng-switch-when="edit" ng-click="cancelUpdateItem(index)"><i class="fa fa-times"></i></button><button class="btn btn-danger btn-xs" ng-switch-default class="edit" ng-click="deleteItem(index)"><i class="fa fa-trash-o"></i></button></td>',
    transclude: true,
    controller: controller,
  }
}

app.directive('tdRow', tdRow);