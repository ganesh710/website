var app = angular.module("app",[]);
app.controller("Controller",function($scope,$http,$window) {
	$scope.login = function(log) {
		$http({
			method:'post',
			url:'/logindetails',
			data:$scope.log

		}).then(function success(responce) {
			alert("login successfull");
			window.location.href = '/';
			$scope.log = {};
		}),function error(responce) {
			alert("invalid credentials");
			window.location.href = '/login';
		}
	}
})