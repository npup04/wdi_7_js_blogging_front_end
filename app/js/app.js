/*global $:false*/
'use strict';

//optional for debugging
var trace = function(){
  for(var i = 0; i < arguments.length; i++){
    console.log(arguments[i]);
  }
};

var App = App || {};

App.submitPost = function(event){
  if(event.preventDefault) event.preventDefault();//here we are just asking if it exists
  $.ajax({
    url: 'http://localhost:3000/posts',
    type: 'POST',
    dataType: 'JSON',
    data: {
      post: {
        title: $('#post-title').val(),
        body: $('#post-body').val()
      }
    },
    headers: {'AUTHORIZATION': '15e8dee481554b36ab7a6acbfe8e006b'},
    //headers is an object that takes a key value pair, all caps AUTHORIZATION. every post made will be by this user b/c we'll keep the token the same
  }).done(function(data){
    console.log('submitPost SUCCESSFUL');
    trace(data);
  }).fail(function(jqXHR, textStatus, errorThrown){
    trace(jqXHR, textStatus, errorThrown);
  });
  return false;
};

App.submitUser = function(event, form){
    if(event.preventDefault) event.preventDefault();//here we are just asking if it exists
    $.ajax({
      url: 'http://localhost:3000/users',
      type: 'POST',
      dataType: 'JSON',
      data:{
        user: {
          username: $('#username').val(),
          email: $('#email').val(),
          password: $('#password').val(),
          password_confirmation: $('#passwordconfirmation').val(),
          role: $('#role').val(),
          first_name: $('#firstname').val(),
          last_name: $('#lastname').val(),
        }
      },
      success: function(data, textStatus,jqXHR){
        trace('I made a new User', data, textStatus,jqXHR);
      },
    }).done(function(data){
      trace(data);
    }).fail(function(jqXHR, textStatus, errorThrown){
      trace(jqXHR, textStatus, errorThrown);
    });
}; //end App.submitUser

App.get_all_users_posts = function(users){
  //Display only users who have posts
  var templateSource = $("#results-template").html();
  var template = Handlebars.compile(templateSource);
  var users_with_posts = [];
  users.forEach(function(user){
    if(user.posts.length >= 1){
      users_with_posts.push(user);
      console.log(user.username + " , " + user.posts.length);
      console.log(users_with_posts);
    }
  });

  //Display users with posts in the handlebars template:
  $(".posts").html(template(users_with_posts));

};//end App.get_all_users_posts

App.displayUserPosts = function(users){
  $('.posts').append('<p>');
  $('.posts').append('username: ' + users.username + '<br>');
  $('.posts').append('</p>');
};//end App.displayUserPosts

$(document).ready(function(){
  $.ajax({
    url: 'http://localhost:3000/users',
    type: 'GET'
  }).done(function(users){
    console.log("GET success");
    console.log(users);
    // debugger;
    App.get_all_users_posts(users);
  }).fail(function(jqXHR, textStatus, errorThrown){
    trace(jqXHR, textStatus, errorThrown);
  });



  var $userForm = $('form#user-form');//use the form element with id of user-form
  $userForm.on('submit', function(event){
    App.submitUser(event, $userForm);
  });

  var $postForm = $('form#new-post-form');
  $postForm.on('submit', function(event){
    App.submitPost(event);
  });
  // trace('Hello World');
}); //end document ready

//delete/splice a post from a user:
// users.posts.splice(0,1)

//username
// console.log(users[0].username);
// users[0].username

//posts[0]
//delete(posts[0])
//posts[0].splice(1,1)

// info.links.splice(1,1)
// delete(info.links[2])
