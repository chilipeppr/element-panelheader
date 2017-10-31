// //www.google-analytics.com/analytics.js
requirejs.config({
  paths: {
    google: '//www.google-analytics.com/analytics'
  }
});

// Test this element. This code is auto-removed by the chilipeppr.load()
cprequire_test(["inline:com-chilipeppr-hdr"], function(header) {
  console.log("test running of " + header.id);
  header.init();
  //header.editBoot();
} /*end_test*/ );

cpdefine("inline:com-chilipeppr-hdr", ["chilipeppr_ready", "google"], function(cp, google) {
  return {
    id: "com-chilipeppr-hdr",
    url: "http://fiddle.jshell.net/chilipeppr/7aX6x/show/light/",
    fiddleurl: "http://jsfiddle.net/chilipeppr/7aX6x/",
    name: "Widget / Header",
    desc: "This widget is the header panel.",
    publish: null,
    subscribe: null,
    isConnected: false,
    init: function() {
      this.setupYourWorkspaces();
      this.setupLinks();
      this.checkLogin();
      this.editBootSetup();
      this.setupForceRefresh();
      this.setupToggleConsole();
      $('#mainnav a').popover();
      //this.doAnalytics();
      //this.editBoot();
      console.log(this.name + " done loading.");
    },
    setupYourWorkspaces: function() {
    
      // Inject "Your Workspaces" widget
      //com-chilipeppr-widget-yourworkspaces-instance
      chilipeppr.load(
        "#com-chilipeppr-widget-yourworkspaces-instance",
        "http://raw.githubusercontent.com/chilipeppr/widget-yourworkspaces/master/auto-generated-widget.html",
        function() {
          // Callback after widget loaded into #myDivWidgetYourworkspaces
          // Now use require.js to get reference to instantiated widget
          cprequire(
            ["inline:com-chilipeppr-widget-yourworkspaces"], // the id you gave your widget
            function(myObjWidgetYourworkspaces) {
              // Callback that is passed reference to the newly loaded widget
              console.log("Widget / Your Workspaces just got loaded.", myObjWidgetYourworkspaces);
              myObjWidgetYourworkspaces.init();
              
              $('#mainnav .com-chilipeppr-hdr-yourws').click(function() {
              console.log("showing your workspaces");
              myObjWidgetYourworkspaces.show();
              });
              
            }
          );
        }
      );
      
    },
    isDebugOutputOn: false, // track on/off
    origConsole: null, // store orig console method
    setupToggleConsole: function() {
      $('#com-chilipeppr-topbar-menu-toggleconsolelog').popover();
      $('#com-chilipeppr-topbar-menu-toggleconsolelog').click(this.toggleConsoleLog.bind(this));

      if (!this.isDebugOutputOn) {
        // repoint console.log
        this.origConsole = console.log;
        console.log = function() {};
      }
    },
    toggleConsoleLog: function() {
      this.isDebugOutputOn = !this.isDebugOutputOn;
      if (this.isDebugOutputOn) {
        console.log = this.origConsole;
        chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Debug Console Output On", "Now logging debug output to console.");
      } else {
        this.origConsole = console.log;
        console.log = function() {};
        chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Debug Console Output Off", "No longer logging debug output to console.");
      }
    },
    setupForceRefresh: function() {
      $('#com-chilipeppr-topbar-menu-forcerefresh').popover();
      $('#com-chilipeppr-topbar-menu-forcerefresh').prop('href', window.location.href + "?forcerefresh=true");
    },
    doFork: function() {
      //this.editBoot();
      cprequire(['inline:com-chilipeppr-widget-editbootscript'], function(editboot) {
        console.log("Since we're reopening edit boot dialog in fork mode, need to tell it");
        editboot.init();
        editboot.doFork();
        $('#com-chilipeppr-hdr-editbootmodal').modal({
          show: true
        });

        //console.log("re-initted");
      });
    },
    editBootSetup: function() {
      var that = this;
      chilipeppr.load("com-chilipeppr-hdr-editbootmodalbody", "http://fiddle.jshell.net/chilipeppr/uNALR/show/light/", function() {
        console.log("Done lazy loading edit boot jscript content");
        $("#com-chilipeppr-topbar-menu-editboot").click(that.editBoot);
      });
    },
    editBoot: function() {
      console.log("editing boot");

      cprequire(['inline:com-chilipeppr-widget-editbootscript'], function(editboot) {
        console.log("Since we're reopening edit boot dialog, reinitting");
        editboot.init();
        $('#com-chilipeppr-hdr-editbootmodal').modal({
          show: true
        });
        console.log("re-initted");
      });

    },
    currentUser: null,
    checkLogin: function() {
      var that = this;
      var jqxhr = $.ajax({
          url: "http://www.chilipeppr.com/datalogin?callback=?",
          dataType: 'jsonp',
          jsonpCallback: 'headerpanel_dataloginCallback',
          cache: true,
        }).done(function(data) {
          console.log(data);
          if (data.CurrentUser != undefined && data.CurrentUser != null) {
            console.log("user logged in ", data.CurrentUser);
            that.currentUser = data.CurrentUser;
            $('#com-chilipeppr-hdr-login').text(data.CurrentUser.Email);
            $('#com-chilipeppr-hdr-dd-login').addClass("hidden");
            $('#com-chilipeppr-hdr-dd-logout').prop('href', data.LogoutUrl);
            // if they click their login id log them out
            $('#com-chilipeppr-hdr-login').prop('href', data.LogoutUrl);
          } else {
            console.log("user NOT logged in");
            $('#com-chilipeppr-hdr-login').text("Login");
            $('#com-chilipeppr-hdr-dd-login').removeClass("hidden");
            $('#com-chilipeppr-hdr-dd-logout').addClass("hidden");
            $('#com-chilipeppr-hdr-dd-login').prop('href', data.LoginUrl);
            $('#com-chilipeppr-hdr-dd-login').prop('target', "new");
            $('#com-chilipeppr-hdr-login').prop('href', data.LoginUrl);
            $('#com-chilipeppr-hdr-login').prop('target', "new");
          }
          that.doAnalytics();
        })
        .fail(function() {
          that.doAnalytics();
        })
    },
    doAnalytics: function() {
      //console.log("Doing Google Analytics");
      //console.log("google:", google, "ga:", ga);
      ga('create', 'UA-51962619-1', 'chilipeppr.com');
      ga('require', 'displayfeatures');

      // Set the user ID using signed-in user_id.
      //console.log("currentUser", this.currentUser);
      if (this.currentUser != undefined && this.currentUser != null && this.currentUser.Email != undefined && this.currentUser.Email != null) {
        //console.log("Passing user id to Google");
        ga('set', '&uid', this.currentUser.Email);
      }

      ga('send', 'pageview');

      // resend this every 4.5 mins because Google Analytics
      // defaults to 5 mins being the definition of active
      setTimeout(this.doAnalytics.bind(this), 4.5 * 60 * 1000);
    },
    setupLinks: function() {
      $('#com-chilipeppr-hdr-wspick').click(this.onWsPick);
      var that = this;
      $('#com-chilipeppr-topbar-menu-forkws').click(function() {
        that.doFork();
      });
    },
    onWsPick: function() {
      console.log("Got into onWsPick");
      // lazy load the picker
      chilipeppr.load("#com-chilipeppr-hdr-modalbody", "http://fiddle.jshell.net/chilipeppr/8UwSX/show/light/", function() {
        console.log("Done lazy loading workspace picker content");
      });
    }
  }
});
