var viewModel = function () {
    var self = this;
    this.form = {
        userName: ko.observable(),
        userPwd: ko.observable(),
        remember: ko.observable(false)
    };
    this.message = ko.observable();
    this.loginClick = function (form) {
        var data = { "name": self.userName, "password": self.userPwd }
        $.ajax({
            type: "POST",
            url: "login/doAction",
            data: ko.toJSON(self.form),
            success: function (d) {
                if (d.status == 'success') {
                    self.message("登陆成功正在跳转，请稍候...");
                    window.location.href = '/';
                } else {
                    self.message(d.message);
                }
            },
            error: function (e) {
                self.message(e.responseText);
            },
            beforeSend: function () {
                $(form).find("input").attr("disabled", true);
                self.message("正在登陆处理，请稍候...");
            },
            complete: function () {
                $(form).find("input").attr("disabled", false);
            }
        });
    };

    this.resetClick = function () {
        self.form.userName("");
        self.form.userPwd("");
        self.form.remember(false);
    };
};

$(function () { ko.applyBindings(new viewModel());});