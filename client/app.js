Template.messages.helpers({
  messages: Messages.find({})
});

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Template.registerHelper("timestampToTime", function (timestamp) {
	var date = new Date(timestamp);
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	return hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
});

Template.registerHelper("usernameFromId", function (userId) {
	var user = Meteor.users.findOne({_id: userId});
	if (typeof user === "undefined") {
		return "Anonymous";
	}
	if (typeof user.services.github !== "undefined") {
		return user.services.github.username;
	}
	return user.username;
});

Template.footer.events({
  'keypress input': function(e) {
    var inputVal = $('.input-box_text').val();
    if(!!inputVal) {
      var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
      if (charCode == 13) {
        e.stopPropagation();
        Meteor.call('newMessage', {text: $('.input-box_text').val()});
        $('.input-box_text').val("");
        return false;
      }
    }
  }
});

Meteor.call('newMessage', {text: $('.input-box_text').val()});

Meteor.methods({
  newMessage: function (message) {
  	message.timestamp = Date.now();
    message.user = Meteor.userId();
    Messages.insert(message);
  }
});

Meteor.subscribe('messages');
Meteor.subscribe('allUsernames');
