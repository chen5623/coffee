import Vue from 'vue'

// 导入组件
import {Toast} from 'vant'

// 注册组件
Vue.use(Toast)

class ValidForm {
    constructor() {}

    valid(opt) {
        // 测试
        // 

        for(let key in opt) {
            if(!opt[key].reg.test(opt[key].value)) {
                

                Toast(opt[key].errorMsg);

                // 表单验证不通过
                return false;
            }
        }
        // 表单验证通过
        return true
    }
}

// 导出模块
export const validForm = new ValidForm();