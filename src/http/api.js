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
    async getQuestions() {
        return await http.get('Questions?loadQuestions=true')
    },
    async getExam(examID) {
        return await http.get('Exams/' + examID)
    },
    async getAnswers(param) {
        return await http.get('Answers' + param)
    },
    async getExamRecords(param) {
        return await http.get('ExamRecords', param)
    },
    async getRoles() {
        return await http.get('Roles')
    },
    async getAssistiveDevice(id) {
        return await http.get('AssistiveDevices/' + id)
    },
    async getAllAssistives() {
        return await http.get('AssistiveDevices')
    },
    async getAssistiveAnswers(param) {
        return await http.get('AssistiveAnswers' + param)
    },
    async getExamRecord(param) {
        return await http.get('ExamRecords/Select' + param)
    },
    async addExamRecode(param) {
        return await http.post('ExamRecords', param);
    },
    async loginUser(param) {
        return await http.get('User', param);
    }
}