var SocketMixin = require("../mixins/socket");
var ApplicationController = Ember.ObjectController.extend(SocketMixin,{
  isSidebarOpen: false,
  sockets: {
    config: {
      messagePath: "issueNumber",
      channelPath: "repositoryName"
    },
    issue_closed: function(message) {
      var issue = this.get("model.board.issues").findBy('number', message.issue.number);

      if(issue) {
        issue.set("state", "closed");
      } else {
        this.get("model.board.issues").pushObject(App.Issue.create(message.issue));
        this.send("forceRepaint");
      }
    },
    issue_opened: function(message) {
      var issue = this.get("model.board.issues").findBy('number', message.issue.number);

      if(issue) {
        issue.set("state", "open");
      } else {
        var model = App.Issue.create(message.issue);
        if(message.issue.current_state.name === "__nil__") {
          model.set("current_state", this.get("model.board.columns.firstObject"));
        }else {
          var column = this.get("model.board.columns").find(function(c) {
            return c.name == message.issue.current_state.name;
          });
          model.set("current_state", column);
        }
        this.get("model.board.issues").pushObject(model);
        this.send("forceRepaint");
      }
    },
    issue_reopened: function(message) {
      var issue = this.get("model.board.issues").findBy('number', message.issue.number);

      if(issue) {
        issue.set("state", "open");
      } else {
        this.get("model.board.issues").pushObject(App.Issue.create(message.issue));
        this.send("forceRepaint");
      }
    }
  },
  issueNumber: function () {
     return "*";
  }.property(),
  repositoryName: function () {
    // FIXME: file a bug report about the model not being set here
    return this.target.router.activeTransition.resolvedModels.application.get("full_name")
  }.property(),
})

module.exports = ApplicationController;
