var app = tcb.init({
  env: "云开发环境ID",
});
var auth = app.auth();
var cloudload = false;
cloudinit();
function cloudinit() {
  auth
    .anonymousAuthProvider()
    .signIn()
    .then((res) => {
      console.log("初始化成功！");
      cloudload = true;
      see();
    })
    .catch((err) => {
      console.log(err);
    });
}

function see() {}

function callnet() {
  if (!cloudload) return;
  app
    .callFunction({
      name: "app",
    })
    .then((res) => {
      console.log("上报成功！", res);
    })
    .catch((err) => {
      console.log(err);
    });
}
