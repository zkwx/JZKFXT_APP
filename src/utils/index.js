import { AlertModule } from 'vux'
export default {
    GoodTime(str) {
        let now = new Date().getTime()
        let oldTime = new Date(str).getTime()
        let difference = now - oldTime
        let result = ''
        let minute = 1000 * 60
        let hour = minute * 60
        let day = hour * 24
        let month = day * 30
        let year = month * 12
        let _year = difference / year
        let _month = difference / month
        let _week = difference / (7 * day)
        let _day = difference / day
        let _hour = difference / hour
        let _min = difference / minute

        if (_year >= 1) {
            result = '发表于 ' + ~~(_year) + ' 年前'
        } else if (_month >= 1) {
            result = '发表于 ' + ~~(_month) + ' 个月前'
        } else if (_week >= 1) {
            result = '发表于 ' + ~~(_week) + ' 周前'
        } else if (_day >= 1) {
            result = '发表于 ' + ~~(_day) + ' 天前'
        } else if (_hour >= 1) {
            result = '发表于 ' + ~~(_hour) + ' 个小时前'
        } else if (_min >= 1) {
            result = '发表于 ' + ~~(_min) + ' 分钟前'
        } else {
            result = '刚刚'
        }
        return result
    },
    CalcAge(HasCertificate, Certificate, IDNumber) {
        var len = -1,
            number
        if (HasCertificate) {
            if (Certificate == null || Certificate.length < 20)
                return "请输入正确的证件号码"
            if (!/^\d{6}(19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|xX)[1-7][1-4]\d?$/i.test(Certificate))
                return "残疾证号格式错误"
            number = Certificate
        } else {
            if (IDNumber == null || IDNumber.length != 18)
                return "请输入正确的证件号码"
            if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|xX)$/i.test(IDNumber))
                return "身份证号格式错误"
            number = IDNumber
        }
        var strBirthday = number.substr(6, 4) + "/" + number.substr(10, 2) + "/" + number.substr(12, 2);
        //时间字符串里，必须是“/”
        var birthDate = new Date(strBirthday);
        var nowDateTime = new Date();
        var age = nowDateTime.getFullYear() - birthDate.getFullYear();
        //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
        if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
            age--;
        }
        if (isNaN(age)) return msg
        return age
    },
    CalcCategoryDegree(Certificate) {
        var category = Number(Certificate.substr(18, 1))
        var degree = Number(Certificate.substr(19, 1))
        if (category > 7) return null
        if (degree > 4) return null
        return {
            category: category,
            degree: degree
        }
    },
    Alert(title, content) {
        AlertModule.show({
            title: title,
            content: content,
            'hide-on-blur': true
        })
    },
    AlertErr(title, content) {
        let res = title.response
        if (res) {
            if (res.data) {
                content = res.data.ExceptionMessage
                title = res.data.Message
            } else {
                content = res.status + '\n' + res.data.ExceptionMessage
                title = '请求服务器数据出错'
            }
        } else {
            content = title.message
            title = '请求服务器数据出错'
        }
        AlertModule.show({
            title: title,
            content: content,
            'hide-on-blur': true
        })
    }
}