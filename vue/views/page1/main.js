import Vue from "vue";
import {
  Button,
  Table,
  TableColumn,
  Form,
  FormItem,
  Drawer,
  Switch,
  Select,
  Option,
  Input,
  InputNumber,
  Cascader,
  Alert,
  Loading
} from 'element-ui';
import '../../lib/theme-vscode.scss';
// import 'element-ui/lib/theme-chalk/index.css';
import Component from "../../component"; //自定义组件

//------------ 全局资源 开始 ------------------
import App from "./App"; //装配页
//------------ 全局资源 结束 ------------------

//------------ Vue全局配置 开始 ---------------
Vue.config.productionTip = false;
//------------ Vue全局配置 结束 ---------------

//------------ 处理VSCODE交互环境 开始 --------------
if (process.env.NODE_ENV == "production") {
  let { postMessage } = require("../../lib/vscIo")
  Vue.prototype.$vscPost = postMessage
} else {
  Vue.prototype.$vscPost = (...args) => console.log(args)
}
//------------ 处理VSCODE交互环境 结束 --------------

//------------ Vue插件装配 开始 -----------------
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Drawer);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Loading);
Vue.use(Component);

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
//------------ Vue插件装配 结束 -----------------

export default new Vue({
  render: h => h(App)
}).$mount("#app");
