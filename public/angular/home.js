var app = angular.module("myapp",[]);
app.controller("mycontroller",function($scope,$http) {
	$scope.signup = function(user) {
		console.log($scope.user);
		$http({
			method:'post',
			url:'/postsignupdata',
			data:$scope.user
		}).then(function success(responce) {
			alert("user added successfully");
			$scope.user = {};
		}),function error(responce) {
			alert("error occoured!try again later");
		}
	}
	$scope.register = function(pack) {
		console.log($scope.pack);
		$http({
			method:'post',
			url:'/poststudentdata',
			data:$scope.pack
		}).then(function success(responce) {
			alert("details sent to database");
			$scope.student.push(pack);
			$scope.pack = {};
		}),function error(responce) {
			alert("error occured please try again later!")
		}
	}
	$http({
		method:'get',
		url:'/getdatafromdb',

	}).then(function success(responce) {
		$scope.student = responce.data;
	}),function error(responce) {
		alert("error occured! try again later");
	}
	$scope.deletedata = function(field) {
		$http({
		method:'delete',
		url:'/deletedata'+field._id,
	}).then(function success(responce) {
		alert("data deleted");
		var index = $scope.student.indexOf(field);
		$scope.student.splice(index,1);
	}),function error(responce) {
		alert("error occured try after some time");
	}
	}	
})