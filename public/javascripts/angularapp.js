var app = angular.module('testapp', ['ui.router']);


app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
      $stateProvider
        .state('hello', {
          url: '/hello',
          templateUrl: 'template/hello.html',
          controller: 'MainCtrl',
          resolve: {
                postPromise: ['poster', function(poster){
                  return poster.getAll();
                }]
              }
        })
        .state('posts', {
        url: '/posts/{id}',
        templateUrl: 'template/posts.html',
        controller: 'PostsCtrl',
        resolve: {
            post: ['$stateParams', 'poster', function($stateParams, poster) {
              return poster.get($stateParams.id);
            }],

            comment: ['$stateParams', 'poster', function($stateParams, poster){
            return poster.getAllComments($stateParams.id);
        }]
          }
      });

      $urlRouterProvider.otherwise('hello');
    }]);


app.factory('poster', ['$http', function($http){
    var o = {
      post: [],
      comment: []
    };

     o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.post);
    });
  };

       o.getAllComments = function(id) {
    return $http.get('/comments/'+ id).success(function(data){
      angular.copy(data, o.comment);
      
    });
  };


  o.create = function(post) {
  return $http.post('/posts', post).success(function(data){
    o.post.push(data);
  });
};



o.get = function(id) {
  return $http.get('/posts/' + id).then(function(res){
    return res.data;
  });
};


o.addComment = function(id, comment) {
  return $http.post('/posts/' + id + '/comments', comment).success(function(data){
      console.log(data);
      o.comment.push(comment);
  });

};

    return o;
}]);


app.controller('MainCtrl', [
  '$scope',
  'poster',
  function($scope, poster){
    $scope.posts = poster.post;
    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; }
        poster.create({
          title: $scope.title,
          link: $scope.link,
        });
        $scope.title = '';
        $scope.link = '';
    }
    


    $scope.incrementUpvotes = function(post){
      post.upvotes += 1;
    }
  }]);

app.controller('PostsCtrl', [
    '$scope',
    'poster',
    'post',
    function($scope, poster, post){
      
      $scope.comments=poster.comment;
      $scope.post = post[0];
      $scope.addComment = function(){
      if($scope.text === '') { return; }
      poster.addComment($scope.post.id, {
        body: $scope.text,
        author: 'user',
        id:  $scope.post.id,
        upvotes: 0,
      });

      $scope.text = '';

      
    };
      

           

      $scope.incrementUpvotes = function(comment){
      comment.upvotes += 1;
    }

    }]);




