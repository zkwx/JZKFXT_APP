import http from '@/http/http.js'
export default {
    async getCategories() {
        return await http.get('Categories')
    },
    async getDegrees() {
        return await http.get('Degrees')
    },
    async getNexts() {
        return await http.get('Nexts')
    },
    async getRehabilitationData() {
        return await http.get('Rehabilitations?group=true')
    },
    async getDisableds(param) {
        return await http.get('Disableds', param)
    },
    async getDisabled(ID) {
        return await http.get('Disableds/' + ID)
    },
    async getDisabilityReasons(categoryID) {
        return await http.get('DisabilityReasons?categoryID=' + categoryID)
    },
    //查询问题
    async getQuestions() {
        return await http.get('Questions?loadQuestions=true')
    },
    //查询试卷
    async getExam(examID) {
        return await http.get('Exams/' + examID)
    },
    //查询答案
    async getAnswers(param) {
        return await http.get('Answers' + param)
    },
    //查询试卷记录
    async getExamRecords(param) {
        return await http.get('ExamRecords', param)
    },
    //查询权限
    async getRoles() {
        return await http.get('Roles')
    },
    //查询指定辅具
    async getAssistiveDevice(id) {
        return await http.get('AssistiveDevices/' + id)
    },
    //查询所有辅具
    async getAllAssistives() {
        return await http.get('AssistiveDevices')
    },
    //查询辅具
    async getAssistiveAnswers(param) {
        return await http.get('AssistiveAnswers' + param)
    },
    //查询指定试卷记录
    async getExamRecord(param) {
        return await http.get('ExamRecords/Select' + param)
    },
    //康复服务修改试卷记录
    async postExamRecord(param) {
        return await http.post('ExamRecords/Change' + param)
    },
    //添加试卷记录
    async addExamRecode(param) {
        return await http.post('ExamRecords', param);
    },
    //登录
    async loginUser(param) {
        return await http.get('User', param);
    },
    async getUser(id) {
        return await http.get("Users/" + id);
    },
    //查询患者(进行中)
    async getConduct(param) {
        return await http.get('Disabled/Conduct', param);
    },
    //查询患者(完成)
    async getFinish(param) {
        return await http.get('Disabled/Finish', param);
    },
    //查询用户权限
    async getRole(id) {
        return await http.get('Roles/' + id);
    },
    //查询辅具数量
    async getAssistNumber(param) {
        return await http.get("AssistiveAnswers" + param);
    },
}