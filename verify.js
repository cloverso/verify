(function(){
    // 校验插件
    if(!$.fn.hasOwnProperty('verify')){
        $.fn.verify = function(config) {
            var fields = [], item;
            if (!config) return;
            // 判断是否函数
            function isFunction(obj) {
                return !!(obj && obj.constructor && obj.call && obj.apply);
            }
            // 表单提交校验(全部)
            function handleSubmit() {
                var  i, errors = false, len = fields.length;
                for (i = 0; i < len; i++) {
                    if (!fields[i].testValid()) errors = true;
                }
                if (errors) return false;
                if (isFunction(config.success)) return config.success();
            }
            function process(opts, selector) {
                var field = $(selector),
                    error = {message: opts.message || ''},
                    errorEl = config.errorTemplate(error);
                // 将单个input事件对象追加到数组中，提交表单时遍历执行                    
                fields.push(field);
                // 核心处理方法
                field.testValid = function testValid() {
                    var temp, error, el = $(this), val = el.val();
                    error = !opts.test(val);
                    if (error) {
                        el.after(errorEl);
                        return false;
                    } else {
                        temp = errorEl.get(0);
                        temp.parentNode && temp.parentNode.removeChild(temp);
                        return true;
                    }
                };
                // 单个input元素注册失焦事件
                field.on('blur', field.testValid);
            }
            // 遍历对象
            for(item in config.fields) {
                process(config.fields[item], item)
            }
            // 提交按钮注册事件
            if (config.submitButton) {
                $(config.submitButton).click(handleSubmit);
            } else {
                this.on('submit', handleSubmit);
            }
            // 返回集合，供调用
            return fields;            
        }
    }    
})();
